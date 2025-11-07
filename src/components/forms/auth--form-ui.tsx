import React, { PropsWithChildren } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

export function AuthCard({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">{children}</Card>
    </div>
  );
}

export function AuthHeader({ title }: { title: string }) {
  return (
    <CardHeader>
      <CardTitle className="text-center">{title}</CardTitle>
    </CardHeader>
  );
}

export function AuthContent({ children }: PropsWithChildren) {
  return <CardContent>{children}</CardContent>;
}

export function AuthFooter({ children }: { children?: React.ReactNode }) {
  return <CardFooter>{children}</CardFooter>;
}

export function AuthSeparator() {
  return (
    <div className="pt-2">
      <Separator />
    </div>
  );
}

export function SocialButtons({
  onSocial,
}: {
  onSocial?: (provider: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        className="w-full"
        onClick={() => onSocial?.("github")}
      >
        <span className="flex items-center justify-center gap-2 w-full">
          <Github className="h-4 w-4" />
          Continue with GitHub
        </span>
      </Button>

      <Button
        type="button"
        className="w-full"
        onClick={() => onSocial?.("twitter")}
      >
        <span className="flex items-center justify-center gap-2 w-full">
          <Twitter className="h-4 w-4" />
          Continue with Twitter
        </span>
      </Button>
    </div>
  );
}

export function CheckEmailIllustration() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-full bg-muted p-3">
        <Mail className="h-6 w-6" />
      </div>
    </div>
  );
}

export function AuthFooterLinks() {
  return (
    <div className="w-full text-center text-xs text-muted-foreground">
      <span>Alternate pages: </span>
      <Link href="/login" className="mx-1 underline">
        Login
      </Link>
      <span>|</span>
      <Link href="/register" className="mx-1 underline">
        Register
      </Link>
      <span>|</span>
      <Link href="/forgot-password" className="mx-1 underline">
        Forgot
      </Link>
    </div>
  );
}

// small helper for rendering simple footer with optional children
export function DefaultAuthFooter() {
  return (
    <AuthFooter>
      <AuthFooterLinks />
    </AuthFooter>
  );
}

export default null;
