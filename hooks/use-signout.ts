"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignout() {
  const router = useRouter();
  const handleSignout = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Sign Out successfully");
        },
        onError: () => {
          toast.error("Failed to sign out");
        },
      },
    });
  };

  return handleSignout;
}
