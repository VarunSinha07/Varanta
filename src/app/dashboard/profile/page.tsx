"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerProfile {
  id: number;
  name: string;
  dob: string;
  phone: string;
  address: string;
  panNumber: string | null;
  aadharNumber: string | null;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/customers");
        
        if (response.status === 404) {
          // No profile exists, redirect to create profile
          router.push("/dashboard/profile/create");
          return;
        }
        
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>You don&apos;t have a profile yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/profile/create")}>
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </div>
            <div>
              {getStatusBadge(profile.approvalStatus)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.approvalStatus === "PENDING" && (
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
              <p className="text-yellow-800">
                Your profile is currently being verified by VarDaanGrow. You&apos;ll be able to create accounts once your profile is approved.
              </p>
            </div>
          )}
          
          {profile.approvalStatus === "REJECTED" && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
              <p className="text-red-800">
                Your profile verification was rejected. Please contact customer support for more information.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="text-lg font-medium">{profile.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-lg font-medium">{profile.user?.email || "Not available"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
              <p className="text-lg font-medium">{formatDate(profile.dob)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              <p className="text-lg font-medium">{profile.phone}</p>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="text-lg font-medium">{profile.address}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">PAN Number</h3>
              <p className="text-lg font-medium">{profile.panNumber || "Not provided"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Aadhar Number</h3>
              <p className="text-lg font-medium">{profile.aadharNumber ? `XXXX-XXXX-${profile.aadharNumber.slice(-4)}` : "Not provided"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Profile Created</h3>
              <p className="text-lg font-medium">{formatDate(profile.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}