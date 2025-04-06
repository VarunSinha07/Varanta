"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Plus, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Transaction {
  id: string
  date: string
  transactionType: "DEPOSIT" | "REFUND" | string
  account?: {
    accountNumber: string
  }
  amount: string
  description?: string
  status: "COMPLETED" | "PENDING" | string
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchTransactions = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/transactions", {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `Failed to fetch transactions: ${response.status} ${response.statusText}`
        );
      }
  
      const data = await response.json();
      setTransactions(data);
      
      if (refreshing) {
        toast({
          title: "Transactions refreshed",
          description: "Your transaction data has been updated",
        });
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast, refreshing]);

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-blue-400 h-12 w-12 blur-sm"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="container mx-auto px-4 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
          Transaction History
        </h1>
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={fetchTransactions}
              variant="outline"
              className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push("/dashboard/transactions/create")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {transactions.length === 0 ? (
          <motion.div
            key="no-transactions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  No Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <p className="mb-6 text-center text-gray-700">You don&apos;t have any transactions yet.</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => router.push("/dashboard/transactions/create")}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    >
                      Make Your First Transaction
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="transactions-table" variants={itemVariants}>
            <Card className="overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  All Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-blue-50">
                      <TableRow>
                        <TableHead className="text-blue-700">Date</TableHead>
                        <TableHead className="text-blue-700">Type</TableHead>
                        <TableHead className="text-blue-700">Account</TableHead>
                        <TableHead className="text-blue-700">Amount</TableHead>
                        <TableHead className="text-blue-700">Description</TableHead>
                        <TableHead className="text-blue-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {transactions.map((transaction, index) => (
                          <motion.tr
                            key={transaction.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: { delay: index * 0.05 },
                            }}
                            exit={{ opacity: 0, y: -10 }}
                            whileHover={{
                              backgroundColor: "rgba(191, 219, 254, 0.1)",
                              transition: { duration: 0.2 },
                            }}
                            className="group"
                          >
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell className="font-medium">{transaction.transactionType}</TableCell>
                            <TableCell>{transaction.account ? transaction.account.accountNumber : "N/A"}</TableCell>
                            <TableCell
                              className={
                                transaction.transactionType === "DEPOSIT" || transaction.transactionType === "REFUND"
                                  ? "text-emerald-600 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              <motion.span
                                initial={false}
                                animate={{ scale: refreshing ? [1, 1.1, 1] : 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                {transaction.transactionType === "DEPOSIT" || transaction.transactionType === "REFUND"
                                  ? "+"
                                  : "-"}
                                ${Number.parseFloat(transaction.amount).toFixed(2)}
                              </motion.span>
                            </TableCell>
                            <TableCell>{transaction.description || "N/A"}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  transaction.status === "COMPLETED"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : transaction.status === "PENDING"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {transaction.status}
                              </span>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}