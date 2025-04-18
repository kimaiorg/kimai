"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStepIndex: number;
  completedSteps: string[];
  onStepClick: (index: number) => void;
}

export function StepIndicator({ steps, currentStepIndex, completedSteps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center space-x-2">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = index === currentStepIndex;

        return (
          <div
            key={step.id}
            className="flex items-center"
          >
            {index > 0 && (
              <div
                className={cn(
                  "h-px w-8 mx-1",
                  index <= currentStepIndex || isCompleted ? "bg-main" : "bg-slate-200 dark:bg-slate-700"
                )}
              />
            )}
            <button
              onClick={() => onStepClick(index)}
              disabled={index > currentStepIndex && !isCompleted}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
                isCompleted
                  ? "bg-main text-white cursor-pointer"
                  : isCurrent
                    ? "border-2 border-main color-main"
                    : "border-2 border-slate-200 text-slate-400 dark:border-slate-700"
              )}
            >
              {isCompleted ? <CheckIcon className="h-4 w-4" /> : <span>{index + 1}</span>}
            </button>
            <span
              className={cn(
                "ml-2 hidden text-sm font-medium sm:block",
                isCurrent ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
              )}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
