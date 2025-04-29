"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ProfileCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip check if already on profile creation page
    if (pathname === '/dashboard/profile/create') {
      setLoading(false);
      return;
    }

    const checkProfile = async () => {
      try {
        const res = await fetch('/api/customers');
        
        // If we get a 404, it means the profile doesn't exist - redirect to create
        if (res.status === 404) {
          toast({
            title: 'Profile Required',
            description: 'Please create your profile to continue',
          });
          router.push('/dashboard/profile/create');
          setLoading(false);
          return;
        }
        
        // For other error statuses, throw an error
        if (!res.ok) {
          throw new Error('Failed to check profile');
        }
        
        // If we get here, the profile exists
await res.json(); // Parse response but ignore data since it's not needed
        setLoading(false);
      } catch (error) {
        console.error('Error checking profile:', error);
        setLoading(false);
      }
    };

    checkProfile();
  }, [pathname, router, toast]);

  if (loading && pathname !== '/dashboard/profile/create') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
}