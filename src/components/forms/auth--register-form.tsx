"use client";

import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import {
  AuthCard,
  AuthHeader,
  AuthContent,
  AuthSeparator,
  SocialButtons,
  DefaultAuthFooter,
} from "@/components/forms/auth--form-ui";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { signupFormSchema } from "@/types/auth-type";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signUpMutation = trpc.auth.signUp.useMutation({
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      window.location.href = "/account";
    },
    // TODO: fix error handling based on better-auth errors
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "Failed to sign up. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof signupFormSchema>) {
    // Extra UX: check if terms are accepted
    signUpMutation.mutate(values);
  }

  return (
    <AuthCard>
      <AuthHeader title="Create an account" />

      <AuthContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Name</Label>
                  <FormControl>
                    <Input
                      placeholder="Your full name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label>Password</Label>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </div>

            <AuthSeparator />

            <SocialButtons onSocial={(p) => console.log("social", p)} />

            <div className="pt-4 text-center text-sm text-muted-foreground">
              <span>Already have an account? </span>
              <Link href="/login" className="underline-offset-4 underline">
                Login
              </Link>
            </div>
          </form>
        </Form>
      </AuthContent>

      <DefaultAuthFooter />
    </AuthCard>
  );
}
