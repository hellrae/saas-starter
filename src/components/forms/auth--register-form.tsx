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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

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
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "Failed to sign up. Please try again.");
    },
  });

  function onSubmit(values: z.infer<typeof signupFormSchema>) {
    signUpMutation.mutate(values);
  }

  return (
    <AuthCard>
      <AuthHeader title="Create an account" />

      <AuthContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <Field data-invalid={!!errors.name}>
            <Label>Name</Label>

            <Input
              placeholder="Your full name"
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              {...register("name")}
            />

            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

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
              placeholder="Create a password"
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              {...register("password")}
            />

            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>

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
      </AuthContent>

      <DefaultAuthFooter />
    </AuthCard>
  );
}
