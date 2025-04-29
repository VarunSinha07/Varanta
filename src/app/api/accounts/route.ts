import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get customer ID for the current user
    const customer = await prisma.customer.findFirst({
      where: { userId: session.user.id },
    });
    
    if (!customer) {
      return NextResponse.json([]);
    }
    
    const accounts = await prisma.bankAccount.findMany({
      where: { customerId: customer.id },
    });
    
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    const { accountType, initialDeposit, branchName } = data;
    
    // Get customer ID for the current user
    const customer = await prisma.customer.findFirst({
      where: { userId: session.user.id },
    });
    
    if (!customer) {
      return NextResponse.json(
        { error: "Customer profile not found. Please create a profile first." },
        { status: 400 }
      );
    }
    
    // Generate a random account number
    const accountNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    // Create the account without initialDeposit field
    const account = await prisma.bankAccount.create({
      data: {
        accountType,
        branchName,
        accountNumber,
        customerId: customer.id,
        balance: 0, // We'll update this after creating the account
        approvalStatus: "APPROVED", // Direct approval for testing
        status: "ACTIVE",
      },
    });
    
    // If initialDeposit is provided, update the account balance
    if (initialDeposit && parseFloat(initialDeposit) > 0) {
      // Update the account with the initial deposit
      await prisma.bankAccount.update({
        where: { id: account.id },
        data: { balance: parseFloat(initialDeposit) },
      });
      
      // Create a deposit transaction record
      await prisma.transaction.create({
        data: {
          accountId: account.id,
          amount: parseFloat(initialDeposit),
          transactionType: "DEPOSIT",
          description: "Initial deposit",
          status: "COMPLETED",
          customerId: customer.id,
        },
      });
    }
    
    // Fetch the updated account
    const updatedAccount = await prisma.bankAccount.findUnique({
      where: { id: account.id },
    });
    
    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}