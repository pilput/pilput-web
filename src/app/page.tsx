import Navigation from "@/components/header/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CallToAction from "@/components/landing/CallToAction";
import RandomPosts from "@/components/post/RandomPosts";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <Features />
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest from Our
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the latest posts, insights, and stories shared by our
              amazing community of creators.
            </p>
          </div>
          <RandomPosts />
        </div>
      </section>
      <CallToAction />
      <Footer />
    </>
  );
}
