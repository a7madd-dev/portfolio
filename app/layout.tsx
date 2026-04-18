import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSeo } from "@/lib/seoStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Metadata is generated from content/seo.json, editable via the /control panel.
// Next.js picks this up at render time, and /api/seo revalidates the layout
// after each save so the next page view reflects the change.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();
  const siteUrl = seo.siteUrl?.trim() || undefined;
  const ogImage = seo.ogImage?.trim() || undefined;

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: seo.titleTemplate
      ? { default: seo.title, template: seo.titleTemplate }
      : seo.title,
    description: seo.description,
    keywords: seo.keywords.length > 0 ? seo.keywords : undefined,
    authors: seo.authorName ? [{ name: seo.authorName }] : undefined,
    creator: seo.authorName || undefined,
    openGraph: {
      type: "website",
      title: seo.title,
      description: seo.description,
      url: siteUrl,
      siteName: seo.authorName || seo.title,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: seo.title,
      description: seo.description,
      creator: seo.twitterHandle || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-bg text-ink min-h-full">{children}</body>
    </html>
  );
}
