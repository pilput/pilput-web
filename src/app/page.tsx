import Navigation from "@/components/header/Navbar";
import Landing from "@/components/landing/landing";
import Button from "@/components/buttons/buttonprimary";

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
