"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, CreditCard, DollarSign } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"

interface Loan {
  id: number
  loanNumber: string
  amount: number
  interestRate: number
  duration: number
  startDate: string
  endDate: string
  purpose: string
  status: string
  customerId: number
  accountId: number
  createdAt: string
  updatedAt: string
  account?: {
    accountNumber: string
  }
}

export default function LoanDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loan, setLoan] = useState<Loan | null>(null)
  const [loading, setLoading] = useState(true)
  const [purpose, setPurpose] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const fetchLoanDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/loan-details/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setLoan(data)
        setPurpose(data.purpose || "")
      } else {
        throw new Error("Failed to fetch loan details")
      }
    } catch (error) {
      console.error("Error fetching loan details:", error)
      toast({
        title: "Error",
        description: "Failed to load loan details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [params.id, toast])

  useEffect(() => {
    fetchLoanDetails()
  }, [fetchLoanDetails])

  // Remove duplicate function declaration
  
  const handleUpdatePurpose = useCallback(async () => {
    if (!purpose.trim()) {
      toast({
        title: "Error",
        description: "Purpose cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/loan-details/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ purpose }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Loan purpose updated successfully",
        })
        setIsEditDialogOpen(false)
        fetchLoanDetails()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update loan purpose")
      }
    } catch (error) {
      console.error("Error updating loan purpose:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update loan purpose",
        variant: "destructive",
      })
    }
  }, [purpose, params.id, toast, fetchLoanDetails, setIsEditDialogOpen])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!loan) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Loan not found</h2>
        <Button onClick={() => router.push("/dashboard/loans")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Loans
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" onClick={() => router.push("/dashboard/loans")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Loans
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-6 w-6" />
            Loan Details
          </CardTitle>
          <CardDescription>
            Loan #{loan.loanNumber}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Loan Amount</Label>
              <div className="font-medium mt-1 text-xl flex items-center">
                <DollarSign className="h-5 w-5 mr-1 text-green-600" />
                {formatCurrency(loan.amount)}
              </div>
            </div>
            <div>
              <Label>Interest Rate</Label>
              <div className="font-medium mt-1">
                {loan.interestRate}%
              </div>
            </div>
            <div>
              <Label>Duration</Label>
              <div className="font-medium mt-1">
                {loan.duration} months
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <div className="font-medium mt-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  loan.status === "ACTIVE" ? "bg-green-100 text-green-800" : 
                  loan.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                  loan.status === "CLOSED" ? "bg-gray-100 text-gray-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {loan.status}
                </span>
              </div>
            </div>
            <div>
              <Label>Start Date</Label>
              <div className="font-medium mt-1">
                {loan.startDate ? new Date(loan.startDate).toLocaleDateString() : "Not started"}
              </div>
            </div>
            <div>
              <Label>End Date</Label>
              <div className="font-medium mt-1">
                {loan.endDate ? new Date(loan.endDate).toLocaleDateString() : "Not determined"}
              </div>
            </div>
            <div>
              <Label>Linked Account</Label>
              <div className="font-medium mt-1">
                {loan.account ? loan.account.accountNumber : "N/A"}
              </div>
            </div>
            <div>
              <Label>Created On</Label>
              <div className="font-medium mt-1">
                {new Date(loan.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="col-span-2">
              <Label>Purpose</Label>
              <div className="font-medium mt-1 p-3 bg-gray-50 rounded-md min-h-[60px]">
                {loan.purpose || "No purpose specified"}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={loan.status !== "PENDING"}>
                Edit Purpose
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Loan Purpose</DialogTitle>
                <DialogDescription>
                  You can only update the purpose while the loan is still pending approval.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Enter loan purpose"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdatePurpose}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}