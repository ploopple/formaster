import Link from 'next/link';
import { PenTool, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Drajonz',
  description: 'Privacy Policy for Drajonz PDF form management platform.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <PenTool size={20} />
            </div>
            <span className="font-bold text-xl text-slate-800">Drajonz</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 md:px-8 py-16 md:py-24 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-xl text-blue-100">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Introduction</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              At Drajonz, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Information We Collect</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We collect information you provide directly to us:
            </p>
            <ul className="text-slate-600 space-y-2 mb-4 list-disc list-inside">
              <li>Account information (name, email address)</li>
              <li>Profile information</li>
              <li>Documents and forms you upload</li>
              <li>Communications with us</li>
            </ul>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We automatically collect certain information:
            </p>
            <ul className="text-slate-600 space-y-2 mb-8 list-disc list-inside">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. How We Use Your Information</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="text-slate-600 space-y-2 mb-8 list-disc list-inside">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Information Sharing</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We do not sell your personal information. We may share your information in the following situations:
            </p>
            <ul className="text-slate-600 space-y-2 mb-8 list-disc list-inside">
              <li>With your consent</li>
              <li>With service providers who assist in our operations</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>In connection with a business transfer or merger</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Data Security</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. 
              This includes encryption, secure servers, and regular security assessments.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Data Retention</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide 
              you services. We will retain and use your information as necessary to comply with legal 
              obligations, resolve disputes, and enforce our agreements.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Your Rights</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="text-slate-600 space-y-2 mb-8 list-disc list-inside">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Cookies</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our Service and 
              hold certain information. You can instruct your browser to refuse all cookies or to 
              indicate when a cookie is being sent.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Third-Party Services</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Our Service may contain links to third-party websites or services. We are not responsible 
              for the privacy practices of these third parties. We encourage you to read their privacy policies.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Our Service is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">11. Changes to This Policy</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">12. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="px-4 md:px-8 max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Drajonz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
