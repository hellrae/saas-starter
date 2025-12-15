"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import {
  AuthCard,
  AuthHeader,
  AuthContent,
  AuthSeparator,
  CheckEmailIllustration,
  DefaultAuthFooter,
} from "@/components/forms/auth--form-ui";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "@/components/ui/field";

import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const mutation = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: (_, variables) => {
      toast.success(`Password reset link sent to: ${variables}`, {
        duration: 5000,
        style: {
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxWidth: "400px",
        },
      });
      reset();
      setSentTo(variables);
    },
    onError: (error) => {
      console.error(error);
      if (error.message.includes("invalid credentials")) {
        toast.error("Invalid email. Try again.");
      } else {
        toast.error(error.message || "Failed to request password reset.");
      }
    },
  });

  function onSubmit(values: ForgotValues) {
    mutation.mutate(values.email);
  }

  function handleChangeEmail() {
    setSentTo(null);
    reset();
  }

  return (
    <AuthCard>
      <AuthHeader title="Reset your password" />

      <AuthContent>
        {!sentTo ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Field data-invalid={!!errors.email}>
              <Label>Email</Label>

              <Input
                placeholder="name@example.com"
                disabled={mutation.isPending}
                aria-invalid={!!errors.email}
                {...register("email")}
              />

              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>

            <AuthSeparator />

            <div className="pt-4 text-center text-sm text-muted-foreground">
              <span>Remembered it? </span>
              <Link href="/login" className="underline-offset-4 underline">
                Sign in
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <CheckEmailIllustration />

            <h3 className="text-lg font-medium">Check your email</h3>

            <p className="text-sm text-muted-foreground">
              If an account exists for{" "}
              <span className="font-medium">{sentTo}</span>, we&apos;ve sent a
              password reset link. It may take a few minutes to arrive. Please
              check your inbox and spam folder.
            </p>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  if (sentTo) mutation.mutate(sentTo);
                }}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Resend email"
                )}
              </Button>

              <Button variant="secondary" onClick={handleChangeEmail}>
                Change email
              </Button>
            </div>

            <div className="pt-2 text-sm text-muted-foreground">
              <span>Still no email? </span>
              <Link href="/support" className="underline-offset-4 underline">
                Contact support
              </Link>
            </div>
          </div>
        )}
      </AuthContent>

      <DefaultAuthFooter />
    </AuthCard>
  );
}
