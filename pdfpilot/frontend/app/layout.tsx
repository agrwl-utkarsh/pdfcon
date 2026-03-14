import type { Metadata } from "next";
import { DM_Serif_Display, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display"
});

const body = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "PDFPilot",
  description: "PDF tools made simple. Merge and split PDFs in seconds."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
