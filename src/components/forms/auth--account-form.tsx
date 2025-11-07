"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardFooter } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Eye, EyeOff } from "lucide-react";
import {
  AuthCard,
  AuthContent,
  AuthHeader,
  AuthSeparator,
} from "@/components/forms/auth--form-ui";

import { toast } from "sonner";

const ManageAccountSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If user wants to change password, newPassword must be >= 8
    if (data.newPassword && data.newPassword.length > 0) {
      if (data.newPassword.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 8,
          type: "string",
          inclusive: true,
          message: "New password must be at least 8 characters",
          path: ["newPassword"],
          origin: "string",
        });
      }

      // oldPassword required to change password
      if (!data.oldPassword || data.oldPassword.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Current password is required to change your password",
          path: ["oldPassword"],
          origin: "string",
        });
      }
    }
  });

type ManageAccountValues = z.infer<typeof ManageAccountSchema>;

/**
 * Typesafe payload type:
 * name + email are required; oldPassword/newPassword are optional,
 * but we keep them optional in the payload typing because the zod
 * schema already enforces rules about when they must be present.
 */
type UpdateAccountPayload = {
  name: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
};

export default function ManageAccountForm() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const form = useForm<ManageAccountValues>({
    resolver: zodResolver(ManageAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      oldPassword: "",
      newPassword: "",
    },
  });

  async function onSubmit(values: ManageAccountValues) {
    try {
      // fake network delay for demo — remove in prod
      await new Promise((res) => setTimeout(res, 600));

      const payload: UpdateAccountPayload = {
        name: values.name,
        email: values.email,
      };

      if (values.newPassword && values.newPassword.length > 0) {
        // typesafe assignment — oldPassword may be undefined but schema ensures it's present here
        payload.oldPassword = values.oldPassword;
        payload.newPassword = values.newPassword;
      }

      // TODO: call your API endpoint here (example)
      // const resp = await fetch("/api/account", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!resp.ok) throw new Error("Failed to update account");

      toast.success("Your account details were updated.");
      form.reset({ ...values, oldPassword: "", newPassword: "" });
    } catch (err) {
      // you can inspect err to show more detailed error messages
      toast.error("Something went wrong while saving. Try again.");
    }
  }

  return (
    <AuthCard>
      <AuthHeader title="Manage your account" />
      <AuthContent>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AuthSeparator />

            <div>
              <h3 className="text-sm font-medium">Change password</h3>
              <p className="text-sm text-muted-foreground">
                Leave empty to keep your current password.
              </p>

              <div className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="oldPassword"
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
                  name="newPassword"
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
              </div>
            </div>

            <CardFooter className="pt-0">
              <div className="flex items-center justify-end w-full">
                <Button type="submit">Save changes</Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </AuthContent>
    </AuthCard>
  );
}
