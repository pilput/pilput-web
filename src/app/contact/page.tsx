import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata = publicPageMetadata({
  title: "Contact",
  description:
    "Contact pilput for support, feedback, or collaboration inquiries.",
  canonicalPath: "/contact",
  keywords: [
    "contact pilput",
    "support",
    "feedback",
    "collaboration",
    "publishing platform",
  ],
  openGraphTitle: "Contact pilput",
});

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-4 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-foreground text-center mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-8">
            Have a question, comment, or feedback? We&apos;d love to hear from
            you.
          </p>

          <div className="bg-card border border-border/60 rounded-xl shadow-premium p-8 glass-card">
            <form className="space-y-6">
              <div>
                <Label
                  htmlFor="name"
                  className="text-foreground font-medium"
                >
                  Your Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-foreground font-medium"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="text-foreground font-medium"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="mt-1"
                  placeholder="Your message..."
                />
              </div>

              <div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
