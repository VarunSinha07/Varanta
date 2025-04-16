import { NextResponse } from "next/server"
import { Session } from "@/lib/session";
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await Session();

    if (!session || !session.user ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

    // Get total customers
    const totalCustomers = await prisma.customer.count()

    // Get total accounts
    const totalAccounts = await prisma.bankAccount.count({
      where: {
        approvalStatus: "APPROVED",
      },
    })

    // Get total transactions
    const totalTransactions = await prisma.transaction.count()

    // Get pending approvals
    const pendingProfiles = await prisma.customer.count({
      where: {
        approvalStatus: "PENDING",
      },
    })

    const pendingAccounts = await prisma.bankAccount.count({
      where: {
        approvalStatus: "PENDING",
      },
    })

    const pendingLoans = await prisma.loanApplication.count({
      where: {
        approvalStatus: "PENDING",
      },
    })

    const pendingApprovals = pendingProfiles + pendingAccounts + pendingLoans

    // Get total balance across all accounts
    const accounts = await prisma.bankAccount.findMany({
      where: {
        approvalStatus: "APPROVED",
      },
      select: {
        balance: true,
      },
    })

    const totalBalance = accounts.reduce(
      (sum: number, account) => sum + parseFloat(account.balance.toString()),
      0
    )

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
        account: {
          select: {
            accountNumber: true,
          },
        },
      },
    })

    return NextResponse.json({
      totalCustomers,
      totalAccounts,
      totalTransactions,
      pendingApprovals,
      totalBalance,
      recentTransactions,
    })
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}