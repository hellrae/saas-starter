"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

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

  useEffect(() => {
    form.reset(initialValues, { keepDirty: false, keepTouched: false });
  }, [initialValues, form]);

  const { isDirty, isSubmitting, dirtyFields, errors } = form.formState;

  const updateUserMutation = trpc.user.updateUser.useMutation({
    onSuccess: () => {
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
    resendEmailVerificationMutation.mutate(user.email);
  }

  function onSubmit(values: ManageAccountValues) {
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Name field */}
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Name</FieldLabel>

        <Input
          id="name"
          placeholder="Your full name"
          aria-invalid={!!errors.name}
          {...form.register("name")}
        />

        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </Field>

      {/* Email field */}
      <Field data-invalid={!!errors.email}>
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="email">Email</FieldLabel>

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

        <Input
          id="email"
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          {...form.register("email")}
        />

        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </Field>

      <Button
        type="submit"
        disabled={!isDirty || isSubmitting || updateUserMutation.isPending}
      >
        {updateUserMutation.isPending || isSubmitting
          ? "Saving..."
          : "Save changes"}
      </Button>
    </form>
  );
}
