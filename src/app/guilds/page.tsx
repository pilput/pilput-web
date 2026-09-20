import Navigation from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { publicPageMetadata } from "@/lib/public-metadata";
import GuildsClient from "./GuildsClient";

export const metadata = publicPageMetadata({
  title: "Guilds",
  description:
    "Discover communities on pilput — join a guild to follow the people and topics you care about.",
  canonicalPath: "/guilds",
  keywords: ["guilds", "communities", "groups", "pilput"],
  openGraphTitle: "Guilds | pilput",
});

export default function GuildsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 w-full flex flex-col">
        <GuildsClient />
      </main>
      <Footer />
    </div>
  );
}
