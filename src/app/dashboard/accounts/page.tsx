"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  branchName: string;
  status: string;
  approvalStatus: string;
}

export default function AccountsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileApproved, setProfileApproved] = useState(true);

  const fetchAccounts = useCallback(async () => {
    try {
      // First check if profile is approved
      const profileResponse = await fetch("/api/customers");
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfileApproved(profileData.approvalStatus === "APPROVED");
      }

      const response = await fetch("/api/accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      } else {
        throw new Error("Failed to fetch accounts");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast({
        title: "Error",
        description: "Failed to load accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatAccountType = (type: string) => {
    return type.replace(/_/g, " ");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Accounts</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="mb-4">
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/4 mb-4" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Accounts</h1>
        <Button 
          onClick={() => router.push("/dashboard/accounts/create")}
          disabled={!profileApproved}
        >
          <Plus className="mr-2 h-4 w-4" />
          Open New Account
        </Button>
      </div>

      {!profileApproved && (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-800">
            Your profile is pending approval. You&apos;ll be able to open new accounts once your profile is approved by VarDaanGrow.
          </AlertDescription>
        </Alert>
      )}

      {accounts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Accounts Found</CardTitle>
            <CardDescription>You don&apos;t have any bank accounts yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push("/dashboard/accounts/create")}
              disabled={!profileApproved}
            >
              <Plus className="mr-2 h-4 w-4" />
              Open Your First Account
            </Button>
            {!profileApproved && (
              <p className="text-sm text-muted-foreground mt-2">
                Your profile needs to be approved before you can open an account.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => (
            <Card 
              key={account.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{formatAccountType(account.accountType)} Account</CardTitle>
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
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p>{account.branchName}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/accounts/${account.id}`);
                    }}
                  >
                    View Details
                  </Button>
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
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This account request was rejected. Please contact customer support for more information.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full flex space-x-2">
                  {account.approvalStatus === "APPROVED" && (
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/transactions/create?accountId=${account.id}`);
                      }}
                      disabled={account.status !== "ACTIVE"}
                    >
                      Make Transaction
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}