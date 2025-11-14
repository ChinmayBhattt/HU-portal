import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Navigation } from "@/components/layout/navigation";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hackers Unity - Where Hackers Unite to Ignite the Future",
  description: "Join India's fastest growing hacker community. Create, discover, and attend amazing tech events, workshops, and hackathons.",
  keywords: ["hackers", "tech events", "hackathons", "workshops", "community", "innovation"],
  openGraph: {
    title: "Hackers Unity - Where Hackers Unite to Ignite the Future",
    description: "Join India's fastest growing hacker community. Create, discover, and attend amazing tech events, workshops, and hackathons.",
    type: "website",
    url: "https://hackersunity.in",
    images: [
      {
        url: "https://hackersunity.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hackers Unity - Community Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hackers Unity - Where Hackers Unite to Ignite the Future",
    description: "Join India's fastest growing hacker community. Create, discover, and attend amazing tech events, workshops, and hackathons.",
    images: ["https://hackersunity.in/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster 
              position="top-right"
              theme="dark"
              richColors
              closeButton
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
