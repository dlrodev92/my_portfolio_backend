"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  progress: number;
  lastSaved: Date | null;
}

export default function StepNavigation({ 
  steps, 
  currentStep, 
  onStepClick, 
  progress, 
  lastSaved 
}: StepNavigationProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Blog Creation</CardTitle>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {lastSaved && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Last saved at {formatTime(lastSaved)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isAccessible = step.id <= currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isAccessible && onStepClick(step.id)}
              disabled={!isAccessible}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all duration-200",
                "border border-transparent",
                isActive && "bg-primary text-primary-foreground border-primary",
                isCompleted && !isActive && "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
                !isActive && !isCompleted && isAccessible && "hover:bg-muted",
                !isAccessible && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-0.5",
                  isActive && "bg-primary-foreground text-primary",
                  isCompleted && !isActive && "bg-green-500 text-white",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground"
                )}>
                  {isCompleted ? <Check className="w-3 h-3" /> : step.id}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={cn(
                      "font-medium text-sm",
                      isActive && "text-primary-foreground",
                      isCompleted && !isActive && "text-green-700 dark:text-green-300"
                    )}>
                      {step.title}
                    </h3>
                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs">
                        Complete
                      </Badge>
                    )}
                  </div>
                  <p className={cn(
                    "text-xs mt-1",
                    isActive && "text-primary-foreground/80",
                    !isActive && "text-muted-foreground"
                  )}>
                    {step.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}