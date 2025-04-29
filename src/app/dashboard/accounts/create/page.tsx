"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export default function CreateAccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountType: "",
    initialDeposit: "",
    branchName: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.accountType) {
      toast({
        title: "Error",
        description: "Please select an account type",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.branchName) {
      toast({
        title: "Error",
        description: "Please enter a branch name",
        variant: "destructive",
      });
      return;
    }
    
    const initialDeposit = parseFloat(formData.initialDeposit);
    if (isNaN(initialDeposit) || initialDeposit < 500) {
      toast({
        title: "Error",
        description: "Initial deposit must be at least ₹500",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // First check if the user has an approved profile
      const profileCheck = await fetch("/api/customers");
      
      if (profileCheck.status === 404) {
        toast({
          title: "Profile Required",
          description: "Please create your profile before opening an account",
          variant: "destructive",
        });
        router.push("/dashboard/profile/create");
        setLoading(false);
        return;
      }
      
      if (!profileCheck.ok) {
        throw new Error("Failed to verify customer profile");
      }
      
      // Check if profile is approved
      const profileData = await profileCheck.json();
      if (profileData.approvalStatus !== "APPROVED") {
        toast({
          title: "Profile Not Approved",
          description: "Your profile needs to be approved before you can open an account",
          variant: "destructive",
        });
        router.push("/dashboard/profile");
        setLoading(false);
        return;
      }
      
      // Now create the account
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountType: formData.accountType,
          initialDeposit: formData.initialDeposit,
          branchName: formData.branchName,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create account");
      }
      
      toast({
        title: "Account Created",
        description: "Your account request has been submitted for approval",
      });
      
      router.push("/dashboard/accounts");
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Open a New Account</CardTitle>
          <CardDescription>
            Fill in the details to open a new bank account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup
                value={formData.accountType}
                onValueChange={(value) => handleChange("accountType", value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SAVINGS" id="savings" />
                  <Label htmlFor="savings" className="cursor-pointer">Savings Account</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CHECKING" id="checking" />
                  <Label htmlFor="checking" className="cursor-pointer">Checking Account</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FIXED_DEPOSIT" id="fd" />
                  <Label htmlFor="fd" className="cursor-pointer">Fixed Deposit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="RECURRING_DEPOSIT" id="rd" />
                  <Label htmlFor="rd" className="cursor-pointer">Recurring Deposit</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="initialDeposit">Initial Deposit (₹)</Label>
              <Input
                id="initialDeposit"
                type="number"
                min="500"
                step="100"
                value={formData.initialDeposit}
                onChange={(e) => handleChange("initialDeposit", e.target.value)}
                placeholder="Minimum ₹500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                value={formData.branchName}
                onChange={(e) => handleChange("branchName", e.target.value)}
                placeholder="Enter branch name"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Open Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}