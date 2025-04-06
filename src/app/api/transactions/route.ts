import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { TransactionType } from "@prisma/client";

export async function GET() {
  try {
    const session = await Session();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the customer associated with the logged-in user
    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer profile not found" },
        { status: 404 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: { customerId: customer.id },
      include: {
        account: true,
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
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accountId, amount, transactionType, description } = body;

    // Find the customer associated with the logged-in user
    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer profile not found" },
        { status: 404 }
      );
    }

    // Find the account
    const account = await prisma.bankAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Check if the account belongs to the customer
    if (account.customerId !== customer.id) {
      return NextResponse.json(
        { error: "Unauthorized to perform transaction on this account" },
        { status: 403 }
      );
    }

    // Update account balance based on transaction type
    let newBalance = parseFloat(account.balance.toString());
    if (transactionType === TransactionType.DEPOSIT) {
      newBalance += parseFloat(amount);
    } else if (transactionType === TransactionType.WITHDRAWAL) {
      if (newBalance < parseFloat(amount)) {
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        );
      }
      newBalance -= parseFloat(amount);
    }

    // Create transaction and update account balance in a transaction
    const result = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          customerId: customer.id,
          accountId,
          amount: parseFloat(amount),
          transactionType: transactionType as TransactionType,
          description,
        },
      }),
      prisma.bankAccount.update({
        where: { id: accountId },
        data: { balance: newBalance },
      }),
    ]);

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}