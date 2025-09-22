"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface QuestionProps {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
    timeLimit: number;
  };
  onAnswer: (answer: string) => void;
  onTimeout: () => void;
}

export function Question({ question, onAnswer, onTimeout }: QuestionProps) {
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);

  useEffect(() => {
    setTimeLeft(question.timeLimit);
  }, [question]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            onTimeout();
          }, 0);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question, onTimeout]);

  return (
    <div className="shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-8">{question.question}</h2>
      <div className="space-y-5">
        {question.options.map((option) => (
          <Button
            key={option}
            onClick={() => onAnswer(option)}
            className="w-full text-left justify-start font-semibold"
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Time Left: {timeLeft} seconds
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / question.timeLimit) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
