"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Account {
  id: number
  accountNumber: string
  accountType: string
  balance: number
}

interface TransactionFormProps {
  accounts: Account[]
  onSuccess: () => void
}

export function TransactionForm({ accounts, onSuccess }: TransactionFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    accountId: "",
    amount: "",
    transactionType: "",
    reason: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.accountId) {
      toast({
        title: "Error",
        description: "Please select an account",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.transactionType) {
      toast({
        title: "Error",
        description: "Please select a transaction type",
        variant: "destructive",
      })
      return
    }
    
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }
    
    // Check if withdrawal and sufficient balance
    if (formData.transactionType === "WITHDRAWAL") {
      const account = accounts.find(a => a.id.toString() === formData.accountId)
      if (account && account.balance < amount) {
        toast({
          title: "Error",
          description: "Insufficient balance for this withdrawal",
          variant: "destructive",
        })
        return
      }
    }
    
    setLoading(true)
    
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: parseInt(formData.accountId),
          amount,
          transactionType: formData.transactionType,
          reason: formData.reason || undefined,
        }),
      })
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `${formData.transactionType.charAt(0) + formData.transactionType.slice(1).toLowerCase()} completed successfully`,
        })
        // Reset form
        setFormData({
          accountId: "",
          amount: "",
          transactionType: "",
          reason: "",
        })
        // Call success callback
        onSuccess()
      } else {
        const error = await response.json()
        throw new Error(error.error || `Failed to process ${formData.transactionType.toLowerCase()}`)
      }
    } catch (error) {
      console.error("Error processing transaction:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process transaction",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
        <CardDescription>
          Make a deposit or withdrawal from your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountId">Select Account</Label>
            <Select 
              value={formData.accountId} 
              onValueChange={(value) => handleChange("accountId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.accountNumber} - {formatCurrency(account.balance)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transactionType">Transaction Type</Label>
            <Select 
              value={formData.transactionType} 
              onValueChange={(value) => handleChange("transactionType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEPOSIT">Deposit</SelectItem>
                <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              placeholder="Enter reason for transaction"
              rows={2}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Processing..." : "Submit Transaction"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}