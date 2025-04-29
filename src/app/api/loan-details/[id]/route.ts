import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(

{ params: {} }
) {
  // ... existing code ...
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
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
    
    const loan = await prisma.loan.findFirst({
      where: {
        id: parseInt(params.id),
        customerId: customer.id,
      },
    });
    
    if (!loan) {
      return NextResponse.json(
        { error: "Loan not found or does not belong to you" },
        { status: 404 }
      );
    }
    
    // Only allow updating certain fields and only if loan is still pending
    if (loan.status !== "PENDING") {
      return NextResponse.json(
        { error: "Cannot update loan after it has been processed" },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // Fix: Use the proper Prisma update syntax
    const updatedLoan = await prisma.loan.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(data.purpose && { purpose: data.purpose as string })
      }
    });
    
    return NextResponse.json(updatedLoan);
  } catch (error) {
    console.error("Error updating loan:", error);
    return NextResponse.json(
      { error: "Failed to update loan" },
      { status: 500 }
    );
  }
}