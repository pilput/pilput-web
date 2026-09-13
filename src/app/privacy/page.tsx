import Link from "next/link";
import Navigation from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { publicPageMetadata } from "@/lib/public-metadata";

// Bump this whenever the policy text changes.
const LAST_UPDATED = "September 13, 2026";

export const metadata = publicPageMetadata({
  title: "Privacy Policy",
  description:
    "Read pilput’s privacy policy: how we collect, use, and protect your data on our publishing platform.",
  canonicalPath: "/privacy",
  keywords: [
    "privacy policy",
    "pilput",
    "data protection",
    "user privacy",
    "cookies",
  ],
  openGraphTitle: "Privacy Policy | pilput",
});

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Privacy Policy
            </h1>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Important Notice
                </h2>
                <p className="text-yellow-700 dark:text-yellow-300 mb-0">
                  This platform has not been audited by security experts, so it cannot be fully trusted.
                  We do our best to secure your data and protect your privacy, but please avoid storing
                  sensitive information here.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-4">
                  We collect information you provide directly to us when you create an account and use
                  pilput. This may include:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Account details such as your name, username, email address, and password</li>
                  <li>
                    Profile information we receive from GitHub when you sign in with it, such as your
                    GitHub username, email, and avatar
                  </li>
                  <li>Your profile picture and other profile information you choose to provide</li>
                  <li>Posts, comments, tags, likes, bookmarks, and the accounts you follow</li>
                  <li>Messages you send to the AI chat assistant and its responses</li>
                  <li>Investment holdings and related records you enter in the dashboard</li>
                  <li>Basic usage data, such as post view counts</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Create and manage your account and keep you signed in</li>
                  <li>Publish and display the content you create</li>
                  <li>Provide features such as AI chat, bookmarks, and holdings tracking</li>
                  <li>Show you statistics about your posts</li>
                  <li>Send account-related emails, such as password reset links</li>
                  <li>Maintain, secure, and improve the service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Public Information</h2>
                <p className="mb-4">
                  Your username, profile picture, published posts, and comments are public and can be
                  seen by anyone, including people who are not signed in. Please keep this in mind
                  before sharing anything personal in your content.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                <p className="mb-4">
                  We do not sell your personal information. We only share it:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    With GitHub, when you choose to sign in with your GitHub account
                  </li>
                  <li>
                    With OpenRouter and the AI model providers it routes to, when you use the AI chat.
                    Your messages are sent to them to generate responses and are subject to their own
                    privacy policies, so do not share sensitive information in the chat
                  </li>
                  <li>With your consent</li>
                  <li>When required by law or to protect our rights and the safety of our users</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p className="mb-4">
                  We implement reasonable security measures to protect your personal information.
                  However, no method of transmission over the internet or electronic storage is 100%
                  secure. While we strive to protect your data, we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                <p className="mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Access and update your profile information from your{" "}
                    <Link href="/account" className="text-primary hover:underline">
                      account settings
                    </Link>
                  </li>
                  <li>Delete your posts, comments, chat conversations, and holdings</li>
                  <li>
                    Permanently delete your account and associated data from the Danger Zone in your
                    account settings
                  </li>
                  <li>Ask us what information we hold about you</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Cookies and Local Storage</h2>
                <p className="mb-4">
                  We do not use advertising or third-party tracking cookies. We only use:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Authentication cookies that keep you signed in</li>
                  <li>Your browser&apos;s local storage to remember preferences such as light or dark theme</li>
                </ul>
                <p className="mb-4">
                  You can clear these through your browser settings, but doing so will sign you out.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Children&apos;s Privacy</h2>
                <p className="mb-4">
                  Our service is not intended for children under 13 years of age. We do not knowingly
                  collect personal information from children under 13.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
                <p className="mb-4">
                  We may update this privacy policy from time to time. We will notify you of any
                  changes by posting the new policy on this page and updating the &ldquo;Last Updated&rdquo; date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this privacy policy or want to make a request about
                  your data, email us at{" "}
                  <a href="mailto:cecepjanuardi@proton.me" className="text-primary hover:underline">
                    cecepjanuardi@proton.me
                  </a>
                  . See also our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
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
