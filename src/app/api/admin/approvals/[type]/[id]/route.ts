import { NextRequest, NextResponse } from "next/server"
import { Session } from "@/lib/session";
import prisma from "@/lib/prisma"
import { generateAccountNumber } from "@/lib/utils"

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const session = await Session();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, id } = params
    const { action } = await request.json()

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const approvalStatus = action === "approve" ? "APPROVED" : "REJECTED"

    if (type === "profiles") {
      const customer = await prisma.customer.update({
        where: {
          id: parseInt(id),
        },
        data: {
          approvalStatus,
        },
        include: {
          user: true,
        },
      })

      // Send notification to user (in a real app, you'd send an email)
      console.log(`Profile ${action}d for user: ${customer.user.email}`)

      return NextResponse.json({ success: true, customer })
    } else if (type === "accounts") {
      // For account approvals, generate an account number if approved
      if (action === "approve") {
        const account = await prisma.bankAccount.update({
          where: {
            id: parseInt(id),
          },
          data: {
            approvalStatus,
            accountNumber: generateAccountNumber(),
          },
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        })

        // Send notification to user
        console.log(`Account ${action}d for user: ${account.customer.user.email}`)

        return NextResponse.json({ success: true, account })
      } else {
        const account = await prisma.bankAccount.update({
          where: {
            id: parseInt(id),
          },
          data: {
            approvalStatus,
          },
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        })

        // Send notification to user
        console.log(`Account ${action}d for user: ${account.customer.user.email}`)

        return NextResponse.json({ success: true, account })
      }
    } else if (type === "loans") {
      const loan = await prisma.loanApplication.update({
        where: {
          id: parseInt(id),
        },
        data: {
          approvalStatus,
        },
        include: {
          customer: {
            include: {
              user: true,
            },
          },
        },
      })

      // If approved, create a transaction to deposit the loan amount
      if (action === "approve") {
        // Find the customer's primary account
        const account = await prisma.bankAccount.findFirst({
          where: {
            customerId: loan.customerId,
            approvalStatus: "APPROVED",
          },
        })

        if (account) {
          // Create a deposit transaction
          await prisma.transaction.create({
            data: {
              transactionType: "DEPOSIT",
              amount: loan.amount,
              customerId: loan.customerId,
              accountId: account.id,
              description: `Loan disbursement - ${loan.purpose}`,
              status: "COMPLETED",
            },
          })

          // Update account balance
          await prisma.bankAccount.update({
            where: {
              id: account.id,
            },
            data: {
              balance: {
                increment: loan.amount,
              },
            },
          })
        }
      }

      // Send notification to user
      console.log(`Loan ${action}d for user: ${loan.customer.user.email}`)

      return NextResponse.json({ success: true, loan })
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
  } catch (error) {
    console.error(`Error ${params.type} approval:`, error)
    return NextResponse.json(
      { error: `Failed to process ${params.type} approval` },
      { status: 500 }
    )
  }
}