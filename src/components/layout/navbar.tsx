import NavbarCTAClient from "./navbar--cta-client";
import type { NavbarProps, NavLink } from "@/types/navbar-types";
import Link from "next/link";
import NavbarLogo from "./navbar--logo";

const Navbar = ({
  logoSrc,
  links,
  ctaLabel = "Get Started",
  ctaHref = "/register",
}: NavbarProps) => {
  const DEFAULT_LINKS: NavLink[] = [
    { id: "home", label: "Home", href: "/" },
    { id: "features", label: "Features", href: "/#features" },
    { id: "pricing", label: "Pricing", href: "/pricing" },
    { id: "docs", label: "Docs", href: "/docs" },
  ];

  const items = links ?? DEFAULT_LINKS;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/60 dark:bg-neutral-900/60 border-b border-neutral-200/50 dark:border-neutral-800/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT: Brand Logo */}
          <NavbarLogo logoSrc={logoSrc} />

          {/* Middle: links (desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {items.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                className="text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right: client actions (CTAs, auth state, mobile menu) */}
          <div className="flex items-center gap-3">
            <NavbarCTAClient
              links={items}
              ctaLabel={ctaLabel}
              ctaHref={ctaHref}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
