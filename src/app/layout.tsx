import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI & Tech Insights | Premium Edition",
  description: "海外の最新AIトレンドや技術ニュースを洗練されたAIが自動で翻訳・要約してお届けします。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <head>
        {/*
          Google AdSense 自動広告のスクリプト
          ※ 審査通過後、'ca-pub-XXXXXXXXXXXXXXXX' の部分をご自身のアカウントID（サイト運営者ID）に書き換えてください。
        */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} antialiased bg-[#050505] text-gray-100 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
