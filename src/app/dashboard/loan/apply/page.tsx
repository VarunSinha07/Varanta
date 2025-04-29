"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Account {
  id: number
  accountNumber: string
  accountType: string
  balance: number
  status: string
  approvalStatus: string
}

export default function ApplyLoanPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  
  const [formData, setFormData] = useState({
    amount: "",
    duration: "",
    purpose: "",
    accountId: "",
  })

  const fetchAccounts = useCallback(async () => {
    try {
      // First check if the user has a profile
      const profileCheck = await fetch("/api/customers")
      
      if (profileCheck.status === 404) {
        toast({
          title: "Profile Required",
          description: "Please create your profile before applying for a loan",
          variant: "destructive",
        })
        router.push("/dashboard/profile/create")
        return
      }
      
      if (!profileCheck.ok) {
        throw new Error("Failed to verify customer profile")
      }
      
      const response = await fetch("/api/accounts")
      if (response.ok) {
        const data = await response.json()
        // Filter only active and approved accounts
        const eligibleAccounts = data.filter(
          (account: Account) => account.status === "ACTIVE"
        )
        setAccounts(eligibleAccounts)
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
      setLoadingAccounts(false)
    }
  }, [toast, router])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

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
    
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount < 1000) {
      toast({
        title: "Error",
        description: "Loan amount must be at least ₹1,000",
        variant: "destructive",
      })
      return
    }
    
    const duration = parseInt(formData.duration)
    if (isNaN(duration) || duration < 1 || duration > 60) {
      toast({
        title: "Error",
        description: "Loan duration must be between 1 and 60 months",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.purpose.trim()) {
      toast({
        title: "Error",
        description: "Please enter a purpose for the loan",
        variant: "destructive",
      })
      return
    }
    
    setLoading(true)
    
    try {
      // Check profile again before submitting
      const profileCheck = await fetch("/api/customers")
      
      if (profileCheck.status === 404) {
        toast({
          title: "Profile Required",
          description: "Please create your profile before applying for a loan",
          variant: "destructive",
        })
        router.push("/dashboard/profile/create")
        setLoading(false)
        return
      }
      
      // Calculate interest rate based on amount and duration
      const interestRate = calculateInterestRate(amount, duration)
      
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: formData.accountId,
          amount,
          duration,
          purpose: formData.purpose,
          interestRate,
        }),
      })
      
      if (response.ok) {
        await response.json()
        toast({
          title: "Success",
          description: "Loan application submitted successfully! It will be reviewed by our team.",
        })
        router.push("/dashboard/loan")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit loan application")
      }
    } catch (error) {
      console.error("Error applying for loan:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit loan application",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Simple interest rate calculation based on amount and duration
  const calculateInterestRate = (amount: number, duration: number) => {
    // Base rate
    let rate = 10.5
    
    // Adjust based on amount
    if (amount > 500000) rate -= 0.5
    if (amount > 1000000) rate -= 0.5
    
    // Adjust based on duration
    if (duration > 24) rate += 0.5
    if (duration > 36) rate += 0.5
    
    return rate
  }

  if (loadingAccounts) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" onClick={() => router.push("/dashboard/loan")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Loans
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Apply for Loan</CardTitle>
          <CardDescription>
            Fill out the form below to apply for a new loan.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountId">Select Account</Label>
              {accounts.length > 0 ? (
                <Select 
                  value={formData.accountId} 
                  onValueChange={(value) => handleChange("accountId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.accountNumber} ({account.accountType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground">
                  You don&apos;t have any active accounts. Please open an account first.
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                min="1000"
                step="1000"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="Minimum ₹1,000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Loan Duration (months)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="60"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="1-60 months"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose">Loan Purpose</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleChange("purpose", e.target.value)}
                placeholder="Describe the purpose of this loan"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={loading || accounts.length === 0} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Apply for Loan"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}