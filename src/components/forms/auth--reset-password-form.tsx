"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { resetPasswordFormSchema } from "@/types/auth-type";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Suspense } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type ResetPasswordValues = z.infer<typeof resetPasswordFormSchema>;

function ResetPasswordForm() {
  const token = useSearchParams().get("token") || "";

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      toast.success("Password successfully reset! You can now log in.");
      form.reset();
    },

    // TODO: fix error handling based on better-auth errors
    onError: (error) => {
      console.error(error);
      toast.error(
        error.message || "Failed to reset password. Please try again.",
      );
    },
  });

  const onSubmit = (values: ResetPasswordValues) => {
    resetPasswordMutation.mutate({
      token: values.token,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center space-y-6">
      <div className="w-full max-w-md space-y-6">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            {token
              ? "Enter your new password below."
              : "Invalid Password Reset Token"}
          </p>
        </div>

        {/* Show form only if token exists */}
        {token && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        disabled={resetPasswordMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter new password"
                        disabled={resetPasswordMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        )}

        {/* Back to login */}
        <p className="mt-4 text-center text-sm">
          Remembered your password?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordFormComponent() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
