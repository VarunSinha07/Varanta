import prisma  from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Find the customer for the logged-in user
    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!customer) {
      return NextResponse.json(
        { error: "Please create a customer profile first" },
        { status: 400 }
      );
    }
    
    // Check if customer profile is approved
    if (customer.approvalStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Your profile must be approved before opening an account" },
        { status: 400 }
      );
    }
    
    const { accountType, initialDeposit, branchName } = await request.json();
    
    // Validate required fields
    if (!accountType || !initialDeposit || !branchName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate initial deposit
    const deposit = parseFloat(initialDeposit);
    if (isNaN(deposit) || deposit < 500) {
      return NextResponse.json(
        { error: "Initial deposit must be at least ₹500" },
        { status: 400 }
      );
    }
    
    // Generate a random account number (16 digits)
    const accountNumber = Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 10)
    ).join("");
    
    // Set interest rate based on account type
    let interestRate = null;
    if (accountType === "SAVINGS") {
      interestRate = 3.5;
    } else if (accountType === "FIXED_DEPOSIT") {
      interestRate = 6.5;
    } else if (accountType === "RECURRING_DEPOSIT") {
      interestRate = 5.5;
    }
    
    // Create the new account - IMPORTANT: Set approvalStatus to PENDING and status to INACTIVE
    const account = await prisma.bankAccount.create({
      data: {
        customerId: customer.id,
        accountNumber,
        accountType,
        balance: deposit,
        branchName,
        interestRate,
        approvalStatus: "PENDING", // Ensure this is PENDING
        status: "INACTIVE", // Account is inactive until approved
      },
    });
    
    // Create a deposit transaction for the initial amount
    await prisma.transaction.create({
      data: {
        transactionId: `DEP${Date.now()}`,
        amount: deposit,
        transactionType: "DEPOSIT",
        customerId: customer.id,
        accountId: account.id,
        description: "Initial deposit",
        status: "COMPLETED",
      },
    });
    
    return NextResponse.json(account);
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}