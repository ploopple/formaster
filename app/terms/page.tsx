import Link from 'next/link';
import { PenTool, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - Drajonz',
  description: 'Terms of Service for using Drajonz PDF form management platform.',
};

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="text-xl text-blue-100">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              By accessing and using Drajonz (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Description of Service</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Drajonz provides a platform for creating, editing, and managing fillable PDF forms. 
              The Service includes cloud storage and form sharing features.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. User Accounts</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="text-slate-600 space-y-2 mb-8 list-disc list-inside">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Acceptable Use</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              You agree not to use the Service to:
            </p>
            <ul className="text-slate-600 space-y-2 mb-8 list-disc list-inside">
              <li>Upload or share illegal, harmful, or offensive content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Intellectual Property</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              The Service and its original content, features, and functionality are owned by Drajonz 
              and are protected by international copyright, trademark, and other intellectual property laws. 
              You retain ownership of any content you upload to the Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Privacy</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Your use of the Service is also governed by our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. 
              Please review our Privacy Policy to understand our practices.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Termination</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, 
              without prior notice, for conduct that we believe violates these Terms or is harmful 
              to other users, us, or third parties, or for any other reason.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, 
              either express or implied. We do not warrant that the Service will be uninterrupted, 
              secure, or error-free.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Limitation of Liability</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              To the maximum extent permitted by law, Drajonz shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the Service.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. Changes to Terms</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any 
              material changes by posting the new Terms on this page. Your continued use of the 
              Service after changes constitutes acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">11. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions about these Terms, please contact us.
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
