"use client";

import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * お問い合わせページ本体（クライアント側・日英対応）
 *
 * 案内文 + フォーム（フォームのラベル・バリデーション・確認画面は
 * components/ContactForm.tsx 側で日英対応）
 */
export function ContactPageBody() {
  const { t, lang } = useLanguage();

  const introP1 =
    lang === "en"
      ? "Thank you for your interest in Light Path Inc."
      : "弊社に興味をお持ちいただきありがとうございます。";

  // 個人情報保護方針へのリンクは段落の途中に挟むため、JSX で組み立てる
  const privacyLinkLabel = lang === "en" ? "Privacy Policy" : "個人情報保護方針";

  return (
    <>
      <PageHeader
        src="/images/Contact_header.png"
        alt={t("contact.pageAlt")}
        width={1366}
        height={183}
      />

      <div className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>{introP1}</p>
            {lang === "en" ? (
              <p>
                We manage submitted information in accordance with our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-slate-900 underline underline-offset-2 hover:opacity-70"
                >
                  {privacyLinkLabel}
                </Link>
                , and will not disclose or share it with third parties without your consent.
              </p>
            ) : (
              <p>
                お問い合わせいただきました内容は、弊社の掲げる
                <Link
                  href="/privacy"
                  className="font-medium text-slate-900 underline underline-offset-2 hover:opacity-70"
                >
                  {privacyLinkLabel}
                </Link>
                に沿って管理し、お客様の同意なく第三者に開示・提供することはございません。
              </p>
            )}
          </div>

          {/* お問い合わせフォーム */}
          <Reveal>
            <div className="mt-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
