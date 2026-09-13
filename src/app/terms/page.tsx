import Link from "next/link";
import Navigation from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { publicPageMetadata } from "@/lib/public-metadata";

// Bump this whenever the terms text changes.
const LAST_UPDATED = "September 13, 2026";

export const metadata = publicPageMetadata({
  title: "Terms of Service",
  description:
    "Read pilput’s terms of service: the rules and conditions for using our publishing platform.",
  canonicalPath: "/terms",
  keywords: [
    "terms of service",
    "terms and conditions",
    "pilput",
    "user agreement",
    "acceptable use",
  ],
  openGraphTitle: "Terms of Service | pilput",
});

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Terms of Service
            </h1>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Important Notice
                </h2>
                <p className="text-yellow-700 dark:text-yellow-300 mb-0">
                  This platform is provided &ldquo;as is&rdquo; and is not audited by security experts.
                  Please do not store sensitive information here, and use the service at your own risk.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
                <p className="mb-4">
                  By accessing or using pilput, you agree to be bound by these terms. If you do not
                  agree with any part of these terms, please do not use the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Account</h2>
                <p className="mb-4">
                  When you create an account, you agree to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide accurate and up-to-date information</li>
                  <li>Keep your password secure and not share your account</li>
                  <li>Take responsibility for all activity that occurs under your account</li>
                  <li>Notify us promptly of any unauthorized use of your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Content</h2>
                <p className="mb-4">
                  You retain ownership of the posts, comments, and other content you publish on pilput.
                  By publishing content, you grant us a non-exclusive license to host, display, and
                  distribute it as needed to operate the service.
                </p>
                <p className="mb-4">
                  You are solely responsible for your content and must have the rights to share it.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
                <p className="mb-4">
                  You agree not to use pilput to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Post content that is illegal, hateful, harassing, or sexually explicit</li>
                  <li>Infringe on the intellectual property or privacy of others</li>
                  <li>Spread spam, malware, or misleading information</li>
                  <li>Attempt to gain unauthorized access to the service or other accounts</li>
                  <li>Disrupt or overload the platform or its infrastructure</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Moderation and Termination</h2>
                <p className="mb-4">
                  We may remove content or suspend or terminate accounts that violate these terms, at
                  our discretion and without prior notice. You may stop using the service and delete
                  your account at any time.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Disclaimer and Limitation of Liability</h2>
                <p className="mb-4">
                  The service is provided without warranties of any kind. Content published by users,
                  including any financial or investment-related information, reflects the views of its
                  authors and is not professional advice. To the fullest extent permitted by law, we are
                  not liable for any damages arising from your use of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Privacy</h2>
                <p className="mb-4">
                  Your use of pilput is also governed by our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  , which explains how we collect and use your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Changes to These Terms</h2>
                <p className="mb-4">
                  We may update these terms from time to time. We will notify you of any changes by
                  posting the new terms on this page. Continued use of the service after changes means
                  you accept the updated terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about these terms, email us at{" "}
                  <a href="mailto:cecepjanuardi@proton.me" className="text-primary hover:underline">
                    cecepjanuardi@proton.me
                  </a>
                  .
                </p>
              </section>

              <div className="text-sm text-muted-foreground mt-12 pt-8 border-t">
                <p>Last Updated: {LAST_UPDATED}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
