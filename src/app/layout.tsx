import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import StickyFooterToolbar from "@/components/StickyFooterToolbar/StickyFooterToolbar";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat"
});

export const metadata: Metadata = {
  title: "Voice Alchemy Academy",
  description: "Transform your voice with expert vocal training, live coaching, and interactive tools",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <Header />
        <main style={{ paddingBottom: '80px' }}>
          {children}
        </main>
        <StickyFooterToolbar />
      </body>
    </html>
  );
}
