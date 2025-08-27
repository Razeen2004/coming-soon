import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Coming Soon | Prompt Suite",
  description: "Coming Soon...",
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} antialiased]`}
      >
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 2000,
            style: {
              background: '#26262C',
              color: '#F2F2F2',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
