'use client';

import Link from 'next/link';
import { FileText, Shield, Zap, Users, ArrowRight, LogIn, PenTool } from 'lucide-react';
import { useAuth } from '../lib/firebase';

export default function LandingPage() {
  const { user, loading, isConfigured } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="px-4 md:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <PenTool size={20} />
          </div>
          <span className="font-bold text-xl text-slate-800">Smart PDF Filler</span>
        </div>
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="text-slate-400 text-sm">Loading...</div>
          ) : user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-800 px-4 py-2 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 md:px-8 py-16 md:py-24 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
          Fill PDF Forms <br className="hidden md:block" />
          <span className="text-blue-600">Smarter & Faster</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Upload any PDF, create fillable fields, and share with your team. 
          Save time with reusable templates and cloud sync.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={user ? "/dashboard" : "/login"}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/30"
          >
            {user ? "Go to Dashboard" : "Start for Free"}
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/templates"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all border border-slate-200"
          >
            Browse Templates
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-8 py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-12">
            Everything you need to manage PDF forms
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Easy Form Creation</h3>
              <p className="text-slate-600">
                Upload any PDF and add fillable fields with our intuitive drag-and-drop editor.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Secure Cloud Storage</h3>
              <p className="text-slate-600">
                Your forms are securely stored in the cloud and accessible from anywhere.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Share & Collaborate</h3>
              <p className="text-slate-600">
                Share forms with your team or make them public for anyone to fill.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center bg-blue-600 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Create your first fillable PDF form in minutes.
          </p>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
          >
            {user ? "Go to Dashboard" : "Sign Up Free"}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-8 py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <PenTool size={16} />
            </div>
            <span className="font-semibold text-slate-800">Smart PDF Filler</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Smart PDF Filler. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
