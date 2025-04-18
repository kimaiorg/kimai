"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

interface CompletionStepProps {
  onFinish: () => void;
}

export function CompletionStep({ onFinish }: CompletionStepProps) {
  const completedItems = ["Profile setup completed", "Preferences configured", "Account ready to use"];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="mb-8 flex flex-col items-center text-center"
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-main">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">All Set!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Your account has been successfully set up and is ready to use.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10 w-full max-w-md"
      >
        <Card className="border-slate-100 dark:border-slate-800">
          <CardContent className="px-6">
            <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">Setup Summary</h3>
            <ul className="space-y-3">
              {completedItems.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <Button
          onClick={onFinish}
          className="text-white bg-gradient-to-r cursor-pointer from-[#6e44ff] to-[#936bff] hover:from-[#5a36d6] hover:to-[#7f5ce0]"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
