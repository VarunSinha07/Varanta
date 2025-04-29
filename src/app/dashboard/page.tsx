"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, CreditCard, ArrowUpRight, ArrowDownLeft, Wallet, Landmark, PiggyBank, Send } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Account {
  id: number
  accountNumber: string
  accountType: string
  balance: number
  status: string
  approvalStatus: string
}

interface Transaction {
  id: number
  transactionId: string
  amount: number
  transactionType: string
  status: string
  description: string
  createdAt: string
}

interface Loan {
  id: number
  loanNumber: string
  amount: number
  status: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [totalBalance, setTotalBalance] = useState(0)
  const [totalLoans, setTotalLoans] = useState(0)

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await fetch("/api/accounts")
      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
        
        // Calculate total balance from active accounts
        const total = data
          .filter((account: Account) => account.status === "ACTIVE")
          .reduce((sum: number, account: Account) => sum + account.balance, 0)
        setTotalBalance(total)
      } else {
        throw new Error("Failed to fetch accounts")
      }
    } catch (error) {
      console.error("Error fetching accounts:", error)
      toast({
        title: "Error",
        description: "Failed to load accounts",
        variant: "destructive",
      })
    }
  }, [toast])

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch("/api/transactions")
      if (response.ok) {
        const data = await response.json()
        // Get only the 5 most recent transactions
        setTransactions(data.slice(0, 5))
      } else {
        throw new Error("Failed to fetch transactions")
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      })
    }
  }, [toast])

  const fetchLoans = useCallback(async () => {
    try {
      const response = await fetch("/api/loans")
      if (response.ok) {
        const data = await response.json()
        setLoans(data)
        
        // Calculate total active loans
        const total = data
          .filter((loan: Loan) => loan.status === "ACTIVE")
          .reduce((sum: number, loan: Loan) => sum + loan.amount, 0)
        setTotalLoans(total)
      } else {
        throw new Error("Failed to fetch loans")
      }
    } catch (error) {
      console.error("Error fetching loans:", error)
      toast({
        title: "Error",
        description: "Failed to load loans",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    Promise.all([
      fetchAccounts(),
      fetchTransactions(),
      fetchLoans()
    ]).finally(() => {
      setLoading(false)
    })
  }, [fetchAccounts, fetchTransactions, fetchLoans])



  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          onClick={() => router.push("/dashboard/transactions/create")}
          className="bg-green-600 hover:bg-green-700"
        >
          <Send className="mr-2 h-4 w-4" />
          Make Payment
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Across {accounts.filter(a => a.status === "ACTIVE").length} active accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Loans
            </CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalLoans)}</div>
            <p className="text-xs text-muted-foreground">
              Across {loans.filter(l => l.status === "ACTIVE").length} active loans
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter(a => a.status !== "CLOSED" && a.approvalStatus === "PENDING").length + 
               loans.filter(l => l.status === "PENDING").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Accounts and loans awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Accounts Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Accounts</h2>
          <Link href="/dashboard/accounts">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        {accounts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Accounts Found</CardTitle>
              <CardDescription>
                You don&apos;t have any bank accounts yet.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/dashboard/accounts/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Open New Account
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.slice(0, 3).map((account) => (
              <Card key={account.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/dashboard/accounts/${account.id}`)}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <CreditCard className="mr-2 h-5 w-5" />
                    {account.accountType.replace("_", " ")}
                  </CardTitle>
                  <CardDescription>
                    {account.accountNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(account.balance)}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {accounts.length > 0 && accounts.length < 3 && (
              <Card className="border-dashed hover:border-primary/50 cursor-pointer" onClick={() => router.push("/dashboard/accounts/create")}>
                <CardHeader className="flex items-center justify-center h-[140px]">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                  <CardTitle className="text-lg mt-2">Open New Account</CardTitle>
                </CardHeader>
              </Card>
            )}
          </div>
        )}
      </div>
      
      {/* Recent Transactions Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push("/dashboard/transactions/create")}
            >
              <Send className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
            <Link href="/dashboard/transactions">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </div>
        
        {transactions.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Transactions Found</CardTitle>
              <CardDescription>
                You don&apos;t have any transactions yet.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/dashboard/transactions/create")}>
                <Send className="mr-2 h-4 w-4" />
                Make a Transaction
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="p-4 hover:bg-muted/50 cursor-pointer"
                    onClick={() => router.push(`/dashboard/transactions/${transaction.id}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          transaction.transactionType === "DEPOSIT" ? "bg-green-100" : 
                          transaction.transactionType === "WITHDRAWAL" ? "bg-red-100" : 
                          "bg-blue-100"
                        }`}>
                          {transaction.transactionType === "DEPOSIT" ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          ) : transaction.transactionType === "WITHDRAWAL" ? (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.transactionType === "DEPOSIT" ? "text-green-600" : 
                          "text-red-600"
                        }`}>
                          {transaction.transactionType === "DEPOSIT" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}