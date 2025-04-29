import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { pin } = await request.json();
    
    // Validate PIN format
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "PIN must be exactly 4 digits" },
        { status: 400 }
      );
    }
    
    // Get the account
    const account = await prisma.bankAccount.findUnique({
      where: { id: parseInt(params.id) },
      include: { customer: true },
    });
    
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    
    // Check if the account belongs to the logged-in user
    if (account.customer.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Check if account is approved
    if (account.approvalStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Account must be approved before setting a PIN" },
        { status: 400 }
      );
    }
    
    // Hash the PIN before storing
    const hashedPin = await bcrypt.hash(pin, 10);
    
    // Update the account with the hashed PIN
    const updatedAccount = await prisma.bankAccount.update({
      where: { id: parseInt(params.id) },
      data: { pin: hashedPin },
    });
    
    return NextResponse.json({
      message: "PIN set successfully",
      accountId: updatedAccount.id,
    });
  } catch (error) {
    console.error("Error setting account PIN:", error);
    return NextResponse.json(
      { error: "Failed to set account PIN" },
      { status: 500 }
    );
  }
}