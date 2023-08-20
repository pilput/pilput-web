import Navigation from "@/components/header/Navbar";
import Hero from "@/components/landing/Hero";
import RandomPosts from "@/components/post/RandomPosts";
import Footer from '@/components/footer/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <RandomPosts />
      <Footer />
    </>
  );
}
