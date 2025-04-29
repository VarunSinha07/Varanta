import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "profiles";
    
    let data;
    
    if (type === "profiles") {
      data = await prisma.customer.findMany({
        where: { approvalStatus: "PENDING" },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });
    } else if (type === "accounts") {
      data = await prisma.bankAccount.findMany({
        where: { approvalStatus: "PENDING" },
        include: {
          customer: true,
        },
      });
    } else if (type === "loans") {
      data = await prisma.loanApplication.findMany({
        where: { approvalStatus: "PENDING" },
        include: {
          customer: true,
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching approval requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch approval requests" },
      { status: 500 }
    );
  }
}