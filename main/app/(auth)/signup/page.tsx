"use client";

import type React from "react";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Dock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useSignup } from "@/query/user/query";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().min(2).max(50),
  password: z.string().min(2).max(50),
});

export default function SignupPage() {
  const { mutate: signup, isPending, isError, error } = useSignup();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, name, password } = values;
    signup({ email, password, name });
  }
  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || "Error creating account");
    }
  }, [isError, error]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium text-zinc-400 hover:text-white">
            Back to home
          </span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-zinc-900/70 border border-zinc-800 backdrop-blur-sm shadow-xl">
            <CardHeader className="space-y-1 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-zinc-600 to-zinc-600 opacity-75 blur"></div>
                  <div className="relative bg-black rounded-full p-1">
                    <Dock className="h-6 w-6 text-zinc-400" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent text-white">
                  ResuMate{" "}
                </span>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Create an account
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Enter your information to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>name</FormLabel>
                          <FormControl>
                            <Input placeholder="john doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>email</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe@.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>password</FormLabel>
                          <FormControl>
                            <Input placeholder="*******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center space-x-2"></div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-zinc-600 to-zinc-600 hover:from-zinc-500 hover:to-zinc-500 border-0 text-white"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating account...
                      </div>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </form>
              </Form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="bg-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-zinc-500">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                onClick={() => signIn("google",{callbackUrl:'/dashboard'})}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Sign up with Google
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <p className="text-sm text-zinc-400 mt-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-white hover:text-white hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
