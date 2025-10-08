import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const headersList = new Headers();
  (await headers()).forEach((value, key) => {
    headersList.append(key, value);
  });

  const session = await auth.api.getSession({ headers: headersList });

 

  if (!session?.user) {
    redirect("/login");
    return null
  }

   console.log("SESSION USER ===>", session.user);

  // 👇 cast supaya TypeScript tahu ada role
  const role = (session.user as typeof session.user & { role?: string }).role;

  switch (role) {
    case "ADMIN":
      redirect("/admin");
    case "TEACHER":
      redirect("/teacher");
    case "STUDENT":
      redirect("/student");
    default:
      redirect("/");
  }


}
