import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "../lib/i18n/I18nContext";
import { AuthProvider } from "../lib/firebase";
import { OrganizationJsonLd, SoftwareApplicationJsonLd, WebsiteJsonLd } from "../components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://smartpdffiller.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Smart PDF Filler - Fill PDF Forms Smarter & Faster",
    template: "%s | Smart PDF Filler",
  },
  description: "Create fillable PDF forms with our intuitive drag-and-drop editor. Upload any PDF, add form fields, signatures, and share with your team. Cloud storage included.",
  keywords: [
    "PDF filler",
    "fillable PDF",
    "PDF form creator",
    "online PDF editor",
    "PDF signature",
    "form builder",
    "document management",
    "PDF templates",
    "digital forms",
    "cloud PDF storage",
  ],
  authors: [{ name: "Smart PDF Filler" }],
  creator: "Smart PDF Filler",
  publisher: "Smart PDF Filler",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Smart PDF Filler",
    title: "Smart PDF Filler - Fill PDF Forms Smarter & Faster",
    description: "Create fillable PDF forms with our intuitive drag-and-drop editor. Upload any PDF, add form fields, signatures, and share with your team.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Smart PDF Filler - Fill PDF Forms Smarter & Faster",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart PDF Filler - Fill PDF Forms Smarter & Faster",
    description: "Create fillable PDF forms with our intuitive drag-and-drop editor. Upload any PDF, add form fields, signatures, and share with your team.",
    images: ["/og-image.svg"],
    creator: "@smartpdffiller",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-icon",
  },
  category: "productivity",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
        <SoftwareApplicationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
