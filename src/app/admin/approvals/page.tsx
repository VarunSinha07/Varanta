"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, User, CreditCard, FileText } from "lucide-react"

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

type Profile = {
    id: string;
    name: string;
    dob: string;
    phone: string;
    panNumber: string;
    aadharNumber: string;
  }
  
  type Account = {
    id: string;
    customer: {
      name: string;
    };
    accountType: string;
    branchName: string;
    createdAt: string;
  }
  
  type Loan = {
    id: string;
    customer: {
      name: string;
    };
    amount: string;
    interestRate: string;
    duration: number;
    purpose: string;
  }



export default function ApprovalsPage() {
    const [activeTab, setActiveTab] = useState("profiles")
    const [profileRequests, setProfileRequests] = useState<Profile[]>([])
    const [accountRequests, setAccountRequests] = useState<Account[]>([])
    const [loanRequests, setLoanRequests] = useState<Loan[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

  useEffect(() => {
    async function fetchApprovalRequests() {
      try {
        const response = await fetch(`/api/admin/approvals?type=${activeTab}`)
        if (response.ok) {
          const data = await response.json()
          
          if (activeTab === "profiles") {
            setProfileRequests(data)
          } else if (activeTab === "accounts") {
            setAccountRequests(data)
          } else if (activeTab === "loans") {
            setLoanRequests(data)
          }
        } else {
          throw new Error(`Failed to fetch ${activeTab} approval requests`)
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} approval requests:`, error)
        toast({
          title: "Error",
          description: `Failed to load ${activeTab} approval requests`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchApprovalRequests()
  }, [activeTab, toast])

  const handleApproval = async (id: string, type: 'profiles' | 'accounts' | 'loans', action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/approvals/${type}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Request ${action === "approve" ? "approved" : "rejected"} successfully`,
        })
        
        // Refresh the current tab data
        if (type === "profiles") {
          setProfileRequests(profileRequests.filter(item => item.id !== id))
        } else if (type === "accounts") {
          setAccountRequests(accountRequests.filter(item => item.id !== id))
        } else if (type === "loans") {
          setLoanRequests(loanRequests.filter(item => item.id !== id))
        }
      } else {
        throw new Error(`Failed to ${action} ${type} request`)
      }
    } catch (error) {
      console.error(`Error ${action}ing ${type} request:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} request`,
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Approval Requests</h1>
        <p className="text-gray-600">Manage customer profile, account, and loan approval requests.</p>
      </div>

      <Tabs defaultValue="profiles" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-white">
          <TabsTrigger value="profiles" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile Requests
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Account Requests
          </TabsTrigger>
          <TabsTrigger value="loans" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Loan Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Customer Profile Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : profileRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pending profile requests</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>PAN Number</TableHead>
                      <TableHead>Aadhar Number</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profileRequests.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.name}</TableCell>
                        <TableCell>{new Date(profile.dob).toLocaleDateString()}</TableCell>
                        <TableCell>{profile.phone}</TableCell>
                        <TableCell>{profile.panNumber}</TableCell>
                        <TableCell>{profile.aadharNumber}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-200 text-green-700 hover:bg-green-50"
                              onClick={() => handleApproval(profile.id, "profiles", "approve")}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => handleApproval(profile.id, "profiles", "reject")}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Account Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : accountRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pending account requests</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Account Type</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Date Requested</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountRequests.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.customer.name}</TableCell>
                        <TableCell>{account.accountType}</TableCell>
                        <TableCell>{account.branchName}</TableCell>
                        <TableCell>{new Date(account.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-200 text-green-700 hover:bg-green-50"
                              onClick={() => handleApproval(account.id, "accounts", "approve")}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => handleApproval(account.id, "accounts", "reject")}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Loan Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : loanRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pending loan requests</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Duration (months)</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanRequests.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.customer.name}</TableCell>
                        <TableCell>${parseFloat(loan.amount).toFixed(2)}</TableCell>
                        <TableCell>{parseFloat(loan.interestRate).toFixed(2)}%</TableCell>
                        <TableCell>{loan.duration}</TableCell>
                        <TableCell>{loan.purpose}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-200 text-green-700 hover:bg-green-50"
                              onClick={() => handleApproval(loan.id, "loans", "approve")}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => handleApproval(loan.id, "loans", "reject")}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}