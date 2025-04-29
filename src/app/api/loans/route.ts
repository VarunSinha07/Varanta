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
    
    const loans = await prisma.loan.findMany({
      where: { customerId: customer.id },
      include: {
        account: {
          select: {
            accountNumber: true,
          },
        },
      },
    });
    
    return NextResponse.json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    return NextResponse.json(
      { error: "Failed to fetch loans" },
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
    const { accountId, amount, duration, purpose, interestRate } = data;
    
    // Validate required fields
    if (!amount || !duration || !interestRate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
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
    
    // Verify account belongs to this customer
    if (accountId) {
      const account = await prisma.bankAccount.findFirst({
        where: {
          id: parseInt(accountId),
          customerId: customer.id,
        },
      });
      
      if (!account) {
        return NextResponse.json(
          { error: "Account not found or does not belong to you" },
          { status: 404 }
        );
      }
    }
    
    // Calculate end date based on duration (in months)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(duration));
    
    // Create loan application
    const loan = await prisma.loan.create({
      data: {
        customerId: customer.id,
        accountId: accountId ? parseInt(accountId) : null,
        amount: parseFloat(amount),
        duration: parseInt(duration),
        purpose: purpose || "General purpose",
        interestRate: parseFloat(interestRate),
        startDate: startDate,
        endDate: endDate,
        approvalStatus: "PENDING",
        status: "PENDING",
      },
    });
    
    return NextResponse.json(loan);
  } catch (error) {
    console.error("Error creating loan application:", error);
    return NextResponse.json(
      { error: "Failed to create loan application" },
      { status: 500 }
    );
  }
}