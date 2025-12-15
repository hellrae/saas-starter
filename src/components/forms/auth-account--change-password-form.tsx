"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { changePasswordFormSchema } from "@/types/auth-type";

type ChangePasswordValues = z.infer<typeof changePasswordFormSchema>;

export default function AccountChangePassword() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const changePasswordMutation = trpc.user.changePassword.useMutation({
    onSuccess: () => {
      toast.success("🔑 Password changed successfully!");
      reset();
    },
    onError: (err) => {
      console.error(err);
      toast.error("❌ Failed to change password. Please try again.");
    },
  });

  function onSubmit(values: ChangePasswordValues) {
    changePasswordMutation.mutate(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      {/* Current password */}
      <Field data-invalid={!!errors.currentPassword}>
        <FieldLabel htmlFor="currentPassword">Current password</FieldLabel>

        <div className="relative">
          <Input
            id="currentPassword"
            placeholder="Current password"
            type={showOld ? "text" : "password"}
            aria-invalid={!!errors.currentPassword}
            {...register("currentPassword")}
          />
          <button
            type="button"
            onClick={() => setShowOld((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            aria-label="Toggle password visibility"
          >
            {showOld ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {errors.currentPassword && (
          <FieldError>{errors.currentPassword.message}</FieldError>
        )}
      </Field>

      {/* New password */}
      <Field data-invalid={!!errors.password}>
        <FieldLabel htmlFor="password">New password</FieldLabel>

        <div className="relative">
          <Input
            id="password"
            placeholder="New password (min 8 characters)"
            type={showNew ? "text" : "password"}
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowNew((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            aria-label="Toggle password visibility"
          >
            {showNew ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </Field>

      {/* Confirm password */}
      <Field data-invalid={!!errors.confirmPassword}>
        <FieldLabel htmlFor="confirmPassword">New password</FieldLabel>

        <div className="relative">
          <Input
            id="confirmPassword"
            placeholder="Confirm password"
            type={showConfirm ? "text" : "password"}
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
            aria-label="Toggle password visibility"
          >
            {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {errors.confirmPassword && (
          <FieldError>{errors.confirmPassword.message}</FieldError>
        )}
      </Field>

      <Button type="submit">Change Password</Button>
    </form>
  );
}
