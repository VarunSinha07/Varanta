"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, CreditCard } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Loan {
  id: number
  loanNumber: string
  amount: number
  interestRate: number
  duration: number
  purpose: string
  status: string
  createdAt: string
}


export default function LoansPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loans, setLoans] = useState<Loan[]>([])
    const [loading, setLoading] = useState(true)
  
    const fetchLoans = useCallback(async () => {
      try {
        const response = await fetch("/api/loans")
        if (response.ok) {
          const data = await response.json()
          setLoans(data)
        } else {
          throw new Error("Failed to fetch loans")
        }
      } catch (error) {
        console.error("Error fetching loans:", error)
        toast({
          title: "Error",
          description: "Failed to load loans",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }, [toast])
  
    useEffect(() => {
      fetchLoans()
    }, [fetchLoans])

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
        <h1 className="text-3xl font-bold">Your Loans</h1>
        <Link href="/dashboard/loans/apply">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Apply for Loan
          </Button>
        </Link>
      </div>

      {loans.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Loans Found</CardTitle>
            <CardDescription>
              You don&apos;t have any loans yet. Apply for a loan to get started.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/loans/apply">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Apply for Loan
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <Card key={loan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Loan #{loan.loanNumber}
                </CardTitle>
                <CardDescription>
                  {loan.purpose.length > 30 ? loan.purpose.substring(0, 30) + "..." : loan.purpose}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(loan.amount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {loan.duration} months at {loan.interestRate}% interest
                  </div>
                  <div>
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
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/dashboard/loans/${loan.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}