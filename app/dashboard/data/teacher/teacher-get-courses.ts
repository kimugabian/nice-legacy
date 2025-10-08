import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function teacherGetCourses() {
  const { userId } = auth();

  if (!userId) return [];

  const courses = await db.course.findMany({
    where: {
      teacherId: userId, // hanya ambil course milik teacher yg login
    },
    orderBy: { createdAt: "desc" },
  });

  return courses;
}
