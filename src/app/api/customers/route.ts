import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";

export async function GET() {
  try {
    const session = await Session();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customers = await prisma.customer.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(customers);
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
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, dob, phone, address } = body;

    // Create customer linked to the current user
    const customer = await prisma.customer.create({
      data: {
        userId: session.user.id,
        name,
        dob: new Date(dob),
        phone,
        address,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}