import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

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

/**
 * お問い合わせページ（レイアウト見本に準拠）
 * - Contact バナー → 案内文 → フォーム（入力 → 確認 → 完了の3段階、送信なしデモ）
 * - 採用エントリー（応募）は /recruit に分離しています。
 *
 * ※ フォームのロジックは components/ContactForm.tsx に切り出しています。
 *   本実装時はサーバ側バリデーション・CSRF トークン・レート制限の追加を推奨。
 */
export default function ContactPage() {
  return (
    <>
      <PageHeader src="/images/Contact_header.png" alt="お問い合わせ" width={1366} height={183} />

      <div className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          {/* 案内文 */}
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>弊社に興味をお持ちいただきありがとうございます。</p>
            <p>
              お問い合わせいただきました内容は、弊社の掲げる
              <Link
                href="/privacy"
                className="font-medium text-slate-900 underline underline-offset-2 hover:opacity-70"
              >
                個人情報保護方針
              </Link>
              に沿って管理し、お客様の同意なく第三者に開示・提供することはございません。
            </p>
          </div>

          {/* お問い合わせフォーム（入力 → 確認 → 完了の3段階、送信なしデモ） */}
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
