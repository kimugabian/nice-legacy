import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/general/EmptyState";
import { Suspense } from "react";
import { teacherGetRecentCourses } from "@/app/dashboard/data/teacher/teacher-get-recent-courses";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard";

export default async function TeacherIndexPage() {
  const h = await headers();
  const headersList = new Headers();
  h.forEach((value: string, key: string) => {
    headersList.append(key, value);
  });

  const session = await auth.api.getSession({ headers: headersList });

  if (!session?.user) {
    redirect("/login");
  }

  const teacherId = session.user.id;

  // (opsional) kalau kamu punya statistik khusus teacher
  const enrollmentData: any[] = []; // kosong dulu supaya tidak error

  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={enrollmentData} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Recent Courses</h2>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/dashboard/teacher/courses"
          >
            View All My Courses
          </Link>
        </div>

        <Suspense fallback={<RenderRecentCourseSkeletonLayout />}>
          <RenderRecentCourse teacherId={teacherId} />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourse({ teacherId }: { teacherId: string }) {
  const data = await teacherGetRecentCourses(teacherId);

  if (data.length === 0) {
    return (
      <EmptyState
        title="You don’t have any courses yet!"
        description="You don’t have any courses. Create a new course to get started."
        buttonText="Create New Course"
        href="/dashboard/teacher/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function RenderRecentCourseSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
