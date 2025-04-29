"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft, CreditCard, Wallet } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  branchName: string;
  status: string;
  approvalStatus: string;
  interestRate: number | null;
  pin: boolean | null;
  createdAt: string;
}

interface Transaction {
  id: number;
  transactionId: string;
  amount: number;
  transactionType: string;
  date: string;
  description: string | null;
  status: string;
}

export default function AccountDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [settingPin, setSettingPin] = useState(false);

  useEffect(() => {
    async function fetchAccountDetails() {
      try {
        // Fetch account details
        const accountResponse = await fetch(`/api/account-operations/${params.id}`);
        if (!accountResponse.ok) {
          throw new Error("Failed to fetch account details");
        }
        const accountData = await accountResponse.json();
        setAccount(accountData);

        // Fetch transactions for this account
        const transactionsResponse = await fetch(`/api/transactions?accountId=${params.id}`);
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setTransactions(transactionsData);
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
        toast({
          title: "Error",
          description: "Failed to load account details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAccountDetails();
  }, [params.id, toast]);

  const handleSetPin = async () => {
    if (!/^\d{4}$/.test(pin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits",
        variant: "destructive",
      });
      return;
    }

    setSettingPin(true);
    try {
      const response = await fetch(`/api/account-pin/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to set PIN");
      }

      toast({
        title: "Success",
        description: "PIN set successfully",
      });
      
      // Refresh account data
      const accountResponse = await fetch(`/api/account-operations/${params.id}`);
      if (accountResponse.ok) {
        const accountData = await accountResponse.json();
        setAccount(accountData);
      }
      
      setPinModalOpen(false);
    } catch (error) {
      console.error("Error setting PIN:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set PIN",
        variant: "destructive",
      });
    } finally {
      setSettingPin(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getAccountTypeName = (type: string) => {
    return type.replace(/_/g, " ");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Account Details</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Account not found or you don&apos;t have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Account Details</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{getAccountTypeName(account.accountType)} Account</CardTitle>
              <CardDescription>Account Number: {account.accountNumber}</CardDescription>
            </div>
            <div className="flex space-x-2">
              {getStatusBadge(account.approvalStatus)}
              <Badge className={account.status === "ACTIVE" ? "bg-green-500" : "bg-gray-500"}>
                {account.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(account.balance)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Branch</p>
              <p className="text-xl">{account.branchName}</p>
              {account.interestRate && (
                <p className="text-sm text-gray-500 mt-2">
                  Interest Rate: {account.interestRate}%
                </p>
              )}
            </div>
          </div>

          {account.approvalStatus === "PENDING" && (
            <Alert className="mt-4 border-yellow-500 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-800">
                This account is being verified by VarDaanGrow. You&apos;ll be able to use it once approved.
              </AlertDescription>
            </Alert>
          )}
          
          {account.approvalStatus === "REJECTED" && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This account request was rejected. Please contact customer support for more information.
              </AlertDescription>
            </Alert>
          )}

          {account.approvalStatus === "APPROVED" && !account.pin && (
            <Alert className="mt-4 border-blue-500 bg-blue-50">
              <CreditCard className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-800">
                Please set a 4-digit PIN to enable transactions for this account.
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-4 bg-blue-100"
                  onClick={() => setPinModalOpen(true)}
                >
                  Set PIN
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {account.approvalStatus === "APPROVED" && account.status === "ACTIVE" && account.pin && (
              <Button 
                onClick={() => router.push(`/dashboard/transactions/create?accountId=${account.id}`)}
                className="flex items-center"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Make Transaction
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={() => router.push(`/dashboard/accounts/statements?accountId=${account.id}`)}
            >
              Request Statement
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Recent transactions for this account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No transactions found for this account.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>{transaction.transactionType}</TableCell>
                        <TableCell>{transaction.description || "-"}</TableCell>
                        <TableCell className="text-right">
                          <span className={transaction.transactionType === "DEPOSIT" ? "text-green-600" : "text-red-600"}>
                            {transaction.transactionType === "DEPOSIT" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            transaction.status === "COMPLETED" 
                              ? "bg-green-500" 
                              : transaction.status === "FAILED" 
                                ? "bg-red-500" 
                                : "bg-yellow-500"
                          }>
                            {transaction.status}
                          </Badge>
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

      {pinModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Set Account PIN</CardTitle>
              <CardDescription>
                Create a 4-digit PIN to secure your transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="pin" className="text-sm font-medium">
                    Enter 4-digit PIN
                  </label>
                  <input
                    id="pin"
                    type="password"
                    maxLength={4}
                    className="w-full p-2 border rounded-md"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="Enter 4 digits"
                  />
                  <p className="text-xs text-gray-500">
                    This PIN will be required for all transactions from this account.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setPinModalOpen(false)}
                    disabled={settingPin}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSetPin}
                    disabled={pin.length !== 4 || settingPin}
                  >
                    {settingPin ? "Setting PIN..." : "Set PIN"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}