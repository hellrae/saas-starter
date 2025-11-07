"use client";

import { useEffect } from "react";
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

const ManageAccountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

type ManageAccountValues = z.infer<typeof ManageAccountSchema>;

export default function AccountProfileForm({ user }: { user: User }) {
  const form = useForm<ManageAccountValues>({
    resolver: zodResolver(ManageAccountSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    mode: "onBlur",
  });

  // Reset when user changes (in case of hot reload or profile refetch)
  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
    });
  }, [user.name, user.email]);

  const updateUserMutation = trpc.user.updateUser.useMutation({
    onSuccess: () => {
      form.reset(form.getValues()); // mark form clean
      toast.success("Profile updated successfully!");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to update profile. Please try again.");
    },
  });

  function onSubmit() {
    const dirtyKeys = Object.keys(
      form.formState.dirtyFields,
    ) as (keyof ManageAccountValues)[];

    if (dirtyKeys.length === 0) {
      toast.success("Profile updated successfully!");
      return;
    }

    const dirtyValues: Partial<ManageAccountValues> = {};
    for (const key of dirtyKeys) {
      dirtyValues[key] = form.getValues(key);
    }

    updateUserMutation.mutate(dirtyValues);
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={updateUserMutation.isPending}>
          {updateUserMutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
