"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Download } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

interface Account {
  id: number
  accountNumber: string
  accountType: string
  status: string
}

interface StatementRequest {
  id: number
  startDate: string
  endDate: string
  format: string
  status: string
  createdAt: string
  account: {
    accountNumber: string
  }
}

export default function StatementsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [accounts, setAccounts] = useState<Account[]>([])
    const [statements, setStatements] = useState<StatementRequest[]>([])
    const [loadingAccounts, setLoadingAccounts] = useState(true)
    const [loadingStatements, setLoadingStatements] = useState(true)
    
    const [formData, setFormData] = useState({
      accountId: "",
      startDate: "",
      endDate: "",
      format: "PDF",
    })
  
    const fetchAccounts = useCallback(async () => {
      try {
        const response = await fetch("/api/accounts")
        if (response.ok) {
          const data = await response.json()
          // Filter only active accounts
          const activeAccounts = data.filter(
            (account: Account) => account.status === "ACTIVE"
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
    }, [toast])
  
    const fetchStatements = useCallback(async () => {
      try {
        const response = await fetch("/api/statements")
        if (response.ok) {
          const data = await response.json()
          setStatements(data)
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch statements")
        }
      } catch (error) {
        console.error("Error fetching statements:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load statements",
          variant: "destructive",
        })
      }
    }, [toast])
  
    useEffect(() => {
      Promise.all([
        fetchAccounts(),
        fetchStatements()
      ]).finally(() => {
        setLoadingAccounts(false)
        setLoadingStatements(false)
      })
    }, [fetchAccounts, fetchStatements])

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
    
    if (!formData.startDate) {
      toast({
        title: "Error",
        description: "Please select a start date",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.endDate) {
      toast({
        title: "Error",
        description: "Please select an end date",
        variant: "destructive",
      })
      return
    }
    
    // Validate date range
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    
    if (startDate > endDate) {
      toast({
        title: "Error",
        description: "Start date must be before end date",
        variant: "destructive",
      })
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch("/api/account-operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operationType: "STATEMENT_REQUEST",
          accountId: parseInt(formData.accountId),
          startDate: formData.startDate,
          endDate: formData.endDate,
          format: formData.format,
        }),
      })
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Statement generated successfully",
        })
        // Refresh statements list
        fetchStatements()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate statement")
      }
    } catch (error) {
      console.error("Error generating statement:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate statement",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadStatement = (statementId: number) => {
    // In a real application, this would trigger a download
    // For now, just show a toast notification
    toast({
      title: "Download Started",
      description: `Your statement #${statementId} is being downloaded`,
    })
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Request Statement</CardTitle>
              <CardDescription>
                Generate account statements for a specific period
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountId">Select Account</Label>
                  {loadingAccounts ? (
                    <p className="text-sm text-muted-foreground">Loading accounts...</p>
                  ) : accounts.length === 0 ? (
                    <p className="text-sm text-red-500">
                      You need an active account to request statements.
                    </p>
                  ) : (
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
                            {account.accountNumber} ({account.accountType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select 
                    value={formData.format} 
                    onValueChange={(value) => handleChange("format", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={loading || loadingAccounts || accounts.length === 0} 
                  className="w-full"
                >
                  {loading ? "Generating..." : "Generate Statement"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Statement History</CardTitle>
              <CardDescription>
                Your previously requested statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStatements ? (
                <p className="text-center py-4">Loading statements...</p>
              ) : statements.length === 0 ? (
                <p className="text-center py-4">No statements found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Requested</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statements.map((statement) => (
                      <TableRow key={statement.id}>
                        <TableCell>{formatDate(statement.createdAt)}</TableCell>
                        <TableCell>{statement.account.accountNumber}</TableCell>
                        <TableCell>
                          {formatDate(statement.startDate)} - {formatDate(statement.endDate)}
                        </TableCell>
                        <TableCell>{statement.format}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => downloadStatement(statement.id)}
                          >
                            <Download className="h-4 w-4 mr-1" /> Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}