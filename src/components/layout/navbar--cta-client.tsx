"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import type { NavLink } from "@/types/navbar-types";
import { useSession } from "@/lib/auth/client";
import NavbarLogo from "./navbar--logo";
import { appSeo } from "@/lib/utils/seo";

export default function NavbarCTAClient({
  links,
  ctaLabel = "Get Started",
  ctaHref = "/register",
}: {
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const items = links ?? [];

  const session = useSession();

  return (
    <div className="flex items-center gap-3">
      {/* Desktop actions */}
      <div className="hidden md:flex md:items-center md:gap-3">
        {session.data !== null ? (
          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-200"
            >
              <Avatar>
                {session.data.user.image ? (
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <img
                      src={session.data.user.image}
                      alt={session.data.user.name}
                      sizes="32px"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-medium text-sm">
                    {session.data.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
            </Link>
          </div>
        ) : (
          <>
            <Button asChild variant="secondary">
              <Link
                href="/login"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300"
              >
                Sign in
              </Link>
            </Button>

            <Button asChild>
              <Link href="/register">{ctaLabel}</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile: sheet trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="secondary"
            size="icon"
            className="inline-flex items-center justify-center rounded-md md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        {/* Sheet content for mobile */}
        <SheetContent
          side="left"
          className="rounded-t-lg border-t dark:border-neutral-800/60"
        >
          <SheetHeader>
            <SheetTitle className="sr-only">{appSeo.name}'s Sidebar</SheetTitle>
            <NavbarLogo />
          </SheetHeader>

          <div className="flex flex-col gap-3 px-4 py-2">
            {items.map((l) => (
              <SheetClose asChild key={l.id}>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                >
                  <Link
                    href={l.href}
                    className="block px-2 py-3 rounded text-base font-medium text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    target={l.external ? "_blank" : undefined}
                  >
                    {l.label}
                  </Link>
                </Button>
              </SheetClose>
            ))}

            <div>
              {session.data !== null ? (
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link href="/account">Account</Link>
                  </Button>
                </SheetClose>
              ) : (
                <>
                  <SheetClose asChild>
                    <Button asChild variant="secondary" className="w-full">
                      <Link
                        href="/login"
                        className="block px-2 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300"
                      >
                        Sign in
                      </Link>
                    </Button>
                  </SheetClose>

                  <div className="mt-2">
                    <SheetClose asChild>
                      <Button asChild className="w-full">
                        <Link href={ctaHref}>{ctaLabel}</Link>
                      </Button>
                    </SheetClose>
                  </div>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
