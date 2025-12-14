"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    console.log('[HomePage] useEffect - loading:', loading, 'user:', user, 'hasRedirected:', hasRedirected.current);
    // Only redirect once
    if (!loading && !hasRedirected.current) {
      hasRedirected.current = true;
      if (user) {
        console.log('[HomePage] Redirecting to dashboard');
        router.replace("/dashboard");
      } else {
        console.log('[HomePage] Redirecting to login');
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  // Don't render anything while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Return null after redirect
  return null;
}
