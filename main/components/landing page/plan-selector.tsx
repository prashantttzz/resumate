"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import PremiumButton from "../SubscriptionButton";
import { isPremium } from "@/query/user/query";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "0",
    description: "Perfect for getting started",
    features: [
      "3 Resume",
      "3 Basic Templates",
      "Export as PDF",
      "Limited AI Suggestions",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "100",
    period: "/month",
    description: "For serious job seekers",
    features: [
      "Unlimited Resumes",
      "All Templates",
      "Full AI Assistance",
      "Resume Analytics",
      "github and linked in Support",
    ],
    popular: true,
  },
];

export default function PlanSelector() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const getYearlyPrice = (price: string) => {
    const numPrice = Number.parseInt(price.replace("$", ""));
    return `$${Math.round(numPrice * 0.8 * 12)}`;
  };

  return (
    <div className="space-y-8">

      <div className="grid md:grid-cols-2 md:px-32  gap-8">
        <AnimatePresence mode="wait">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`relative rounded-xl border ${
                selectedPlan === plan.id
                  ? "border-white bg-zinc-800 ring-2 ring-white ring-offset-2 ring-offset-zinc-950"
                  : plan.popular
                  ? "border-zinc-700 bg-zinc-800"
                  : "border-zinc-800 bg-zinc-900"
              } p-6 flex flex-col cursor-pointer transition-all duration-300 hover:border-zinc-600`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <span className="bg-white text-zinc-900 text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {selectedPlan === plan.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-3 -right-3 bg-white text-zinc-900 rounded-full p-1"
                >
                  <Check className="h-4 w-4" />
                </motion.div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold">
                    {billingPeriod === "yearly"
                      ? getYearlyPrice(plan.price)
                      : plan.price}
                  </span>
                  {plan.period && (
                    <span className="ml-1 text-zinc-400">
                      {billingPeriod === "yearly" ? "/year" : plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
              </div>

              <ul className="mb-6 space-y-3 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-white shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={
                  selectedPlan === plan.id
                    ? "bg-white text-zinc-900 hover:bg-zinc-200"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }
              >
                {selectedPlan === plan.id ? (
                  <>
                    Selected <Check className="ml-2 h-4 w-4" />
                  </>
                ) : plan.id === "free" ? (
                  "Get Started"
                ) : (
                  "Choose Plan"
                )}
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedPlan !== "free" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-8"
        >
          <Button
            size="lg"
            className="bg-white text-zinc-900 hover:bg-zinc-200"
          >
      <Link href={'/signUp'}>Go pro
      </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
