import Link from 'next/link';
import { PenTool, ArrowLeft, Target, Heart, Zap } from 'lucide-react';

export const metadata = {
  title: 'About - Drajonz',
  description: 'Learn about Drajonz and our mission to simplify PDF form management.',
};

export default function AboutPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Drajonz</h1>
          <p className="text-xl text-blue-100">
            We&apos;re on a mission to make PDF form management simple, efficient, and accessible for everyone.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Story</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Drajonz was born from a simple frustration: dealing with PDF forms shouldn&apos;t be complicated. 
              Whether you&apos;re a small business owner, a freelancer, or part of a large organization, 
              we believe everyone deserves tools that make document workflows effortless.
            </p>

            <div className="grid md:grid-cols-3 gap-8 my-12">
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target size={28} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Our Mission</h3>
                <p className="text-slate-600">To simplify document workflows and save people time.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart size={28} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Our Values</h3>
                <p className="text-slate-600">Simplicity, reliability, and putting users first.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap size={28} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Our Promise</h3>
                <p className="text-slate-600">Fast, secure, and always improving.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-6">What We Offer</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Drajonz provides a comprehensive suite of tools for PDF form management:
            </p>
            <ul className="text-slate-600 space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Intuitive drag-and-drop form editor</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Secure cloud storage for all your documents</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Digital signature support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>Reusable templates to save time</span>
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mb-6">Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              Have questions or feedback? We&apos;d love to hear from you. Reach out to us and we&apos;ll get back to you as soon as possible.
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
