import prisma from "@/lib/prisma";
import { Session } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const session = await Session();
      
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      // Check if user is admin
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });
      
      if (!user || user.role.toLowerCase() !== "admin") {
        return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
      }
      
      // Get counts for dashboard
      const [
        totalCustomers,
        pendingCustomers,
        totalAccounts,
        pendingAccounts,
        totalTransactions,
        pendingLoans,
        recentTransactions,
        accountsWithBalance
      ] = await Promise.all([
        prisma.customer.count(),
        prisma.customer.count({ where: { approvalStatus: "PENDING" } }),
        prisma.bankAccount.count(),
        prisma.bankAccount.count({ where: { approvalStatus: "PENDING" } }),
        prisma.transaction.count(),
        prisma.loanApplication.count({ where: { approvalStatus: "PENDING" } }),
        prisma.transaction.findMany({
          take: 10,
          orderBy: { date: "desc" },
          include: {
            customer: { select: { name: true } },
            account: { select: { accountNumber: true } }
          }
        }),
        prisma.bankAccount.findMany({
          select: { balance: true }
        })
      ]);
      
      console.log("Accounts with balance:", accountsWithBalance);
      
      // Calculate total balance across all accounts with safer parsing
      let totalBalance = 0;
      try {
        totalBalance = accountsWithBalance.reduce((sum, account) => {
          // Ensure balance is a valid number
          const balanceValue = account && account.balance ? parseFloat(String(account.balance)) : 0;
          return sum + (isNaN(balanceValue) ? 0 : balanceValue);
        }, 0);
      } catch (balanceError) {
        console.error("Error calculating total balance:", balanceError);
        totalBalance = 0; // Fallback to 0 if calculation fails
      }
      
      // Calculate total pending approvals
      const pendingApprovals = pendingCustomers + pendingAccounts + pendingLoans;
      
      // Create the stats object structure that the frontend expects
      const responseData = {
        stats: {
          totalCustomers,
          totalAccounts,
          totalTransactions,
          pendingApprovals,
          totalBalance
        },
        recentTransactions
      };
      
      console.log("Dashboard response data:", responseData);
      
      return NextResponse.json(responseData);
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      return NextResponse.json(
        { error: "Failed to fetch admin dashboard data" },
        { status: 500 }
      );
    }
}