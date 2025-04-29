import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const customer = await prisma.customer.findFirst({
      where: { userId: session.user.id },
    });
    
    if (!customer) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer profile" },
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
    
    // Check if customer profile already exists
    const existingCustomer = await prisma.customer.findFirst({
      where: { userId: session.user.id },
    });
    
    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer profile already exists" },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    const { name, dob, phone, address, panNumber, aadharNumber } = data;
    
    // Validate required fields
    if (!name || !dob || !phone || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate PAN number format (if provided)
    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      return NextResponse.json(
        { error: "Invalid PAN number format" },
        { status: 400 }
      );
    }
    
    // Validate Aadhar number format (if provided)
    if (aadharNumber && !/^\d{12}$/.test(aadharNumber)) {
      return NextResponse.json(
        { error: "Invalid Aadhar number format (must be 12 digits)" },
        { status: 400 }
      );
    }
    
    // Create customer profile
    const customer = await prisma.customer.create({
      data: {
        userId: session.user.id,
        name,
        dob: new Date(dob),
        phone,
        address,
        panNumber: panNumber || null,
        aadharNumber: aadharNumber || null,
        approvalStatus: "PENDING",
      },
    });
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error creating customer profile:", error);
    return NextResponse.json(
      { error: "Failed to create customer profile" },
      { status: 500 }
    );
  }
}