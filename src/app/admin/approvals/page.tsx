"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Define types for our data
interface ProfileRequest {
  id: number;
  name: string;
  phone: string;
  address: string;
  panNumber: string;
  aadharNumber: string;
  user: {
    email: string;
  };
}

interface AccountRequest {
  id: number;
  accountType: string;
  accountNumber: string;
  branchName: string;
  interestRate?: number;
  customer: {
    name: string;
  };
}

interface LoanRequest {
  id: number;
  amount: number;
  purpose: string;
  duration: number;
  interestRate: number;
  customer: {
    name: string;
  };
}

type ApprovalAction = 'approve' | 'reject';

export default function AdminApprovalsPage() {
  const [activeTab, setActiveTab] = useState<'profiles' | 'accounts' | 'loans'>('profiles');
  const [profileRequests, setProfileRequests] = useState<ProfileRequest[]>([]);
  const [accountRequests, setAccountRequests] = useState<AccountRequest[]>([]);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // Track which tabs have been loaded
  const loadedTabs = useRef<Set<string>>(new Set());
  const { toast } = useToast();

  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    // Set up cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Define fetchApprovalRequests with useCallback to avoid dependency issues
  const fetchApprovalRequests = useCallback(async () => {
    // Check if this tab has already been loaded
    if (loadedTabs.current.has(activeTab) || !isMounted.current) return;
    
    setLoading(true);
    try {
      console.log(`Fetching ${activeTab} approval requests`);
      const response = await fetch(`/api/admin-approvals?type=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        
        // Only update state if component is still mounted
        if (isMounted.current) {
          if (activeTab === "profiles") {
            setProfileRequests(data);
          } else if (activeTab === "accounts") {
            setAccountRequests(data);
          } else if (activeTab === "loans") {
            setLoanRequests(data);
          }
          
          // Mark this tab as loaded
          loadedTabs.current.add(activeTab);
        }
      } else {
        throw new Error(`Failed to fetch ${activeTab} approval requests`);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab} approval requests:`, error);
      if (isMounted.current) {
        toast({
          title: "Error",
          description: `Failed to load ${activeTab} approval requests`,
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [activeTab, toast]);

  // Fetch data when activeTab changes
  useEffect(() => {
    fetchApprovalRequests();
  }, [activeTab, fetchApprovalRequests]);

  const handleApproval = useCallback(async (
    id: number, 
    type: 'profiles' | 'accounts' | 'loans', 
    action: ApprovalAction
  ) => {
    // Prevent multiple approval actions at once
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      let endpoint = '';
      
      if (type === 'profiles') {
        endpoint = `/api/admin-profile-approval/${id}`;
      } else if (type === 'accounts') {
        endpoint = `/api/admin-account-approval/${id}`;
      } else if (type === 'loans') {
        endpoint = `/api/admin-loan-approval/${id}`;
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action.toLowerCase()} ${type}`);
      }
      
      if (isMounted.current) {
        toast({
          title: "Success",
          description: `${type.slice(0, -1)} ${action.toLowerCase()}ed successfully`,
        });
        
        // Remove the tab from loadedTabs to force a refresh
        loadedTabs.current.delete(activeTab);
        
        // Refresh the data after a short delay
        setTimeout(() => {
          if (isMounted.current) {
            fetchApprovalRequests();
          }
        }, 500);
      }
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing ${type}:`, error);
      if (isMounted.current) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : `Failed to ${action.toLowerCase()} ${type}`,
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
      }
    }
  }, [isProcessing, fetchApprovalRequests, toast, activeTab]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Approval Requests</h1>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'profiles' | 'accounts' | 'loans')}>
        <TabsList className="mb-6">
          <TabsTrigger value="profiles">Customer Profiles</TabsTrigger>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="loans">Loan Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profiles">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Profile Requests</h2>
            {loading ? (
              <p>Loading...</p>
            ) : profileRequests.length === 0 ? (
              <p>No pending profile approval requests</p>
            ) : (
              <div className="space-y-4">
                {profileRequests.map((profile) => (
                  <div key={profile.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-sm text-gray-500">Email: {profile.user.email}</p>
                        <p className="text-sm text-gray-500">Phone: {profile.phone}</p>
                        <p className="text-sm text-gray-500">Address: {profile.address}</p>
                        <p className="text-sm text-gray-500">PAN: {profile.panNumber}</p>
                        <p className="text-sm text-gray-500">Aadhar: {profile.aadharNumber}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="default" 
                          onClick={() => handleApproval(profile.id, 'profiles', 'approve')}
                          disabled={isProcessing}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleApproval(profile.id, 'profiles', 'reject')}
                          disabled={isProcessing}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="accounts">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Account Approval Requests</h2>
            {loading ? (
              <p>Loading...</p>
            ) : accountRequests.length === 0 ? (
              <p>No pending account approval requests</p>
            ) : (
              <div className="space-y-4">
                {accountRequests.map((account) => (
                  <div key={account.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{account.accountType} - {account.accountNumber}</p>
                        <p className="text-sm text-gray-500">Customer: {account.customer.name}</p>
                        <p className="text-sm text-gray-500">Branch: {account.branchName}</p>
                        {account.interestRate && (
                          <p className="text-sm text-gray-500">Interest Rate: {account.interestRate}%</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="default" 
                          onClick={() => handleApproval(account.id, 'accounts', 'approve')}
                          disabled={isProcessing}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleApproval(account.id, 'accounts', 'reject')}
                          disabled={isProcessing}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="loans">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Loan Approval Requests</h2>
            {loading ? (
              <p>Loading...</p>
            ) : loanRequests.length === 0 ? (
              <p>No pending loan approval requests</p>
            ) : (
              <div className="space-y-4">
                {loanRequests.map((loan) => (
                  <div key={loan.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">₹{loan.amount.toFixed(2)} - {loan.purpose}</p>
                        <p className="text-sm text-gray-500">Customer: {loan.customer.name}</p>
                        <p className="text-sm text-gray-500">Duration: {loan.duration} months</p>
                        <p className="text-sm text-gray-500">Interest Rate: {loan.interestRate}%</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="default" 
                          onClick={() => handleApproval(loan.id, 'loans', 'approve')}
                          disabled={isProcessing}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleApproval(loan.id, 'loans', 'reject')}
                          disabled={isProcessing}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}