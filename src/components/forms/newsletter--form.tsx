"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { z as zod } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { userSchema } from "@/types/auth-type";
import { trpc } from "@/lib/trpc/client";

const newsletterSchema = zod.object({
  email: userSchema.shape.email,
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function NewsletterForm() {
  const { register, handleSubmit, formState, reset } =
    useForm<NewsletterFormValues>({
      resolver: zodResolver(newsletterSchema),
      defaultValues: { email: "" },
      mode: "onSubmit",
    });

  const { errors, isSubmitting } = formState;

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Welcome aboard! 🎉", {
        description: "You've successfully subscribed to our newsletter.",
      });
      reset();
    },
    onError: (error) => {
      if (error.data?.code === "CONFLICT") {
        toast.error("Already subscribed", {
          description: "This email is already on our list.",
        });
      } else {
        toast.error("Something went wrong", {
          description: error.message || "Please try again later.",
        });
      }
    },
  });

  const onSubmit = (values: NewsletterFormValues) => {
    subscribeMutation.mutate(values);
  };

  const emailError = errors.email?.message;

  return (
    <Card className="mx-auto w-full">
      <CardContent className="p-8 sm:p-10 flex flex-col gap-6 text-center sm:text-left">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">
            Stay ahead of the curve
          </h3>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto sm:mx-0">
            Join thousands of makers getting early access to product updates,
            design tips, and insights from the team. No spam, ever.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center sm:justify-start"
          aria-label="Subscribe to newsletter"
        >
          <Field
            className="flex-1 min-w-0 max-w-sm"
            data-invalid={!!emailError}
          >
            <FieldLabel htmlFor="newsletter-email" className="sr-only">
              Email address
            </FieldLabel>

            <Input
              id="newsletter-email"
              type="email"
              placeholder="you@awesome.com"
              aria-invalid={!!emailError}
              disabled={isSubmitting}
              {...register("email")}
            />

            {emailError && <FieldError>{emailError}</FieldError>}
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="whitespace-nowrap w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join the list"
            )}
          </Button>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-2">
            <span>We never share your data with anyone.</span>
            <span className="hidden sm:inline text-neutral-400">•</span>
            <Link
              href="/privacy"
              className="underline hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          <div className="text-neutral-500 italic">
            You can unsubscribe at any time.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
