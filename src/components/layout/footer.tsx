"use client";

import Link from "next/link";
import { appSeo } from "@/lib/utils/seo";
import type { NavLink } from "@/types/navbar-types";
import { Separator } from "@/components/ui/separator";
import NavbarLogo from "./navbar--logo";
import { Github, Linkedin, Twitter } from "../logo";

const Column = ({ title, links }: { title: string; links: NavLink[] }) => (
  <div>
    <h4 className="mb-3 text-sm font-semibold">{title}</h4>
    <nav className="flex flex-col gap-2 text-sm">
      {links.map((l) => (
        <Link
          key={l.id}
          href={l.href}
          target={l.external ? "_blank" : undefined}
          className="hover:underline"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  </div>
);

const SocialIcon = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => (
  <Link href={href} target="_blank" aria-label={label}>
    {children}
  </Link>
);

const Socials = () => (
  <div className="flex items-center gap-4">
    <SocialIcon href="https://twitter.com" label="Twitter">
      <Twitter />
    </SocialIcon>

    <SocialIcon href="https://github.com" label="GitHub">
      <Github />
    </SocialIcon>

    <SocialIcon href="https://linkedin.com" label="LinkedIn">
      <Linkedin />
    </SocialIcon>
  </div>
);

export default function Footer({
  links,
  resources,
  legalLinks,
}: {
  links?: NavLink[];
  resources?: NavLink[];
  legalLinks?: NavLink[];
}) {
  const product: NavLink[] = links ?? [
    { id: "home", label: "Home", href: "/" },
    { id: "features", label: "Features", href: "/#features" },
    { id: "pricing", label: "Pricing", href: "/pricing" },
  ];

  const resourceLinks: NavLink[] = resources ?? [
    { id: "docs", label: "Docs", href: "/docs" },
    { id: "guides", label: "Guides", href: "/guides" },
    { id: "blog", label: "Blog", href: "/blog" },
  ];

  const legal: NavLink[] = legalLinks ?? [
    { id: "privacy", label: "Privacy", href: "/privacy" },
    { id: "terms", label: "Terms", href: "/terms" },
  ];

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <NavbarLogo />
            <p className="text-sm text-muted-foreground max-w-xs">
              A modern starter kit with clear patterns — built for makers who
              care about code quality and design.
            </p>
          </div>

          {/* Product */}
          <Column title="Product" links={product} />

          {/* Resources */}
          <Column title="Resources" links={resourceLinks} />

          {/* Socials */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Follow</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Updates, releases, and news.
            </p>
            <Socials />
          </div>
        </div>

        <div className="mt-8">
          <Separator />
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex gap-4">
            {legal.map((l) => (
              <Link key={l.id} href={l.href} className="hover:underline">
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            © {new Date().getFullYear()} {appSeo.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
