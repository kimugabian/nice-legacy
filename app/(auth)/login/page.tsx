import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { LoginForm } from "./_components/LoginForm";

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role === "ADMIN") redirect("/admin");
    if (user?.role === "TEACHER") redirect("/teacher");
    redirect("/student");
  }

  return <LoginForm />;
}
