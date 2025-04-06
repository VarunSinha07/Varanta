"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Landmark, Percent } from "lucide-react"

const accountFormSchema = z.object({
  accountType: z.enum(["SAVINGS", "CHECKING", "FIXED_DEPOSIT", "RECURRING_DEPOSIT"], {
    required_error: "Please select an account type",
  }),
  branchName: z.string().min(2, { message: "Branch name is required" }),
  interestRate: z.string().optional(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

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

export default function CreateAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      accountType: "SAVINGS",
      branchName: "",
      interestRate: "",
    },
  })

  async function onSubmit(data: AccountFormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Account created",
          description: "Your bank account has been created successfully",
        })
        router.push("/dashboard/accounts")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to create account")
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
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
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Open New Bank Account
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-emerald-700">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Account Type
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SAVINGS">Savings</SelectItem>
                            <SelectItem value="CHECKING">Checking</SelectItem>
                            <SelectItem value="FIXED_DEPOSIT">Fixed Deposit</SelectItem>
                            <SelectItem value="RECURRING_DEPOSIT">Recurring Deposit</SelectItem>
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
                    name="branchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-emerald-700">
                          <Landmark className="mr-2 h-4 w-4" />
                          Branch Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Main Branch"
                            {...field}
                            className="border-emerald-200 focus:ring-emerald-500"
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
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-emerald-700">
                          <Percent className="mr-2 h-4 w-4" />
                          Interest Rate (%)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="3.5"
                            {...field}
                            className="border-emerald-200 focus:ring-emerald-500"
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
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Creating...
                      </div>
                    ) : (
                      "Create Account"
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

