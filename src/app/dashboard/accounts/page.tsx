"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, Plus, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export default function Accounts() {
  const [accounts, setAccounts] = useState<
    {
      id: string
      accountNumber: string
      accountType: string
      branchName: string
      balance: string
      status: "ACTIVE" | "INACTIVE" | "SUSPENDED"
      approvalStatus: "PENDING" | "APPROVED" | "REJECTED"
      pin: string | null
    }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchAccounts = useCallback(async () => {
    setRefreshing(true)
    try {
      const response = await fetch("/api/accounts", {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAccounts(data)
        if (refreshing) {
          toast({
            title: "Accounts refreshed",
            description: "Your account data has been updated",
          })
        }
      } else {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || 
          `Failed to fetch accounts: ${response.status} ${response.statusText}`
        )
      }
    } catch (error) {
      console.error("Error fetching accounts:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load accounts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [toast, refreshing])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  // Function to set up PIN for an approved account
  const setupPin = async (accountId: string) => {
    const pin = prompt("Please enter a 4-digit PIN for this account:")
    
    if (!pin) return
    
    if (!/^\d{4}$/.test(pin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits",
        variant: "destructive",
      })
      return
    }
    
    try {
      const response = await fetch(`/api/accounts/${accountId}/pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      })
      
      if (response.ok) {
        toast({
          title: "PIN set successfully",
          description: "Your account is now ready to use",
        })
        fetchAccounts()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to set PIN")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set PIN",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-emerald-400 h-12 w-12 blur-sm"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="container mx-auto px-4 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
          Your Accounts
        </h1>
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={fetchAccounts}
              variant="outline"
              className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push("/dashboard/accounts/create")}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Request New Account
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {accounts.length === 0 ? (
          <motion.div
            key="no-accounts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  No Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <p className="mb-6 text-center text-gray-700">You don&apos;t have any bank accounts yet.</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => router.push("/dashboard/accounts/create")}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    >
                      Request Your First Account
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="accounts-table" variants={itemVariants}>
            <Card className="overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  All Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-emerald-50">
                      <TableRow>
                        <TableHead className="text-emerald-700">Account Number</TableHead>
                        <TableHead className="text-emerald-700">Type</TableHead>
                        <TableHead className="text-emerald-700">Branch</TableHead>
                        <TableHead className="text-emerald-700">Balance</TableHead>
                        <TableHead className="text-emerald-700">Status</TableHead>
                        <TableHead className="text-emerald-700">Approval</TableHead>
                        <TableHead className="text-emerald-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {accounts.map((account, index) => (
                          <motion.tr
                            key={account.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: { delay: index * 0.05 },
                            }}
                            exit={{ opacity: 0, y: -10 }}
                            whileHover={{
                              backgroundColor: "rgba(167, 243, 208, 0.1)",
                              transition: { duration: 0.2 },
                            }}
                            className="group"
                          >
                            <TableCell className="font-medium">{account.accountNumber}</TableCell>
                            <TableCell>{account.accountType}</TableCell>
                            <TableCell>{account.branchName}</TableCell>
                            <TableCell className="font-semibold">
                              <motion.span
                                initial={false}
                                animate={{ scale: refreshing ? [1, 1.1, 1] : 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                ${Number.parseFloat(account.balance).toFixed(2)}
                              </motion.span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  account.status === "ACTIVE"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : account.status === "INACTIVE"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {account.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  account.approvalStatus === "APPROVED"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : account.approvalStatus === "PENDING"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {account.approvalStatus}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2 opacity-80 group-hover:opacity-100">
                                {account.approvalStatus === "APPROVED" && !account.pin && (
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setupPin(account.id)}
                                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                                    >
                                      Set PIN
                                    </Button>
                                  </motion.div>
                                )}
                                
                                {(account.approvalStatus === "APPROVED" && account.pin) && (
                                  <>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
                                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                      >
                                        View
                                      </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          router.push(`/dashboard/transactions/create?accountId=${account.id}`)
                                        }
                                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                      >
                                        Transaction
                                      </Button>
                                    </motion.div>
                                  </>
                                )}
                                
                                {account.approvalStatus === "PENDING" && (
                                  <span className="text-sm text-amber-600 italic">Awaiting approval</span>
                                )}
                                
                                {account.approvalStatus === "REJECTED" && (
                                  <span className="text-sm text-red-600 italic">Application rejected</span>
                                )}
                              </div>
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
      
      {/* Pending accounts section */}
      {accounts.some(account => account.approvalStatus === "PENDING") && (
        <motion.div 
          className="mt-8" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white">
              <CardTitle className="flex items-center">
                <RefreshCw className="mr-2 h-5 w-5" />
                Pending Account Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">
                Your account request is being reviewed by our team. This process typically takes 1-2 business days.
                You will receive a notification once your account is approved.
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-amber-700">
                  <span className="font-medium">Note:</span> You will need to set up a PIN once your account is approved.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={fetchAccounts}
                    variant="outline"
                    className="flex items-center gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Check Status
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Rejected accounts section */}
      {accounts.some(account => account.approvalStatus === "REJECTED") && (
        <motion.div 
          className="mt-8" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Rejected Account Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">
                One or more of your account requests have been rejected. This could be due to incomplete information
                or verification issues. Please contact customer support for more details.
              </p>
              <div className="flex justify-end">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => router.push("/dashboard/support")}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                  >
                    Contact Support
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}