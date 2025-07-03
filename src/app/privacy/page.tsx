import Navigation from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
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
                  This platform is not secured by security experts, so it cannot be fully trusted. 
                  However, we try our best to secure user data and protect your privacy.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  post content, or communicate with us. This may include:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Username and email address</li>
                  <li>Profile information you choose to provide</li>
                  <li>Posts, comments, and other content you create</li>
                  <li>Messages and communications</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze trends and usage</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                <p className="mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy. We may share information:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>In connection with a business transfer</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p className="mb-4">
                  We implement reasonable security measures to protect your personal information. 
                  However, please note that no method of transmission over the internet or electronic 
                  storage is 100% secure. While we strive to protect your data, we cannot guarantee 
                  absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                <p className="mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of certain communications</li>
                  <li>Request information about data we collect</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
                <p className="mb-4">
                  We use cookies and similar technologies to enhance your experience, analyze usage, 
                  and provide personalized content. You can control cookie settings through your 
                  browser preferences.
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
                  If you have any questions about this privacy policy or our practices, please contact 
                  us through our support channels.
                </p>
              </section>

              <div className="text-sm text-muted-foreground mt-12 pt-8 border-t">
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export const metadata = {
  title: "Privacy Policy - pilput",
  description: "Privacy policy and data protection information for pilput.dev",
};