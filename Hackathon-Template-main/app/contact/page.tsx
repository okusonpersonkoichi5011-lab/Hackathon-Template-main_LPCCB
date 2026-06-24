import type { Metadata } from "next";
import { ContactPageBody } from "./ContactPageBody";

/**
 * お問い合わせページ
 * - metadata はサーバ側で固定（日本語 SEO 用）
 * - 本体は ContactPageBody（クライアント）で日英切替に対応
 */
export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "株式会社ライトパスへのお問い合わせ。サービス・案件・協業に関するご相談を承ります。お電話（03-6277-5897）でもお気軽にどうぞ。",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "お問い合わせ | 株式会社ライトパス",
    description:
      "サービスや協業に関するご相談をお待ちしています。IT システムやインフラの課題は、まずはお気軽にご相談ください。",
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactPageBody />;
}
