"use client";

import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";

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
import { Field, FieldError } from "@/components/ui/field";

import { trpc } from "@/lib/trpc/client";
import { signInFormSchema } from "@/types/auth-type";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const signInMutation = trpc.auth.signIn.useMutation({
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
    onSuccess: () => {
      toast.success("Welcome back 👋");
      window.location.href = "/account";
    },
    onError: (error) => {
      console.error(error);
      if (error.message.includes("invalid credentials")) {
        toast.error("Invalid email or password. Try again.");
      } else {
        toast.error(error.message || "Failed to sign in. Please try again.");
      }
    },
  });

  function onSubmit(values: z.infer<typeof signInFormSchema>) {
    signInMutation.mutate(values);
  }

  return (
    <AuthCard>
      <AuthHeader title="Sign in to your account" />

      <AuthContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <Field data-invalid={!!errors.email}>
            <Label>Email</Label>

            <Input
              placeholder="name@example.com"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              {...register("email")}
            />

            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          {/* Password */}
          <Field data-invalid={!!errors.password}>
            <Label>Password</Label>

            <Input
              type="password"
              placeholder="Your password"
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              {...register("password")}
            />

            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="underline-offset-4 underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>

          <AuthSeparator />

          <SocialButtons onSocial={(p) => console.log("social", p)} />

          <div className="pt-4 text-center text-sm text-muted-foreground">
            <span>Don't have an account? </span>
            <Link href="/register" className="underline-offset-4 underline">
              Register
            </Link>
          </div>
        </form>
      </AuthContent>

      <DefaultAuthFooter />
    </AuthCard>
  );
}
