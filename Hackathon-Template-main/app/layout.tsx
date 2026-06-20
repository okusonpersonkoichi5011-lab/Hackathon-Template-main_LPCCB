import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * サイト全体（全ページ共通）の SEO メタデータ。
 * - metadataBase：OGP 画像や canonical を「絶対 URL」に解決するための基準。
 *   siteConfig.siteUrl を変えれば全ページに反映されます。
 * - 各ページ（/service など）の metadata はこの設定を継承し、title だけ上書きされます。
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
  // トップページの正規 URL。各ページは自身の metadata で個別に上書きします。
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
    // OGP 画像を用意したら app/opengraph-image.(png|jpg) を置くだけで自動採用されます。
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
    description: siteConfig.shortDescription,
  },
  // 検索エンジンにインデックス（掲載）を許可。公開前の非公開運用時は index:false に。
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

/**
 * 構造化データ（JSON-LD / schema.org Organization）。
 * Google などに「会社名・所在地・電話・公式 SNS」を機械可読で伝え、
 * ナレッジパネルやリッチリザルトの対象になりやすくします。
 */
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
  sameAs: [
    siteConfig.externalLinks.officialSite,
    siteConfig.externalLinks.instagram,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning：
    //   下の <head> 内インラインスクリプトが React の hydrate より先に走り
    //   <html> から 'no-js' クラスを取り除くため、サーバ側HTMLと差分が出る。
    //   この差分は「意図的」なものなので React の警告を抑止する。
    <html lang="ja" className={`no-js ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/*
          JS が動いた瞬間に <html> から 'no-js' を外す。
          これにより、JS が無効／読み込み失敗の環境では Reveal の opacity:0 が解除され
          画像・テキストが必ず表示されるフォールバックとして機能する。
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js');`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        {/* 構造化データ（会社情報）。検索エンジン向けで、画面には表示されません。 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
