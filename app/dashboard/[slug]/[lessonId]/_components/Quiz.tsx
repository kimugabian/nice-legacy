/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconMessage2Question } from "@tabler/icons-react";
import { useEffect, useState, useTransition } from "react";
import { Question } from "./Question";
import { markLessonCompleted } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { useConfetti } from "@/hooks/use-confetti";
import { useRouter } from "next/navigation";
import { set } from "zod";
import {
  CircleCheckBig,
  CircleCheckBigIcon,
  CircleQuestionMark,
  CircleQuestionMarkIcon,
  CircleX,
  Percent,
} from "lucide-react";

const questions = [
  {
    question: "How do you say “Good Morning” politely in Japanese?",
    options: ["Oyasumi nasai", "Ohayou gozaimasu", "Konnichiwa", "Sayounara"],
    correctAnswer: "Ohayou gozaimasu",
    timeLimit: 15,
  },
  {
    question: "Which expression means “Good Afternoon” in Japanese?",
    options: ["Konbanwa", "Konnichiwa", "Arigatou gozaimasu", "Sumimasen"],
    correctAnswer: "Konnichiwa",
    timeLimit: 15,
  },
  {
    question: "The greeting “Konbanwa” is used when…",
    options: [
      "Meeting in the morning",
      "Meeting in the afternoon",
      "Meeting in the evening",
      "Going to sleep",
    ],
    correctAnswer: "Meeting in the evening",
    timeLimit: 15,
  },
  {
    question: "What does “Sayounara” mean?",
    options: ["Thank you", "Goodbye", "Excuse me", "Goodnight"],
    correctAnswer: "Goodbye",
    timeLimit: 15,
  },
  {
    question: "When you go to bed, you usually say…",
    options: [
      "Oyasumi nasai",
      "Ohayou gozaimasu",
      "Konnichiwa",
      "Hajimemashite",
    ],
    correctAnswer: "Oyasumi nasai",
    timeLimit: 15,
  },
  {
    question: "How do you say “Thank you” in a polite way?",
    options: ["Arigatou", "Sumimasen", "Arigatou gozaimasu", "Sayounara"],
    correctAnswer: "Arigatou gozaimasu",
    timeLimit: 15,
  },
  {
    question: "Which Japanese word is used for “Excuse me / I’m sorry”?",
    options: ["Sumimasen", "Oyasumi nasai", "Konnichiwa", "Hajimemashite"],
    correctAnswer: "Sumimasen",
    timeLimit: 15,
  },
  {
    question: "What should you say when meeting someone for the first time?",
    options: [
      "Sayounara",
      "Oyasumi nasai",
      "Hajimemashite, dozo yoroshiku",
      "Arigatou gozaimasu",
    ],
    correctAnswer: "Hajimemashite, dozo yoroshiku",
    timeLimit: 15,
  },
  {
    question: "Which pair is correct?",
    options: [
      "Oyasumi nasai – Good morning",
      "Ohayou – Good night",
      "Konbanwa – Good evening (when meeting)",
      "Konnichiwa – Good night (before sleeping)",
    ],
    correctAnswer: "Konbanwa – Good evening (when meeting)",
    timeLimit: 15,
  },
  {
    question: "“Arigatou” is used in which situation?",
    options: [
      "Saying thank you casually",
      "Greeting in the afternoon",
      "Saying goodbye",
      "Apologizing",
    ],
    correctAnswer: "Saying thank you casually",
    timeLimit: 15,
  },
];

interface iAppProps {
  data: LessonContentType;
  setIsOpen?: (open: boolean) => void;
}

export function Quiz({ data }: iAppProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [unattemptedQuestions, setUnattemptedQuestions] = useState(0);

  const [pending, startTransition] = useTransition();

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleAnswer = (option: string) => {
    if (isAnswered) return;

    setIsAnswered(true);

    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleTimeout = () => {
    setIsAnswered(true);
    setUnattemptedQuestions(unattemptedQuestions + 1);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  useEffect(() => {
    if (quizCompleted && percentage >= 70) {
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
          // triggerConfetti();
        } else if (result.status === "error") {
          toast.error(result.message);
        }
      });
    }
  }, [quizCompleted, data.id, data.Chapter.Course.slug]);

  const handleOpenChange = (open: boolean) => {
    if (quizStarted && !quizCompleted && !open) return;

    if (!open) {
      router.refresh();
    }

    setIsOpen(open);
  };

  const percentage = Math.round((correctAnswers / questions.length) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="mt-4">
          <IconMessage2Question className="size-4" />
          Take quiz
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[525px] sm:min-h-[375px]"
        onInteractOutside={(e) => {
          if (quizStarted && !quizCompleted) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (quizStarted && !quizCompleted) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        {!quizStarted ? (
          <div className="w-full max-w-md mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Quiz</h1>
            <Button
              onClick={startQuiz}
              className=" text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-primary/80"
            >
              Start Quiz
            </Button>
          </div>
        ) : quizCompleted ? (
          <div className="p-6flex flex-col items-center ">
            <h2 className="text-3xl font-bold mb-6">Quiz Result</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Correct Answers */}
              <div className="p-5 shadow-md rounded-lg flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300">
                <CircleCheckBig className="text-green-500 size-6 mb-3" />
                {/* <div> */}
                <p className="text-xl font-semibold">Correct Answers</p>
                <p className="text-lg font-bold text-green-600">
                  {correctAnswers}
                </p>
                {/* </div> */}
              </div>

              {/* Wrong Answers */}
              <div className="p-5 shadow-md rounded-lg flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300">
                {/* <div> */}
                <CircleX className="text-red-600 size-6 mb-3" />
                <p className="text-xl font-semibold">Wrong Answers</p>
                <p className="text-lg font-bold text-red-600">{wrongAnswers}</p>
                {/* </div> */}
              </div>

              {/* Unattempted Questions */}
              <div className="p-5 shadow-md rounded-lg flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300">
                {/* <div> */}
                <CircleQuestionMarkIcon className="text-yellow-500 size-6 mb-3" />
                <p className="text-xl font-semibold">Unattempted Questions</p>
                <p className="text-lg font-bold text-yellow-600">
                  {unattemptedQuestions}
                </p>
                {/* </div> */}
              </div>

              {/* Percentage */}
              <div className="p-5 shadow-md rounded-lg flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow duration-300">
                {/* <div> */}
                <Percent className="text-blue-500 size-6" />
                <p className="text-xl font-semibold mb-3">Percentage</p>
                <p className="text-lg font-bold text-blue-600">{percentage}%</p>
                {/* </div> */}
              </div>

              {/* Final Score */}
              <div className="p-5  shadow-md rounded-lg flex items-center justify-between col-span-1 md:col-span-3 text-center hover:shadow-lg transition-shadow duration-300">
                <p className="text-xl font-semibold w-full text-muted-foreground">
                  You scored {correctAnswers} out of {questions.length}{" "}
                  questions!
                </p>

                {pending && (
                  <p className="mt-2 text-sm text-gray-500">Saving...</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Quiz</h1>
            <Question
              onTimeout={handleTimeout}
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
            />
            <p className="mt-4 text-center text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
