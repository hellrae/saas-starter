"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import type { User } from "better-auth";
import { trpc } from "@/lib/trpc/client";
import { Badge } from "@/components/ui/badge";

const ManageAccountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

type ManageAccountValues = z.infer<typeof ManageAccountSchema>;

export default function AccountProfileForm({ user }: { user: User }) {
  // Stable initial values from the user object
  const initialValues = useMemo<ManageAccountValues>(
    () => ({
      name: user.name ?? "",
      email: user.email ?? "",
    }),
    [user.name, user.email],
  );

  const form = useForm<ManageAccountValues>({
    resolver: zodResolver(ManageAccountSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  // If the user changes (hot reload/refetch), reset the form to new defaults
  useEffect(() => {
    form.reset(initialValues, { keepDirty: false, keepTouched: false });
  }, [initialValues, form]);

  const { isDirty, isSubmitting, dirtyFields } = form.formState;

  const updateUserMutation = trpc.user.updateUser.useMutation({
    onSuccess: () => {
      // mark form clean by syncing current values as the new baseline
      form.reset(form.getValues(), { keepDirty: false, keepTouched: true });
      toast.success("Profile updated successfully!");
    },
    onError: (err) => {
      console.error(err.message);
      toast.error(err.message ?? "Failed to update profile. Please try again.");
    },
  });

  const resendEmailVerificationMutation =
    trpc.user.resendEmailVerificationLink.useMutation({
      onSuccess: (res) => {
        if (res.status === true) {
          toast.success("Verification email sent successfully!");
        } else {
          toast.error("Failed to resend verification email.");
        }
      },
      onError: (err) => {
        toast.error(err.message ?? "Failed to resend verification email.");
      },
    });

  function resendVerification() {
    // Prefer server to infer the target from the session, but keep email fallback if API expects it
    resendEmailVerificationMutation.mutate(user.email);
  }

  function onSubmit(values: ManageAccountValues) {
    // Build a minimal payload with only dirty fields
    const keys = Object.keys(dirtyFields) as (keyof ManageAccountValues)[];

    if (keys.length === 0) {
      toast.info("No changes to save");
      return;
    }

    const payload: Partial<ManageAccountValues> = {};
    for (const k of keys) payload[k] = values[k];

    updateUserMutation.mutate(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
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
              <div className="flex items-center justify-between">
                <FormLabel>Email</FormLabel>
                {user.emailVerified ? (
                  <Badge className="text-xs px-2 py-0.5">Verified</Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      Not Verified
                    </Badge>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-xs px-2"
                      disabled={resendEmailVerificationMutation.isPending}
                      onClick={resendVerification}
                    >
                      {resendEmailVerificationMutation.isPending
                        ? "Sending..."
                        : "Resend"}
                    </Button>
                  </div>
                )}
              </div>

              <FormControl>
                <Input placeholder="you@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!isDirty || isSubmitting || updateUserMutation.isPending}
        >
          {updateUserMutation.isPending || isSubmitting
            ? "Saving..."
            : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
