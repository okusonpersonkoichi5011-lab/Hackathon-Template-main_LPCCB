import type { Metadata } from "next";
import { CompanyPageBody } from "./CompanyPageBody";

/**
 * 会社案内ページ
 * - metadata はサーバ側で固定値（SEO 用）
 * - 本体は CompanyPageBody（クライアントコンポーネント）で日英切替に対応
 */
export const metadata: Metadata = {
  title: "会社案内",
  description:
    "株式会社ライトパスの会社案内。会社概要、代表挨拶、事業内容、アクセス（東京都渋谷区道玄坂）をご紹介します。",
  alternates: { canonical: "/company" },
  openGraph: {
    title: "会社案内 | 株式会社ライトパス",
    description:
      "会社概要・代表挨拶・事業内容・アクセスをご紹介します。本社は東京都渋谷区道玄坂。",
    url: "/company",
  },
};

export default function CompanyPage() {
  return <CompanyPageBody />;
}
