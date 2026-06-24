"use client";

import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { siteConfig } from "@/lib/siteConfig";

/** プライバシーポリシー各条項の日英版 */
const sectionsJa: { heading: string; body: string[] }[] = [
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

const sectionsEn: { heading: string; body: string[] }[] = [
  {
    heading: "1. Collection of Personal Information",
    body: [
      "We collect personal information through lawful and fair means, and never through deception or other improper methods.",
    ],
  },
  {
    heading: "2. Purpose of Use",
    body: [
      "We use the personal information we have collected within the scope of the following purposes:",
      "• To respond to and follow up on inquiries and consultations",
      "• To contact applicants and conduct hiring screening",
      "• To deliver our services, provide information about them and improve their quality",
      "• To perform tasks incidental to the above",
    ],
  },
  {
    heading: "3. Provision to Third Parties",
    body: [
      "Except where required by law, we will not disclose or provide personal information to third parties without obtaining the prior consent of the individual concerned.",
    ],
  },
  {
    heading: "4. Safety Measures",
    body: [
      "We will take necessary and appropriate measures to prevent the leakage, loss or damage of personal information, and to manage it safely.",
    ],
  },
  {
    heading: "5. Disclosure, Correction and Suspension of Use",
    body: [
      "When an individual requests disclosure, correction, addition, deletion, suspension of use or erasure of their personal information, we will, after confirming their identity, respond promptly in accordance with applicable law.",
    ],
  },
  {
    heading: "6. Compliance and Review",
    body: [
      "We comply with laws and other standards regarding the protection of personal information, and continuously review and improve this policy as appropriate.",
    ],
  },
];

/**
 * プライバシーポリシーページ本体（日英対応）
 */
export function PrivacyPageBody() {
  const { t, lang } = useLanguage();

  const sections = lang === "en" ? sectionsEn : sectionsJa;
  const intro =
    lang === "en"
      ? `${siteConfig.siteNameEn} (“we”, “us”) recognises the protection of customers' personal information as an important responsibility, and handles it appropriately in accordance with the policy below.`
      : `${siteConfig.siteName}（以下「当社」といいます）は、お客様の個人情報の保護を重要な責務と認識し、以下の方針に基づき個人情報を適切に取り扱います。`;

  const contactHeading = lang === "en" ? "7. Contact" : "7. お問い合わせ窓口";
  const enactedLabel =
    lang === "en"
      ? `Enacted: ${siteConfig.footerYear}`
      : `制定日：${siteConfig.footerYear} 年`;

  const contactName = lang === "en" ? siteConfig.siteNameEn : siteConfig.siteName;
  const contactAddr =
    lang === "en" ? siteConfig.contactEn.address : siteConfig.contact.address;
  const contactHours =
    lang === "en" ? siteConfig.contactEn.businessHours : siteConfig.contact.businessHours;
  const telLabel = lang === "en" ? "Phone" : "TEL";

  return (
    <>
      <PageHeader src="/images/PrivacyP_header.png" alt={t("privacy.pageAlt")} />

      <div className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-base leading-relaxed text-muted-foreground">{intro}</p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
                <div className="mt-3 space-y-2 text-base leading-relaxed text-muted-foreground">
                  {section.body.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </section>
            ))}

            {/* お問い合わせ窓口 */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900">{contactHeading}</h2>
              <div className="mt-3 space-y-1 text-base leading-relaxed text-muted-foreground">
                <p>{contactName}</p>
                <p>{contactAddr}</p>
                <p>
                  {telLabel}：{siteConfig.contact.phone}
                </p>
                <p>{contactHours}</p>
              </div>
            </section>
          </div>

          <p className="mt-10 text-right text-sm text-muted-foreground">{enactedLabel}</p>
        </div>
      </div>
    </>
  );
}
