import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }  // Changed from accountId to id
) {
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
    
    const account = await prisma.bankAccount.findFirst({
      where: {
        id: parseInt(params.id),  // Changed from params.accountId to params.id
        customerId: customer.id,
      },
    });
    
    if (!account) {
      return NextResponse.json(
        { error: "Account not found or does not belong to you" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }  // Changed from accountId to id
) {
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
    
    const account = await prisma.bankAccount.findFirst({
      where: {
        id: parseInt(params.id),  // Changed from params.accountId to params.id
        customerId: customer.id,
      },
    });
    
    if (!account) {
      return NextResponse.json(
        { error: "Account not found or does not belong to you" },
        { status: 404 }
      );
    }
    
    const data = await request.json();
    
    // Don't allow changing critical fields like balance
    delete data.balance;
    delete data.accountNumber;
    delete data.customerId;
    
    const updatedAccount = await prisma.bankAccount.update({
      where: { id: parseInt(params.id) },  // Changed from params.accountId to params.id
      data,
    });
    
    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }  // Changed from accountId to id
) {
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
    
    const account = await prisma.bankAccount.findFirst({
      where: {
        id: parseInt(params.id),  // Changed from params.accountId to params.id
        customerId: customer.id,
      },
    });
    
    if (!account) {
      return NextResponse.json(
        { error: "Account not found or does not belong to you" },
        { status: 404 }
      );
    }
    
    // Instead of deleting, set status to CLOSED
    const closedAccount = await prisma.bankAccount.update({
      where: { id: parseInt(params.id) },  // Changed from params.accountId to params.id
      data: { status: "CLOSED" },
    });
    
    return NextResponse.json(closedAccount);
  } catch (error) {
    console.error("Error closing account:", error);
    return NextResponse.json(
      { error: "Failed to close account" },
      { status: 500 }
    );
  }
}