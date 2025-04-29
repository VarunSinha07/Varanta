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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, CreditCard, MessageSquare, Send } from "lucide-react"

const transactionFormSchema = z.object({
  accountId: z.string({
    required_error: "Please select your account",
  }),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  recipientAccountNumber: z.string().min(8, "Account number must be at least 8 digits"),
  recipientAccountType: z.enum(["SAVINGS", "CHECKING", "CURRENT"], {
    required_error: "Please select recipient account type",
  }),
  pin: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
  reason: z.string().optional(),
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
      id: string
      accountNumber: string
      accountType: string
      balance: string
      status: string
    }[]
  >([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      accountId: searchParams.get("accountId") || "",
      amount: "",
      recipientAccountNumber: "",
      recipientAccountType: "SAVINGS",
      pin: "",
      reason: "",
    },
  })

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch("/api/accounts")
        if (response.ok) {
          const data = await response.json()
          
          // Filter for active and approved accounts
          const activeAccounts = data.filter(
            (account: { status: string; approvalStatus: string }) => 
              account.status === "ACTIVE" && account.approvalStatus === "APPROVED"
          )
          setAccounts(activeAccounts)
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
    }

    fetchAccounts()
  }, [toast])

  async function onSubmit(data: TransactionFormValues) {
    setIsSubmitting(true)
    try {
      // Prepare the data for the API
      const transactionData = {
        accountId: data.accountId,
        amount: data.amount,
        recipientAccountNumber: data.recipientAccountNumber,
        recipientAccountType: data.recipientAccountType,
        pin: data.pin,
        reason: data.reason || "",
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      })

      if (response.ok) {
        toast({
          title: "Transfer successful",
          description: "Your funds have been transferred successfully",
        })
        router.push("/dashboard/transactions")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process transfer")
      }
    } catch (error: unknown) {
      toast({
        title: "Transfer failed",
        description: error instanceof Error ? error.message : "Failed to process transfer",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div className="container mx-auto px-4 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Card className="max-w-md mx-auto overflow-hidden border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="flex items-center">
              <Send className="mr-2 h-5 w-5" />
              Transfer Funds
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
                          Your Account
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your account" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accounts && accounts.length > 0 ? (
                              accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id.toString()}>
                                  {account.accountNumber} ({account.accountType}) - ₹{parseFloat(account.balance).toFixed(2)}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-accounts" disabled>
                                No eligible accounts found
                              </SelectItem>
                            )}
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
                    name="recipientAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-blue-700">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Recipient Account Number
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter recipient's account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="recipientAccountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-blue-700">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Recipient Account Type
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select recipient account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SAVINGS">Savings</SelectItem>
                            <SelectItem value="CHECKING">Checking</SelectItem>
                            <SelectItem value="CURRENT">Current</SelectItem>
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
                          <DollarSign className="mr-2 h-4 w-4" />
                          Amount (₹)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-blue-700">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Reason (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter reason for transfer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-blue-700">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Account PIN
                        </FormLabel>
                        <FormControl>
                          <Input type="password" maxLength={4} placeholder="Enter 4-digit PIN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="pt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Transfer Funds"}
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