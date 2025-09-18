import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Lock, Play } from "lucide-react";
import Link from "next/link";

interface iAppProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
  slug: string;
  isActive?: boolean;
  completed: boolean;
  isLocked?: boolean;
}

export function LessonItem({
  lesson,
  slug,
  isActive,
  completed,
  isLocked,
}: iAppProps) {
  const baseClasses = cn(
    "w-full p-2.5 h-auto justify-start transition-all",
    completed &&
      "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50 text-gray-800 dark:text-green-200",
    isActive &&
      !completed &&
      "bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary",
    isLocked &&
      // "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900/50 text-gray-400"
      "opacity-60 cursor-not-allowed pointer-events-none"
  );

  const content = (
    <div className="flex items-center gap-2.5 w-full min-w-0">
      <div className="shrink-0">
        {isLocked ? (
          <div className="size-5 rounded-full border border-muted-foreground/50 flex justify-center items-center">
            <Lock className="size-3 text-muted-foreground" />
          </div>
        ) : completed ? (
          <div className="size-5 rounded-full bg-green-600 dark:bg-green-500 flex justify-center items-center">
            <Check className="size-3 text-white" />
          </div>
        ) : (
          <div
            className={cn(
              "size-5 rounded-full border-2 bg-background flex justify-center items-center",
              isActive
                ? "border-primary bg-primary/10 dark:bg-primary/20"
                : "border-muted-foreground/60"
            )}
          >
            <Play
              className={cn(
                "size-2.5 fill-current",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
        )}
      </div>

      <div className="flex-1 text-left min-w-0">
        <p
          className={cn(
            "text-xs font-medium truncate",
            isLocked
              ? "text-muted-foreground"
              : completed
              ? "text-green-800 dark:text-green-200"
              : isActive
              ? "text-primary font-semibold"
              : "text-foreground"
          )}
        >
          {lesson.position}. {lesson.title}
        </p>

        {isLocked && (
          <p className="text-[10px] text-muted-foreground font-medium">
            Locked
          </p>
        )}
        {completed && (
          <p className="text-[10px] text-green-700 dark:text-green-300 font-medium">
            Completed
          </p>
        )}
        {isActive && !completed && (
          <p className="text-[10px] text-primary font-medium">
            Currently watching
          </p>
        )}
      </div>
    </div>
  );

  if (isLocked) {
    return (
      <div
        className={buttonVariants({
          variant: "outline",
          className: baseClasses,
        })}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      className={buttonVariants({
        variant: completed ? "secondary" : "outline",
        className: baseClasses,
        // className: cn(
        //   "w-full p-2.5 h-auto justify-start transition-all",
        //   completed &&
        //     "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50 text-gray-800 dark:text-green-200",
        //   isActive &&
        //     !completed &&
        //     "bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary"
        // ),
      })}
    >
      {content}
      {/* <div className="flex items-center gap-2.5 w-full min-w-0">
        <div className="shrink-0">
          {completed ? (
            <div className="size-5 rounded-full bg-green-600 dark:bg-green-500 flex justify-center items-center">
              <Check className="size-3 text-white" />
            </div>
          ) : (
            <div
              className={cn(
                "size-5 rounded-full border-2 bg-background flex justify-center items-center",
                isActive
                  ? "border-primary bg-primary/10 dark:bg-primary/20"
                  : "border-muted-foreground/60"
              )}
            >
              <Play
                className={cn(
                  "size-2.5 fill-current",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
          )}
        </div>

        <div className="flex-1 text-left min-w-0">
          <p
            className={cn(
              "text-xs font-medium truncate",
              completed
                ? "text-green-800 dark:text-green-200"
                : isActive
                ? "text-primary font-semibold"
                : "text-foreground"
            )}
          >
            {lesson.position}. {lesson.title}
          </p>
          {completed && (
            <p className="text-[10px] text-green-700 dark:text-green-300 font-medium">
              Completed
            </p>
          )}

          {isActive && !completed && (
            <p className="text-[10px] text-primary font-medium">
              Currently watching
            </p>
          )}
        </div>
      </div> */}
    </Link>
  );
}
