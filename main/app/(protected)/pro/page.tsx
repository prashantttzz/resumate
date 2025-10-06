"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Crown,
  Check,
  Calendar,
  CreditCard,
  AlertTriangle,
  Loader2,
  Zap,
  Headphones,
} from "lucide-react";
import { isPremium } from "@/query/user/query";
import Loader from "@/components/Loader";
import { formatDate } from "@/lib/utils";
import { LoadingScreen } from "@/components/loading-screen";
import PremiumButton from "@/components/SubscriptionButton";

interface PlanFeature {
  name: string;
  description: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: number;
  interval: "month" | "year";
  features: PlanFeature[];
  popular?: boolean;
}

interface UserSubscription {
  planName: string;
  nextBillingDate: string;
  status: "active" | "cancelled" | "past_due";
}

const plans: Plan[] = [
  {
    name: "Free",
    price: 0,
    interval: "month",
    features: [
      {
        name: "Basic Resumes",
        description: "Create up to 3 resumes",
        included: true,
      },
      {
        name: "Standard Templates",
        description: "Access to basic templates",
        included: true,
      },
      { name: "PDF Export", description: "Download as PDF", included: true },
      {
        name: "Premium Templates",
        description: "Access to premium designs",
        included: false,
      },
      {
        name: "AI Optimization",
        description: "AI-powered suggestions",
        included: false,
      },
      {
        name: "Priority Support",
        description: "24/7 premium support",
        included: false,
      },
    ],
  },
  {
    name: "Pro",
    price: 100,
    interval: "month",
    popular: true,
    features: [
      {
        name: "Unlimited Resumes",
        description: "Create as many resumes as you need",
        included: true,
      },
      {
        name: "Premium Templates",
        description: "Access to all premium resume templates",
        included: true,
      },
      {
        name: "AI Resume Optimization",
        description: "Get AI-powered suggestions to improve your resume",
        included: true,
      },
      {
        name: "Priority Support",
        description: "Get help from our support team within 24 hours",
        included: true,
      },
      {
        name: "Advanced Analytics",
        description: "Track resume performance",
        included: true,
      },
      {
        name: "Custom Branding",
        description: "Remove watermarks",
        included: true,
      },
    ],
  },
];

export default function PlanOverview() {
  const { data, isPending: ispremiumLoading } = isPremium();
  const [currentSubscription, setCurrentSubscription] =
    useState<UserSubscription | null>(null);
  useEffect(() => {
    if (data) {
      setCurrentSubscription({
        planName: data.isPremium ? "Pro" : "Free",
        nextBillingDate:
          data?.expireDate?.toISOString() || new Date().toISOString(),
        status: data?.isPremium ? "active" : "cancelled",
      });
    }
  }, [data]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const currentPlan = plans.find(
    (plan) => plan.name === currentSubscription?.planName
  );
  const handleCancelSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(
        "Your subscription has been cancelled. You'll continue to have access until your next billing date."
      );
      setShowCancelDialog(false);
    } catch (err) {
      setError("Failed to cancel subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (currentSubscription?.status) {
      case "active":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "past_due":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            Past Due
          </Badge>
        );
      default:
        return null;
    }
  };
  if (ispremiumLoading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen  text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-main">Your Plan</h1>
            <p className="text-white mt-1">
              Manage your subscription and billing
            </p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 bg-green-500/10">
            <Check className="h-4 w-4" />
            <AlertDescription className="text-green-400">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Plan Details */}
          <div className="lg:col-span-2">
            <Card className="">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    {currentPlan?.name} Plan
                    {currentPlan?.popular && (
                      <Badge className="bg-main hover:bg-main">
                        Popular
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {currentPlan?.price}
                      <span className="text-sm text-main">
                        /{currentPlan?.interval}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300">
                  You have access to all premium features
                </p>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Plan Benefits</h3>
                  <div className="grid gap-3">
                    {currentPlan?.features
                      .filter((f) => f.included)
                      .map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-main mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{feature.name}</div>
                            <div className="text-sm text-gray-400">
                              {feature.description}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                {currentSubscription?.status === "active" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-white ">
                        Next billing date
                      </span>
                    </div>
                    <span className="font-medium text-main">
                      {currentSubscription?.nextBillingDate &&
                        formatDate(currentSubscription.nextBillingDate)}{" "}
                    </span>
                  </div>
                )}
                {currentSubscription?.status === "cancelled" && (
                  <div className="flex items-center w-fit justify-between bg-white rounded-2xl">
                    <PremiumButton />
                  </div>
                )}
                <div className="flex gap-3">
                  {currentSubscription?.status === "active" && (
                    <Dialog
                      open={showCancelDialog}
                      onOpenChange={setShowCancelDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-gray-600 hover:border-red-500 hover:text-red-400"
                        >
                          Cancel Subscription
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="">
                        <DialogHeader>
                          <DialogTitle>Cancel Subscription</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel your subscription?
                            You'll lose access to premium features at the end of
                            your billing period.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Alert className="border-yellow-500 bg-yellow-500/10">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-yellow-400">
                              Your subscription will remain active until{" "}
                              {formatDate(currentSubscription.nextBillingDate)}
                            </AlertDescription>
                          </Alert>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                          >
                            Keep Subscription
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleCancelSubscription}
                            disabled={isLoading}
                          >
                            {isLoading && (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Cancel Subscription
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing Information */}
          <div className="space-y-6">
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-main" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">
                  Have questions about your subscription? Our support team is
                  here to help.
                </p>
                <Button variant="outline" className="w-full border-gray-600">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
