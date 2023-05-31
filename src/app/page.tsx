'use client';
import Navigation from "@/components/header/Navigation";
import Landing from '@/components/landing/landing';
import Footer from '@/components/footer/Footer'

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

export default function Home() {
  return (
      <div className="isolate bg-white dark:bg-gray-700">
        <Navigation />
        <Landing />
      </div>
  );
}
