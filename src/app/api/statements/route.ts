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
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    
    const statements = await prisma.statementRequest.findMany({
      where: {
        customerId: customer.id,
      },
      include: {
        account: {
          select: {
            accountNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(statements);
  } catch (error) {
    console.error("Error fetching statements:", error);
    return NextResponse.json(
      { error: "Failed to fetch statements" },
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
    const { accountId, startDate, endDate, format } = data;
    
    // Validate required fields
    if (!accountId || !startDate || !endDate || !format) {
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
    
    // Create statement request
    const statement = await prisma.statementRequest.create({
      data: {
        customerId: customer.id,
        accountId: parseInt(accountId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        format: format,
        status: "PROCESSING",
      },
    });
    
    return NextResponse.json(statement);
  } catch (error) {
    console.error("Error creating statement request:", error);
    return NextResponse.json(
      { error: "Failed to create statement request" },
      { status: 500 }
    );
  }
}