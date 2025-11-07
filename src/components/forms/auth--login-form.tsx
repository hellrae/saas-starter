"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// TODO: replace with your own register schema/validation
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginValues) {
    // TODO: replace with your auth logic
    console.log("login values", values);
  }

  return (
    <AuthCard>
      <AuthHeader title="Sign in to your account" />

      <AuthContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
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
                  <Label>Password</Label>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="underline-offset-4 underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit">Sign in</Button>
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
        </Form>
      </AuthContent>

      <DefaultAuthFooter />
    </AuthCard>
  );
}