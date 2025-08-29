"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Sign Out successfully");
        },
      },
    });
  };

  return (
    <div>
      <h1>Hello world</h1>
      <ThemeToggle />

      {session ? (
        <div>
          <p>You are signed in as {session.user.name}</p>
          <Button onClick={signOut}>Sign out</Button>
        </div>
      ) : (
        <p>You are not signed in</p>
      )}
    </div>
  );
}
