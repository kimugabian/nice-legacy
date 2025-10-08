import { prisma } from "@/lib/db";
import { requireUser } from "./require-user";

export async function getEnrolledCourses() {
  const user = await requireUser();

  const data = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      smallDescription: true,
      fileKey: true,
      level: true,
      slug: true,
      duration: true,
      chapter: {
        select: {
          id: true,
          lessons: {
            select: {
              id: true,
              lessonProgress: {
                where: {
                  userId: user.id,
                },
                select: {
                  id: true,
                  completed: true,
                  lessonId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
}

export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[0];
