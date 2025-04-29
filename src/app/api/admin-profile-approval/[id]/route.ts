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
    
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(params.id) },
    });
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    
    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(params.id) },
      data: {
        approvalStatus: action === "approve" ? "APPROVED" : "REJECTED",
      },
    });
    
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error processing profile approval:", error);
    return NextResponse.json(
      { error: "Failed to process profile approval" },
      { status: 500 }
    );
  }
}