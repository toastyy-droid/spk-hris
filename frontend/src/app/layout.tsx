import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Providers } from "@/components/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HRIS AMM - CV Anugerah Mega Makmur",
  description: "Human Resource Information System & Sistem Penunjang Keputusan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
