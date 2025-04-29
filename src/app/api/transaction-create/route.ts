import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await request.json();
    const { accountId, transactionType, amount, receiverAccountId, pin, reason } = data;
    
    // Validate required fields
    if (!accountId || !transactionType || !amount) {
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
        { error: "Customer profile not found" },
        { status: 400 }
      );
    }
    
    // Verify account belongs to this customer
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
    
    // Verify PIN
    if (account.pin !== pin) {
      return NextResponse.json(
        { error: "Invalid PIN" },
        { status: 401 }
      );
    }
    
    // Convert amount to number
    const amountValue = parseFloat(amount);
    
    // Validate amount is positive
    if (amountValue <= 0) {
      return NextResponse.json(
        { error: "Amount must be positive" },
        { status: 400 }
      );
    }
    
    // Process based on transaction type
    let transaction;
    
    if (transactionType === "DEPOSIT") {
      // Update account balance
      await prisma.bankAccount.update({
        where: { id: parseInt(accountId) },
        data: { 
          balance: {
            increment: amountValue
          } 
        },
      });
      
      // Create transaction record
      transaction = await prisma.transaction.create({
        data: {
          transactionId: `TXN${Date.now()}`,
          customerId: customer.id,
          accountId: parseInt(accountId),
          amount: amountValue,
          transactionType: "DEPOSIT",
          status: "COMPLETED",
          reason: reason || null,
        },
      });
    } else if (transactionType === "WITHDRAWAL") {
      // Check sufficient balance
      if (account.balance < amountValue) {
        return NextResponse.json(
          { error: "Insufficient balance" },
          { status: 400 }
        );
      }
      
      // Update account balance
      await prisma.bankAccount.update({
        where: { id: parseInt(accountId) },
        data: { 
          balance: {
            decrement: amountValue
          } 
        },
      });
      
      // Create transaction record
      transaction = await prisma.transaction.create({
        data: {
          transactionId: `TXN${Date.now()}`,
          customerId: customer.id,
          accountId: parseInt(accountId),
          amount: amountValue,
          transactionType: "WITHDRAWAL",
          status: "COMPLETED",
          reason: reason || null,
        },
      });
    } else if (transactionType === "TRANSFER") {
      // Validate receiver account
      if (!receiverAccountId) {
        return NextResponse.json(
          { error: "Receiver account ID is required for transfers" },
          { status: 400 }
        );
      }
      
      // Check sufficient balance
      if (account.balance < amountValue) {
        return NextResponse.json(
          { error: "Insufficient balance for transfer" },
          { status: 400 }
        );
      }
      
      const receiverAccount = await prisma.bankAccount.findFirst({
        where: {
          id: parseInt(receiverAccountId),
          status: "ACTIVE",
          approvalStatus: "APPROVED"
        },
      });
      
      if (!receiverAccount) {
        return NextResponse.json(
          { error: "Receiver account not found or is not active" },
          { status: 404 }
        );
      }
      
      // Use a transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx) => {
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
          where: { id: parseInt(receiverAccountId) },
          data: { 
            balance: {
              increment: amountValue
            } 
          },
        });
        
        // Create transaction record
        return await tx.transaction.create({
          data: {
            transactionId: `TXN${Date.now()}`,
            customerId: customer.id,
            accountId: parseInt(accountId),
            receiverAccountId: parseInt(receiverAccountId),
            amount: amountValue,
            transactionType: "TRANSFER",
            status: "COMPLETED",
            reason: reason || null,
          },
        });
      });
      
      transaction = result;
    } else {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}