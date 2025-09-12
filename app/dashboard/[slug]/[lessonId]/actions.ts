"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { APiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function markLessonCompleted(
  lessonId: string,
  slug: string
): Promise<APiResponse> {
  const session = await requireUser();

  try {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        userId: session.id,
        lessonId: lessonId,
        completed: true,
      },
    });

    revalidatePath(`/dashboard/${slug}`);

    return {
      status: "success",
      message: "Progress updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to mark lesson as completed",
    };
  }
}
