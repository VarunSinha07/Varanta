"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowUpRight, ArrowDownLeft, Filter } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Transaction {
  id: number
  transactionId: string
  amount: number
  transactionType: string
  status: string
  description: string
  createdAt: string
}

export default function TransactionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("ALL")

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch("/api/transactions")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
        setFilteredTransactions(data)
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
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    if (typeFilter === "ALL") {
      setFilteredTransactions(transactions)
    } else {
      setFilteredTransactions(
        transactions.filter(t => t.transactionType === typeFilter)
      )
    }
  }, [typeFilter, transactions])

  // Removed duplicate fetchTransactions function

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Transactions</h1>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Transactions</SelectItem>
              <SelectItem value="DEPOSIT">Deposits</SelectItem>
              <SelectItem value="WITHDRAWAL">Withdrawals</SelectItem>
              <SelectItem value="TRANSFER">Transfers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Transactions Found</CardTitle>
          </CardHeader>
          <CardContent>
            {typeFilter !== "ALL" ? (
              <p>No {typeFilter.toLowerCase()} transactions found. Try changing the filter.</p>
            ) : (
              <p>You don&apos;t have any transactions yet.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card 
              key={transaction.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/transactions/${transaction.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.transactionType === "DEPOSIT" ? "bg-green-100" : 
                      transaction.transactionType === "WITHDRAWAL" ? "bg-red-100" : 
                      "bg-blue-100"
                    }`}>
                      {transaction.transactionType === "DEPOSIT" ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                      ) : transaction.transactionType === "WITHDRAWAL" ? (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
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
                    <p className="text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        transaction.status === "COMPLETED" ? "bg-green-100 text-green-800" : 
                        transaction.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      }`}>
                        {transaction.status}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}