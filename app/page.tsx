'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FileText, Shield, Users, ArrowRight, PenTool, CheckCircle2, Zap, Cloud, Lock } from 'lucide-react';
import { useAuth } from '../lib/firebase';

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <PenTool size={20} />
            </div>
            <span className="font-bold text-xl text-slate-800">Drajonz</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">How it Works</a>
          </nav>
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="text-slate-400 text-sm">Loading...</div>
            ) : user ? (
              <Link
                href="/templates"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
              >
                Go to Templates
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-slate-800 px-4 py-2 font-medium transition-colors hidden sm:block"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background gradient matching og-image */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900 rounded-full opacity-30 blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400 rounded-full opacity-20 blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }} />
        </div>

        <div className="relative px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap size={16} className="text-yellow-400" />
                Streamline your PDF workflow
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Fill PDF Forms<br />
                <span className="text-blue-200">Smarter & Faster</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0">
                Upload any PDF, create fillable fields with our intuitive editor, and share with your team. Save hours with reusable templates.
              </p>
              
              {/* Feature checklist */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-blue-100">
                  <CheckCircle2 size={20} className="text-green-400" />
                  <span>Drag & Drop Editor</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <CheckCircle2 size={20} className="text-green-400" />
                  <span>Cloud Storage</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <CheckCircle2 size={20} className="text-green-400" />
                  <span>Team Collaboration</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href={user ? "/templates" : "/login"}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl"
                >
                  {user ? "Go to Templates" : "Start for Free"}
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Right content - Hero image */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <Image
                  src="/og-image.svg"
                  alt="Drajonz PDF Form Editor"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by section */}
      {/* <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          <p className="text-center text-slate-500 text-sm font-medium mb-6">TRUSTED BY PROFESSIONALS WORLDWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            <div className="text-2xl font-bold text-slate-400">Company</div>
            <div className="text-2xl font-bold text-slate-400">Enterprise</div>
            <div className="text-2xl font-bold text-slate-400">Startup</div>
            <div className="text-2xl font-bold text-slate-400">Agency</div>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section id="features" className="px-4 md:px-8 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">Features</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              Everything you need to<br />manage PDF forms
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful tools designed to streamline your document workflow and boost productivity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Intuitive Form Editor</h3>
              <p className="text-slate-600 leading-relaxed">
                Upload any PDF and add fillable fields with our powerful drag-and-drop editor. No technical skills required.
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-green-200 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cloud size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Cloud Storage</h3>
              <p className="text-slate-600 leading-relaxed">
                Your forms are securely stored in the cloud and accessible from anywhere, on any device.
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Team Collaboration</h3>
              <p className="text-slate-600 leading-relaxed">
                Share forms with your team or make them public for anyone to fill. Real-time sync keeps everyone updated.
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PenTool size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Digital Signatures</h3>
              <p className="text-slate-600 leading-relaxed">
                Add signature fields and collect legally binding digital signatures directly on your forms.
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Reusable Templates</h3>
              <p className="text-slate-600 leading-relaxed">
                Save time by creating templates from your forms. Use them again and again with just one click.
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Enterprise Security</h3>
              <p className="text-slate-600 leading-relaxed">
                Bank-level encryption and secure authentication keep your sensitive documents protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="px-4 md:px-8 py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">How it Works</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              Get started in minutes
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to transform your PDF workflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/20">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Upload Your PDF</h3>
              <p className="text-slate-600">
                Simply drag and drop your PDF file or browse to upload. We support all standard PDF formats.
              </p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-300 to-transparent" />
            </div>
            
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/20">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Add Form Fields</h3>
              <p className="text-slate-600">
                Use our intuitive editor to add text fields, checkboxes, signatures, and more to your PDF.
              </p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-300 to-transparent" />
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/20">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Share & Collect</h3>
              <p className="text-slate-600">
                Share your form via link or embed it on your website. Collect responses automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500 rounded-3xl p-10 md:p-16">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-900 rounded-full opacity-30 blur-2xl -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to streamline your<br />PDF workflow?
              </h2>
              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Join thousands of professionals who save hours every week with Drajonz. Start creating fillable PDF forms in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={user ? "/templates" : "/login"}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl"
                >
                  {user ? "Go to Templates" : "Get Started Free"}
                  <ArrowRight size={20} />
                </Link>
              </div>
              <p className="text-blue-200 text-sm mt-6">No credit card required • Free forever for basic use</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="px-4 md:px-8 py-12 md:py-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                  <PenTool size={20} />
                </div>
                <span className="font-bold text-xl text-white">Drajonz</span>
              </div>
              <p className="text-slate-400 max-w-sm mb-6">
                The modern way to create, fill, and manage PDF forms. Built for teams who value efficiency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Drajonz. All rights reserved.
            </p>
            {/* <div className="flex items-center gap-6">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
