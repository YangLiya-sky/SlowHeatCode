import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { RoutePreloader } from "@/components/ui/RoutePreloader";
import { DataSyncProvider } from "@/components/providers/DataSyncProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "杨立雅 - 个人博客",
  description: "杨立雅的个人博客网站，采用玻璃拟态设计风格，分享技术见解和生活感悟",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <DataSyncProvider>
            <RoutePreloader />
            {children}
          </DataSyncProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
