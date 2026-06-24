import type { Metadata } from "next";
import { PrivacyPageBody } from "./PrivacyPageBody";

/**
 * プライバシーポリシーページ
 * - metadata はサーバ側で固定（日本語 SEO 用）
 * - 本体は PrivacyPageBody（クライアント）で日英切替に対応
 */
export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "株式会社ライトパスのプライバシーポリシー（個人情報保護方針）。個人情報の取得・利用目的、第三者提供、安全管理、開示請求の取り扱いについてご案内します。",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "プライバシーポリシー | 株式会社ライトパス",
    description: "株式会社ライトパスの個人情報保護方針をご案内します。",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyPageBody />;
}
