import { NextRequest, NextResponse } from "next/server"
import { Session } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await Session();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const type = request.nextUrl.searchParams.get("type") || "profiles"

    if (type === "profiles") {
      const profiles = await prisma.customer.findMany({
        where: {
          approvalStatus: "PENDING",
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return NextResponse.json(profiles)
    } else if (type === "accounts") {
      const accounts = await prisma.bankAccount.findMany({
        where: {
          approvalStatus: "PENDING",
        },
        include: {
          customer: {
            select: {
              name: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return NextResponse.json(accounts)
    } else if (type === "loans") {
      const loans = await prisma.loanApplication.findMany({
        where: {
          approvalStatus: "PENDING",
        },
        include: {
          customer: {
            select: {
              name: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return NextResponse.json(loans)
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching approval requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch approval requests" },
      { status: 500 }
    )
  }
}