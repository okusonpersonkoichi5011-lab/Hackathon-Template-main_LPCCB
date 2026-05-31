import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/lib/siteConfig";

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

/** プライバシーポリシーの各条項（一般的な構成） */
const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. 個人情報の取得",
    body: [
      "当社は、適法かつ公正な手段によって個人情報を取得し、偽りその他不正の手段により取得することはありません。",
    ],
  },
  {
    heading: "2. 利用目的",
    body: [
      "当社は、取得した個人情報を以下の目的の範囲内で利用します。",
      "・お問い合わせ、ご相談への対応およびご連絡のため",
      "・採用応募者への連絡および採用選考のため",
      "・当社サービスの提供、ご案内および品質向上のため",
      "・上記に付随する業務を遂行するため",
    ],
  },
  {
    heading: "3. 第三者への提供",
    body: [
      "当社は、法令に基づく場合を除き、あらかじめご本人の同意を得ることなく、個人情報を第三者に開示・提供することはありません。",
    ],
  },
  {
    heading: "4. 安全管理措置",
    body: [
      "当社は、個人情報の漏えい、滅失または毀損の防止その他の安全管理のために、必要かつ適切な措置を講じます。",
    ],
  },
  {
    heading: "5. 開示・訂正・利用停止等",
    body: [
      "当社は、ご本人から個人情報の開示、訂正、追加、削除、利用停止または消去のご請求があった場合、ご本人であることを確認の上、法令に従い遅滞なく対応します。",
    ],
  },
  {
    heading: "6. 法令・規範の遵守と見直し",
    body: [
      "当社は、個人情報の保護に関する法令およびその他の規範を遵守するとともに、本方針の内容を適宜見直し、継続的な改善に努めます。",
    ],
  },
];

/**
 * プライバシーポリシーページ（レイアウト見本に準拠）
 * - Privacy Policy バナー → 本文
 * - 本文は一般的な個人情報保護方針の構成です。正式な内容は貴社の規程に合わせて差し替えてください。
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader src="/images/PrivacyP_header.png" alt="プライバシーポリシー" width={1366} height={183} />

      <div className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {siteConfig.siteName}（以下「当社」といいます）は、お客様の個人情報の保護を重要な責務と認識し、以下の方針に基づき個人情報を適切に取り扱います。
          </p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-base font-semibold text-slate-900">{section.heading}</h2>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {section.body.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </section>
            ))}

            {/* お問い合わせ窓口 */}
            <section>
              <h2 className="text-base font-semibold text-slate-900">7. お問い合わせ窓口</h2>
              <div className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
                <p>{siteConfig.siteName}</p>
                <p>{siteConfig.contact.address}</p>
                <p>TEL：{siteConfig.contact.phone}</p>
                <p>{siteConfig.contact.businessHours}</p>
              </div>
            </section>
          </div>

          <p className="mt-10 text-right text-xs text-muted-foreground">
            制定日：{siteConfig.footerYear} 年
          </p>
        </div>
      </div>
    </>
  );
}
