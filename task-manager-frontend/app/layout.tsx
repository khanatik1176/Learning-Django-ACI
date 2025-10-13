import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Providers from "@/components/providers";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "ACI PLC - Task Manager",
  description: "Performance Automation for ACI PLC Team",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <SessionProvider>
          <Providers>
            {children}
          </Providers>
                <ToastContainer />

        </SessionProvider>
      </body>
    </html>
  );
}