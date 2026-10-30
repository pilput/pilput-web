import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Compass,
  Ghost,
  House,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const popularLinks = [
  { href: "/blog", label: "Blog", hint: "Fresh stories" },
  { href: "/guilds", label: "Guilds", hint: "Find your people" },
  { href: "/tags", label: "Tags", hint: "Browse topics" },
];

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Backdrop — same language as the landing hero */}
      <div className="absolute inset-0 bg-linear-to-b from-muted/40 via-background/60 to-background dark:from-muted/10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] bg-size-[32px_32px] opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-20">
        {/* Playful illustration */}
        <div className="relative mx-auto w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-500 lg:max-w-none">
          <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card p-8 sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                <MapPin className="size-3.5" aria-hidden />
                lost &amp; found
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                error 404
              </span>
            </div>

            {/* Big friendly 404 — the middle zero has a cute face */}
            <div className="relative mt-8 flex items-end justify-center gap-2 sm:gap-3">
              <span className="text-7xl font-black tracking-tighter text-foreground sm:text-8xl">
                4
              </span>
              <span className="landing-float relative flex size-20 items-center justify-center rounded-full border-2 border-primary/25 bg-primary/10 sm:size-24">
                <span className="absolute inset-2 rounded-full bg-background/60" />
                <span className="relative flex flex-col items-center gap-1.5">
                  <span className="flex gap-2.5">
                    <span className="size-2 rounded-full bg-foreground" />
                    <span className="size-2 rounded-full bg-foreground" />
                  </span>
                  <span className="h-3 w-6 rounded-b-full border-b-4 border-foreground" />
                </span>
                <span className="absolute -top-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Compass className="size-4" aria-hidden />
                </span>
              </span>
              <span className="text-7xl font-black tracking-tighter text-foreground sm:text-8xl">
                4
              </span>
            </div>
            <p className="mt-3 text-center text-sm font-bold tracking-[0.3em] text-muted-foreground uppercase">
              page not found
            </p>

            {/* Ground shadow */}
            <div className="mx-auto mt-5 h-3 w-48 rounded-full bg-foreground/10 blur-md" />

            {/* Floating stickers */}
            <div className="landing-float absolute top-24 -left-1 flex items-center gap-2 rounded-2xl border border-border/60 bg-background px-3 py-2 shadow-lg sm:left-4">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-4" aria-hidden />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-xs font-bold">Wrong turn!</span>
                <span className="block text-[11px] text-muted-foreground">
                  Nothing down this road
                </span>
              </span>
            </div>
            <div
              className="landing-float absolute -right-1 bottom-16 flex items-center gap-2 rounded-2xl border border-border/60 bg-background px-3 py-2 shadow-lg sm:right-4"
              style={{ animationDelay: "-1.1s" }}
            >
              <span className="flex size-8 items-center justify-center rounded-xl bg-muted text-foreground">
                <Ghost className="size-4" aria-hidden />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-xs font-bold">Boo! Empty here</span>
                <span className="block text-[11px] text-muted-foreground">
                  Just dust bunnies
                </span>
              </span>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Psst — this page packed its bags and left. Rude, we know.
          </p>
        </div>

        {/* Copy + actions */}
        <div className="text-center lg:text-left">
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-bold text-primary">
              <Compass className="size-3.5" aria-hidden />
              You wandered off the map
            </span>
          </div>

          <h1 className="mt-5 animate-in fade-in-0 slide-in-from-bottom-2 text-4xl font-extrabold tracking-tight text-balance duration-500 sm:text-5xl [&:not(:first-child)]:delay-75">
            Oops! This page went on an adventure
          </h1>
          <p className="mx-auto mt-4 max-w-md animate-in fade-in-0 slide-in-from-bottom-2 text-base leading-relaxed text-pretty text-muted-foreground duration-500 delay-100 sm:text-lg lg:mx-0">
            The link might be broken, the post was deleted, or it never existed.
            Let&apos;s get you back to great stories.
          </p>

          <div className="mt-7 flex animate-in fade-in-0 slide-in-from-bottom-2 flex-col gap-3 duration-500 delay-150 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              size="lg"
              className="h-12 rounded-xl px-6 text-sm font-semibold"
              render={<Link href="/" />}
              nativeButton={false}
            >
              <House className="size-4" aria-hidden />
              Back to home
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl border-border/80 bg-background px-6 text-sm font-semibold hover:border-primary/30"
              render={<Link href="/blog" />}
              nativeButton={false}
            >
              <BookOpenText className="size-4" aria-hidden />
              Explore articles
            </Button>
          </div>

          <div className="mt-8 animate-in fade-in-0 slide-in-from-bottom-2 rounded-2xl border border-border/50 bg-card p-4 text-left duration-500 delay-200 sm:p-5">
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Popular destinations
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {popularLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-xl border border-border/50 bg-background/70 px-3 py-2.5 transition-all hover:border-primary/30 hover:bg-primary/5"
                >
                  <span className="block text-sm font-bold group-hover:text-primary">
                    {item.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {item.hint}
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Tip: double-check the URL for typos, or use search on the blog
              page to find what you were looking for.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
