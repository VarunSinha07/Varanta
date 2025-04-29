import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/db/getUser";

export async function GET() {
  try {
    const session = await Session();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get user to check role
    const user = await getUser(session.user.id);
    
    // For admin, return all customers
    if (user?.role === "ADMIN") {
      const customers = await prisma.customer.findMany();
      return NextResponse.json(customers);
    }
    
    // For regular users, return only their own customer profile
    const customer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!customer) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
    }
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
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
    const existingCustomer = await prisma.customer.findUnique({
      where: { userId: session.user.id },
    });
    
    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer profile already exists" },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // Create new customer profile
    const customer = await prisma.customer.create({
      data: {
        userId: session.user.id,
        name: data.name,
        dob: new Date(data.dob),
        phone: data.phone,
        address: data.address,
        panNumber: data.panNumber,
        aadharNumber: data.aadharNumber,
      },
    });
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}