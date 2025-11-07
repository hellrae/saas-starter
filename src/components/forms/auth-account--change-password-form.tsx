"use client";

import { useState } from "react";
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
      currentPassword: "", // old password
      password: "", // new password
      confirmPassword: "",
    },
  });

  const changePasswordMutation = trpc.user.changePassword.useMutation({
    onSuccess: () => {
      toast.success("🔑 Password changed successfully!");
      form.reset();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Current password"
                    type={showOld ? "text" : "password"}
                    {...field}
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
              <FormLabel>New password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="New password (min 8 characters)"
                    type={showNew ? "text" : "password"}
                    {...field}
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
              <FormLabel>New password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Confirm password"
                    type={showConfirm ? "text" : "password"}
                    {...field}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Change Password</Button>
      </form>
    </Form>
  );
}
