import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconMessage2Question } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { Question } from "./Question";
import { markLessonCompleted } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { LessonContentType } from "@/app/data/course/get-lesson-content";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Rome"],
    correctAnswer: "Paris",
    timeLimit: 15,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    timeLimit: 10,
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Giraffe", "Blue Whale", "Polar Bear"],
    correctAnswer: "Blue Whale",
    timeLimit: 20,
  },
];

interface iAppProps {
  data: LessonContentType;
  setIsOpen?: (open: boolean) => void;
}

export function Quiz({ data }: iAppProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="mt-4">
          <IconMessage2Question className="size-4" />
          Take quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] sm:min-h-[375px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <QuizContent data={data} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}

function QuizContent({
  data,
  setIsOpen,
}: {
  data: LessonContentType;
  setIsOpen: (open: boolean) => void;
}) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  // const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const [pending, startTransition] = useTransition();

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    // setAnsweredQuestions(0);
  };

  const handleAnswer = (answer: string) => {
    // setAnsweredQuestions(answeredQuestions + 1);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const onSubmit = () => {
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
        setIsOpen(false);
        // triggerConfetti();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  if (!quizStarted) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Quiz</h1>
        <Button
          onClick={startQuiz}
          className=" text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-primary/80"
        >
          Start Quiz
        </Button>
      </div>
    );
  }

  if (quizCompleted) {
    const isPerfectScore = score === questions.length;

    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed</h2>
        {/* {isPerfectScore && <ReactConfetti width={width} height={height} />} */}

        <p
          className={`text-xl ${
            isPerfectScore ? "text-green-600 font-bold" : ""
          }`}
        >
          You scored {score} out of {questions.length} questions.
        </p>
        <Button
          onClick={onSubmit}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-600"
        >
          Quit quiz
        </Button>
      </div>
    );

    // return (
    //   <div className="flex flex-col items-center">
    //     {/* {showConfetti && <Confetti width={width} height={height} numberOfPieces={700} />} */}

    //     <h2 className="text-3xl font-bold mb-6 text-center text-primary">
    //       Quiz Results
    //     </h2>
    //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    //       {/* Correct Answers */}
    //       <div className=" shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
    //         <div>
    //           <p className="text-xl font-semibold">Correct Answers</p>
    //           {/* <p className="text-lg font-bold text-green-600">{correctAnswers}</p> */}
    //         </div>
    //         {/* <FaCheckCircle className="text-green-500 text-3xl" /> */}
    //       </div>

    //       {/* Wrong Answers */}
    //       <div className=" shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
    //         <div>
    //           <p className="text-xl font-semibold">Wrong Answers</p>
    //           {/* <p className="text-lg font-bold text-red-600">{wrongAnswers}</p> */}
    //         </div>
    //         {/* <FaTimesCircle className="text-red-500 text-3xl" /> */}
    //       </div>

    //       {/* Percentage */}
    //       <div className=" shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
    //         <div>
    //           <p className="text-xl font-semibold">Percentage</p>
    //           {/* <p className="text-lg font-bold text-blue-600">{percentage}%</p> */}
    //         </div>
    //         {/* <FaPercentage className="text-blue-500 text-3xl" /> */}
    //       </div>

    //       {/* Final Score */}
    //       <div className="p-5 shadow-md rounded-lg flex items-center justify-between col-span-1 md:col-span-2 text-center hover:shadow-lg transition-shadow duration-300">
    //         <p className="text-xl font-semibold w-full">
    //           {/* You scored {correctAnswers * 4} out of {totalQuestions * 4} points! */}
    //           You scored {score} out of {questions.length} points!
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // );
  }

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Quiz</h1>
      <Question
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
      />
      <p className="mt-4 text-center text-muted-foreground">
        Question {currentQuestionIndex + 1} of {questions.length}
      </p>
    </div>
  );
}
