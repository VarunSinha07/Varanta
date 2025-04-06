import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { AccountType } from "@prisma/client";

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
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accountType, branchName, interestRate } = body;

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

    // Generate a random account number
    const accountNumber = Math.floor(
      Math.random() * 9000000000 + 1000000000
    ).toString();

    const account = await prisma.bankAccount.create({
      data: {
        accountNumber,
        customerId: customer.id,
        accountType: accountType as AccountType,
        branchName,
        interestRate: interestRate ? parseFloat(interestRate) : null,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}