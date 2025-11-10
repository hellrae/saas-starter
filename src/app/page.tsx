import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appSeo } from "@/lib/utils/seo";
import { Star } from "lucide-react";
import { Github } from "@/components/logo";
import { Card, CardContent } from "@/components/ui/card";
import NewsletterForm from "@/components/forms/newsletter--form";

const Feature = ({ title, desc }: { title: string; desc: string }) => (
  <Card className="h-full">
    <CardContent>
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </CardContent>
  </Card>
);

export default function Page() {
  return (
    <main className="flex-col flex space-y-36 py-30">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Build thoughtful SaaS faster
          </h1>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            A minimal starter kit with auth, database patterns, and a tidy UI —
            everything you need to ship a focused product without the noise.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <Link
                href="https://github.com/hellrae/saas-starter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github />
                View GitHub
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="inline-flex items-center gap-2"
            >
              <Link
                href="https://github.com/hellrae/saas-starter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star className="h-4 w-4" />
                Star Repo
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-neutral-500">
            {appSeo.name} · Small, composable pieces. Clear defaults.
          </p>
          <p className="text-xs mt-2 inline-flex items-center">
            Created By
            <Link
              href="https://x.com/hellrae"
              className="flex items-center group relative"
            >
              <img
                src="https://pbs.twimg.com/profile_images/1984270755702697984/LhFcHB9-_400x400.jpg"
                alt="rae's profile picutre"
                className="inline rounded-sm w-4 h-4 mr-1.5 ml-1.5 "
              />
              <span className="underline">Rae</span>
            </Link>
          </p>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="text-lg font-semibold">What’s included</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Small, practical defaults so you can focus on your product.
          </p>
        </div>

        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-3">
          <Feature
            title="Auth & sessions"
            desc="Email sign-in, password reset, and basic session handling so you can protect routes with confidence."
          />
          <Feature
            title="Type-safe DB"
            desc="Drizzle + typed schemas and migration patterns that keep your database maintainable."
          />
          <Feature
            title="UI & forms"
            desc="shadcn primitives, react-hook-form patterns, and accessible components you can reuse."
          />
        </div>
      </div>

      {/* TECH STACK GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-xl font-semibold">Open Source, MIT Licensed</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Clone it, customize it, and ship your next SaaS faster.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline">
            <Link
              href="https://github.com/hellrae/saas-starter"
              target="_blank"
            >
              View on GitHub
            </Link>
          </Button>
        </div>
      </div>

      {/* NEWSLETTER FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <NewsletterForm />
      </section>

      {/* OPEN SOURCE CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-xl font-semibold">Open Source, MIT Licensed</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Clone it, customize it, and ship your next SaaS faster.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline">
            <Link
              href="https://github.com/hellrae/saas-starter"
              target="_blank"
            >
              View on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
