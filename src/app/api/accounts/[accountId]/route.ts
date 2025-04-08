import { NextRequest, NextResponse } from "next/server"
import { Session } from "@/lib/session"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await Session();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { pin } = await request.json()

    // Validate PIN format
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "PIN must be exactly 4 digits" },
        { status: 400 }
      )
    }

    // Find the account
    const account = await prisma.bankAccount.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
      },
    })

    // Check if account exists and belongs to the current user
    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      )
    }

    if (account.customer.user.id !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to set PIN for this account" },
        { status: 403 }
      )
    }

    // Check if account is approved
    if (account.approvalStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Cannot set PIN for an unapproved account" },
        { status: 400 }
      )
    }

    // Hash the PIN
    const hashedPin = await bcrypt.hash(pin, 10)

    // Update the account with the hashed PIN
    await prisma.bankAccount.update({
      where: {
        id: parseInt(id),
      },
      data: {
        pin: hashedPin,
        status: "ACTIVE", // Activate the account once PIN is set
      },
    })

    return NextResponse.json({
      success: true,
      message: "PIN set successfully",
    })
  } catch (error) {
    console.error("Error setting account PIN:", error)
    return NextResponse.json(
      { error: "Failed to set account PIN" },
      { status: 500 }
    )
  }
}