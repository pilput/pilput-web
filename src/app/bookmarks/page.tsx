import Navigation from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import BookmarksClient from "./BookmarksClient";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata = publicPageMetadata({
  title: "Reading list",
  description: "Posts you saved to read later on pilput.",
  canonicalPath: "/bookmarks",
  keywords: ["bookmarks", "reading list", "saved posts", "pilput"],
  openGraphTitle: "Reading list | pilput",
});

export default function BookmarksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 w-full flex flex-col">
        <BookmarksClient />
      </main>
      <Footer />
    </div>
  );
}
