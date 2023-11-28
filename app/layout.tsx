import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "./providers/SupabaseProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MusicGen Web UI",
  description: "Interface for MusicGen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </SupabaseProvider>
  );
}
