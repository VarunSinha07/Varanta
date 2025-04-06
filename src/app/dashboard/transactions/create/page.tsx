"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowDownToLine, ArrowUpFromLine, CreditCard, FileText, Wallet } from "lucide-react"

const transactionFormSchema = z.object({
  accountId: z.string({
    required_error: "Please select an account",
  }),
  amount: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val)
      return !isNaN(num) && num > 0
    },
    { message: "Amount must be greater than 0" },
  ),
  transactionType: z.enum(["DEPOSIT", "WITHDRAWAL"], {
    required_error: "Please select a transaction type",
  }),
  description: z.string().optional(),
})

type TransactionFormValues = z.infer<typeof transactionFormSchema>

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

export default function CreateTransaction() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accounts, setAccounts] = useState<
    {
      id: number
      accountType: string
      accountNumber: string
      balance: string
    }[]
  >([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const accountIdParam = searchParams.get("accountId")

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      accountId: accountIdParam || "",
      amount: "",
      transactionType: "DEPOSIT",
      description: "",
    },
  })

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch("/api/accounts")
        if (response.ok) {
          const data = await response.json()
          setAccounts(data)
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
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [toast])

  async function onSubmit(data: TransactionFormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          accountId: Number.parseInt(data.accountId),
        }),
      })

      if (response.ok) {
        toast({
          title: "Transaction completed",
          description: "Your transaction has been processed successfully",
        })
        router.push("/dashboard/transactions")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to process transaction")
      }
    } catch (error: Error | unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process transaction",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

  if (accounts.length === 0) {
    return (
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md mx-auto overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              No Accounts Available
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <p className="mb-6 text-center text-gray-700">
                You need to create a bank account before making transactions.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/dashboard/accounts/create")}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  Create Account
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div className="container mx-auto px-4 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Card className="max-w-md mx-auto overflow-hidden border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              New Transaction
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-blue-700">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Select Account
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                              <SelectValue placeholder="Select an account" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id.toString()}>
                                {account.accountType} - {account.accountNumber} ($
                                {Number.parseFloat(account.balance).toFixed(2)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="transactionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-blue-700">
                          {field.value === "DEPOSIT" ? (
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                          ) : (
                            <ArrowUpFromLine className="mr-2 h-4 w-4" />
                          )}
                          Transaction Type
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                              <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DEPOSIT">Deposit</SelectItem>
                            <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-blue-700">
                          <Wallet className="mr-2 h-4 w-4" />
                          Amount
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="100.00"
                            {...field}
                            className="border-blue-200 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-blue-700">
                          <FileText className="mr-2 h-4 w-4" />
                          Description (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Transaction description"
                            {...field}
                            className="border-blue-200 focus:ring-blue-500 min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </div>
                    ) : (
                      "Complete Transaction"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

