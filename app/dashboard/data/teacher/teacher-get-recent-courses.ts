import { prisma } from "@/lib/db";

export async function teacherGetRecentCourses(userId: string) {
  return prisma.course.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      _count: { select: { chapter: true } },
    },
  });
}
