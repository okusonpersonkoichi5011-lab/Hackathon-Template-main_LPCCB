import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * サイト全体（全ページ共通）の SEO メタデータ。
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.siteName}｜システム・インフラ・ヘルプデスクのアウトソーシング`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.shortDescription,
  applicationName: siteConfig.siteName,
  keywords: [
    "ライトパス",
    "株式会社ライトパス",
    "Light Path",
    "システムエンジニア",
    "インフラエンジニア",
    "ヘルプデスク",
    "アウトソーシング",
    "SES",
    "渋谷",
    "IT 業務委託",
  ],
  authors: [{ name: siteConfig.siteName }],
  creator: siteConfig.siteName,
  publisher: siteConfig.siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteConfig.siteUrl,
    siteName: siteConfig.siteName,
    title: `${siteConfig.siteName}｜システム・インフラ・ヘルプデスクのアウトソーシング`,
    description: siteConfig.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
    description: siteConfig.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

/** 構造化データ（JSON-LD / schema.org Organization） */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.siteName,
  alternateName: siteConfig.siteNameEn,
  url: siteConfig.siteUrl,
  telephone: "+81-3-6277-5897",
  description: siteConfig.shortDescription,
  address: {
    "@type": "PostalAddress",
    postalCode: "150-0043",
    addressRegion: "東京都",
    addressLocality: "渋谷区",
    streetAddress: "道玄坂1-19-11 寿道玄坂ビル8F",
    addressCountry: "JP",
  },
  sameAs: [siteConfig.externalLinks.officialSite, siteConfig.externalLinks.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning：
    //   インラインスクリプトが hydrate 前に走り <html> から no-js を外す。
    //   LanguageProvider も <html lang> を実際の言語に同期させるため、ここで warning を抑制。
    <html lang="ja" className={`no-js ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* 外部 API への DNS 早期解決（フォーム郵便番号検索の zipcloud / Google マップ） */}
        <link rel="dns-prefetch" href="https://zipcloud.ibsnet.co.jp" />
        <link rel="dns-prefetch" href="https://maps.google.com" />
        <link rel="preconnect" href="https://zipcloud.ibsnet.co.jp" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js');`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* LanguageProvider：サイト全体の日英切替状態を保持。 */}
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
