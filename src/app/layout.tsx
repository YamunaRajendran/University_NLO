import type { Metadata } from 'next'
import './globals.css'
import NetworkBackground from '@/app/sidebar/NetworkBackground'
import {Header} from '@/app/sidebar/Header';

import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "National Labor Observatory",
  description: "University Dashboard and Analytics",
  icons: {
    icon: [
      {
        url: "/logo/nlo logo symbol.png",
        type: "image/png",
        sizes: "32x32"
      },
      {
        url: "/logo/nlo logo symbol.png",
        type: "image/png",
        sizes: "192x192"
      }
    ],
    apple: {
      url: "/logo/nlo logo symbol.png",
      type: "image/png",
      sizes: "180x180"
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen overflow-x-hidden`}>
        <NetworkBackground />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}