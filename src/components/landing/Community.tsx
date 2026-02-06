import RandomPosts from "@/components/post/RandomPosts";

export default function Community() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-grid-slate-100/[0.04] dark:bg-grid-slate-700/[0.06] bg-size-[36px_36px]" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest from Our
            <span className="block bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Community
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest posts, insights, and stories shared by our
            amazing community of creators.
          </p>
        </div>
        <div className="relative">
          <RandomPosts />
        </div>
      </div>
    </section>
  );
}
