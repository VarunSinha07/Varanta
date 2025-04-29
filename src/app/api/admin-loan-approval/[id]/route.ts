import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is admin (case-insensitive)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Make role check case-insensitive
    if (user.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }
    
    const { action } = await request.json();
    
    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }
    
    // This is an account approval endpoint, so we should be looking for a bank account, not a loan application
    const account = await prisma.bankAccount.findUnique({
      where: { id: parseInt(params.id) },
    });
    
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    
    const updatedAccount = await prisma.bankAccount.update({
      where: { id: parseInt(params.id) },
      data: {
        approvalStatus: action === "approve" ? "APPROVED" : "REJECTED",
        status: action === "approve" ? "ACTIVE" : "INACTIVE",
      },
    });
    
    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error processing account approval:", error);
    return NextResponse.json(
      { error: "Failed to process account approval" },
      { status: 500 }
    );
  }
}