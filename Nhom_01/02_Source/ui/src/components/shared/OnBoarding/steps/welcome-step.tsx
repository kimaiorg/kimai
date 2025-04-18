"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, BarChart, Clock, Users } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      icon: <Clock className="h-6 w-6 color-main" />,
      title: "Time Tracking",
      description: "Track your time efficiently with our intuitive interface"
    },
    {
      icon: <BarChart className="h-6 w-6 color-main" />,
      title: "Detailed Reports",
      description: "Get insights with comprehensive reporting tools"
    },
    {
      icon: <Users className="h-6 w-6 color-main" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with your team members"
    }
  ];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 text-center"
      >
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome to Kimai Solution
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Let's set up your account in just a few simple steps
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 grid w-full gap-6 md:grid-cols-3"
      >
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border-slate-100 dark:border-slate-800"
          >
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(110, 68, 255, 0.1)" }}
              >
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <Button
          onClick={onNext}
          className="text-white bg-gradient-to-r cursor-pointer from-[#6e44ff] to-[#936bff] hover:from-[#5a36d6] hover:to-[#7f5ce0]"
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
