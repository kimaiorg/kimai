"use client";

import { StepIndicator } from "@/components/shared/OnBoarding/step-indicator";
import { CompletionStep } from "@/components/shared/OnBoarding/steps/completion-step";
import { PreferencesStep } from "@/components/shared/OnBoarding/steps/preferences-step";
import { ProfileStep } from "@/components/shared/OnBoarding/steps/profile-step";
import { WelcomeStep } from "@/components/shared/OnBoarding/steps/welcome-step";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

// Define the form data types
export interface ProfileFormData {
  nickname: string;
  avatarUrl?: string;
}

export interface PreferencesFormData {
  theme: "light" | "dark" | "system";
  currency: string;
  region: string;
  notifications: boolean;
  emailUpdates: boolean;
  autoTrack: boolean;
}

export interface OnboardingData {
  profile?: ProfileFormData;
  preferences?: PreferencesFormData;
}

const steps = [
  { id: "welcome", title: "Welcome" },
  { id: "profile", title: "Your Profile" },
  { id: "preferences", title: "Preferences" },
  { id: "complete", title: "All Set!" }
];

export default function OnBoarding() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [formData, setFormData] = useState<OnboardingData>({});
  const currentStep = steps[currentStepIndex];

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCompletedSteps([...completedSteps, steps[currentStepIndex].id]);
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index < currentStepIndex || completedSteps.includes(steps[index].id)) {
      setCurrentStepIndex(index);
    }
  };

  const updateProfileData = (data: ProfileFormData) => {
    setFormData({ ...formData, profile: data });
  };

  const updatePreferencesData = (data: PreferencesFormData) => {
    setFormData({ ...formData, preferences: data });
  };

  const handleFinish = () => {
    localStorage.setItem("onboarding", "true");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white shadow-xl dark:bg-slate-900">
          <div className="relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
            {/* Header with logo and progress */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-main text-white">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Setup Wizard</h1>
              </div>
              <div className="hidden md:block">
                <StepIndicator
                  steps={steps}
                  currentStepIndex={currentStepIndex}
                  completedSteps={completedSteps}
                  onStepClick={goToStep}
                />
              </div>
            </div>

            {/* Mobile step indicator */}
            <div className="border-b border-slate-100 bg-white px-8 py-4 md:hidden dark:border-slate-800 dark:bg-slate-900">
              <StepIndicator
                steps={steps}
                currentStepIndex={currentStepIndex}
                completedSteps={completedSteps}
                onStepClick={goToStep}
              />
            </div>

            {/* Content area */}
            <div className="min-h-[500px] px-8 py-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {currentStep.id === "welcome" && <WelcomeStep onNext={goToNextStep} />}
                  {currentStep.id === "profile" && (
                    <ProfileStep
                      onNext={goToNextStep}
                      onBack={goToPreviousStep}
                    />
                  )}
                  {currentStep.id === "preferences" && (
                    <PreferencesStep
                      onNext={goToNextStep}
                      onBack={goToPreviousStep}
                    />
                  )}
                  {currentStep.id === "complete" && <CompletionStep onFinish={handleFinish} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
