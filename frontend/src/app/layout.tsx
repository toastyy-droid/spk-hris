import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pemilihan Supplier Terbaik",
  description: "Aplikasi evaluasi dan pemilihan supplier terbaik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="id" suppressHydrationWarning className="overflow-hidden">
      <body className={`${sora.variable} font-sans antialiased overflow-hidden`}>
        <Providers>
          <AppShell>{children}</AppShell>
          <Toaster richColors position="top-right" closeButton />
        </Providers>
      </body>
    </html>
  );
}
