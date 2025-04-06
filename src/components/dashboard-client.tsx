"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowUpRight, BarChart3, CreditCard, DollarSign, RefreshCw, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
}

interface Account {
  id: string
  accountType: string
  accountNumber: string
  balance: string
}

interface Transaction {
  id: string
  transactionType: string
  amount: string
  date: string
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

export default function DashboardClient({
  initialCustomer,
  initialAccounts,
  initialTransactions,
}: {
  initialCustomer: Customer | null
  initialAccounts: Account[]
  initialTransactions: Transaction[]
}) {
  const [customer] = useState(initialCustomer)
  const [accounts, setAccounts] = useState(initialAccounts)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const refreshData = async () => {
    setLoading(true)
    try {
      const [accountsRes, transactionsRes] = await Promise.all([fetch("/api/accounts"), fetch("/api/transactions")])

      if (!accountsRes.ok || !transactionsRes.ok) {
        throw new Error(
          `Failed to fetch data: 
           Accounts - ${accountsRes.status} ${accountsRes.statusText}
           Transactions - ${transactionsRes.status} ${transactionsRes.statusText}`,
        )
      }

      const [accountsData, transactionsData] = await Promise.all([accountsRes.json(), transactionsRes.json()])

      setAccounts(accountsData)
      setTransactions(transactionsData)

      toast({
        title: "Data refreshed",
        description: "Your dashboard has been updated with the latest data",
      })
    } catch (error) {
      console.error("Refresh error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to refresh data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!customer) {
    return (
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md mx-auto overflow-hidden border-none shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardTitle className="text-center text-2xl">Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="mb-6 text-center text-gray-700">
                You need to complete your customer profile to access the banking features.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => router.push("/dashboard/profile/create")}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-2 px-4 rounded-md shadow-md"
                >
                  Create Profile
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const totalBalance = accounts.reduce((sum, account) => sum + Number.parseFloat(account.balance), 0).toFixed(2)

  return (
    <motion.div className="container mx-auto px-4 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
          Welcome to Your Dashboard
        </h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh Data"}
          </Button>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-emerald-700">
                <Wallet className="mr-2 h-5 w-5 text-emerald-500" />
                Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold text-gray-800">{accounts.length}</p>
                <p className="text-sm text-gray-500">Active accounts</p>
              </div>
              <motion.div className="mt-6" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={() => router.push("/dashboard/accounts")}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                >
                  View Accounts
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-blue-700">
                <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold text-gray-800">{transactions.length}</p>
                <p className="text-sm text-gray-500">Total transactions</p>
              </div>
              <motion.div className="mt-6" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={() => router.push("/dashboard/transactions")}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  View Transactions
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-purple-700">
                <DollarSign className="mr-2 h-5 w-5 text-purple-500" />
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold text-gray-800">${totalBalance}</p>
                <p className="text-sm text-gray-500">Combined assets</p>
              </div>
              <div className="mt-6 h-10 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="text-sm font-medium text-purple-700"
                >
                  Updated just now
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-none shadow-lg h-full">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {transactions.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-gray-500 py-8"
                >
                  No transactions yet
                </motion.p>
              ) : (
                <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                  {transactions.slice(0, 5).map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{
                        x: 5,
                        backgroundColor: "rgba(243, 244, 246, 0.7)",
                        transition: { duration: 0.2 },
                      }}
                      className="flex justify-between items-center border-b pb-3 rounded-lg p-2"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{transaction.transactionType}</p>
                        <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      <p
                        className={`font-bold ${
                          transaction.transactionType === "DEPOSIT" ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {transaction.transactionType === "DEPOSIT" ? "+" : "-"}$
                        {Number.parseFloat(transaction.amount).toFixed(2)}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {transactions.length > 0 && (
                <motion.div
                  className="mt-6"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => router.push("/dashboard/transactions")}
                  >
                    View All Transactions
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-none shadow-lg h-full">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Your Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {accounts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center py-6"
                >
                  <p className="mb-4 text-gray-500">No accounts yet</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => router.push("/dashboard/accounts/create")}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    >
                      Open New Account
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                  {accounts.map((account, index) => (
                    <motion.div
                      key={account.id}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{
                        x: 5,
                        backgroundColor: "rgba(243, 244, 246, 0.7)",
                        transition: { duration: 0.2 },
                      }}
                      className="flex justify-between items-center border-b pb-3 rounded-lg p-2"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{account.accountType} Account</p>
                        <p className="text-sm text-gray-500">{account.accountNumber}</p>
                      </div>
                      <p className="font-bold text-gray-800">${Number.parseFloat(account.balance).toFixed(2)}</p>
                    </motion.div>
                  ))}
                  <motion.div
                    className="mt-6"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => router.push("/dashboard/accounts")}
                    >
                      Manage Accounts
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

