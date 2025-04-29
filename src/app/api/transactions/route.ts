import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";
import bcrypt from "bcryptjs";

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
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    
    const transactions = await prisma.transaction.findMany({
      where: {
        customerId: customer.id,
      },
      include: {
        account: {
          select: {
            accountNumber: true,
            accountType: true,
          },
        },
        receiverAccount: {
          select: {
            accountNumber: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
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
    
    // Get customer ID for the current user
    const customer = await prisma.customer.findFirst({
      where: { userId: session.user.id },
    });
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    
    const data = await request.json();
    const { 
      accountId, 
      amount, 
      recipientAccountNumber, 
      recipientAccountType, 
      pin, 
      reason 
    } = data;
    
    // Validate required fields
    if (!accountId || !amount || !recipientAccountNumber || !recipientAccountType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate account belongs to customer
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
    
    // Validate account is active
    if (account.status !== "ACTIVE" || account.approvalStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Cannot perform transactions on inactive or unapproved accounts" },
        { status: 400 }
      );
    }
    
    // Verify PIN if provided
    if (pin) {
      // Check if account has a PIN set
      if (!account.pin) {
        return NextResponse.json(
          { error: "PIN not set for this account" },
          { status: 400 }
        );
      }
      
      const isPinValid = await bcrypt.compare(pin, account.pin);
      if (!isPinValid) {
        return NextResponse.json(
          { error: "Invalid PIN" },
          { status: 401 }
        );
      }
    }
    
    // Validate amount is positive
    const amountValue = new Decimal(amount);
    if (amountValue.lte(0)) {
      return NextResponse.json(
        { error: "Amount must be positive" },
        { status: 400 }
      );
    }
    
    // Check sufficient balance for transfer
    if (account.balance.lt(amountValue)) {
      return NextResponse.json(
        { error: "Insufficient balance for transfer" },
        { status: 400 }
      );
    }
    
    // Find recipient account by account number and type
    const receiverAccount = await prisma.bankAccount.findFirst({
      where: {
        accountNumber: recipientAccountNumber,
        accountType: recipientAccountType,
        status: "ACTIVE",
        approvalStatus: "APPROVED"
      },
    });
    
    if (!receiverAccount) {
      return NextResponse.json(
        { error: "Recipient account not found or is not active" },
        { status: 404 }
      );
    }
    
    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          transactionId: `TXN${Date.now()}`,
          customerId: customer.id,
          accountId: parseInt(accountId),
          receiverAccountId: receiverAccount.id,
          amount: amountValue,
          transactionType: "TRANSFER",
          status: "COMPLETED",
          reason: reason || null,
          description: `Transfer to account ${recipientAccountNumber}`,
        },
      });
      
      // Deduct from sender account
      await tx.bankAccount.update({
        where: { id: parseInt(accountId) },
        data: { 
          balance: {
            decrement: amountValue
          } 
        },
      });
      
      // Add to receiver account
      await tx.bankAccount.update({
        where: { id: receiverAccount.id },
        data: { 
          balance: {
            increment: amountValue
          } 
        },
      });
      
      return transaction;
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}