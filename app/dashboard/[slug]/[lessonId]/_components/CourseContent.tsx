/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rict-text-editor/RenderDescription";
import { Button, buttonVariants } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { BookIcon, CheckCircle, FileText } from "lucide-react";
import { useTransition } from "react";
import { markLessonCompleted } from "../actions";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";
import Link from "next/link";
import { Quiz } from "./Quiz";

interface iAppProps {
  data: LessonContentType;
}

export function CourseContent({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();

  const { triggerConfetti } = useConfetti();

  function VideoPlayer({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) {
    const videoUrl = useConstructUrl(videoKey);
    const thumbnailUrl = useConstructUrl(thumbnailKey);

    if (!videoKey) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
          <BookIcon className="size-16 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            This lesson does not have a video yet
          </p>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
        <video
          className="w-full h-full object-cover"
          controls
          poster={thumbnailUrl}
          controlsList="nodownload"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/oog" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  function PdfViewer({ pdfKey }: { pdfKey: string }) {
    const pdfUrl = useConstructUrl(pdfKey);
    const previewUrl = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;
    return (
      <div className="mt-4">
        <Link
          href={previewUrl}
          target="_blank"
          className={buttonVariants({ variant: "outline" })}
        >
          <FileText className="size-4" />
          View PDF
        </Link>
      </div>
    );
  }

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markLessonCompleted(data.id, data.Chapter.Course.slug)
      );

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />

      <div className="py-4 border-b">
        {/* {data.lessonProgress.length > 0 ? (
          <Button
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:text-green-600"
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button variant="outline" onClick={onSubmit} disabled={pending}>
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Mark as complete
          </Button>
        )} */}
      </div>

      <div className="space-y-3 pt-3 border-b py-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>
        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>

      <div className="py-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Lesson Material
        </h1>
        <div className="flex items-center gap-x-4">
          <PdfViewer pdfKey={"React__1715760661.pdf"} />
          {data.lessonProgress.length === 0 ? (
            <Quiz data={data} />
          ) : (
            <Button
              variant="outline"
              className="bg-green-500/10 text-green-500 hover:text-green-600 mt-4"
            >
              <CheckCircle className="size-4 mr-2 text-green-500" />
              Completed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
