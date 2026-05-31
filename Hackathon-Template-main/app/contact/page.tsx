import type { Metadata } from "next";
import Link from "next/link";
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
 * - Contact バナー → 案内文 → フォーム（送信なしデモ）
 * - 採用エントリー（応募）は /recruit に分離しています。
 *
 * ※ 各入力の maxLength は送信実装後のサーバ側で過剰入力を抑える防御。
 *   本実装時は CSRF トークン・サーバ側バリデーション・レート制限の追加を推奨。
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
              <Link href="/privacy" className="font-medium text-slate-900 underline underline-offset-2 hover:opacity-70">
                個人情報保護方針
              </Link>
              に沿って管理し、お客様の同意なく第三者に開示・提供することはございません。
            </p>
          </div>

          {/* お問い合わせフォーム（送信なしデモ） */}
          <Reveal>
            <form className="mt-10 space-y-5">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-slate-900">
                  お名前 <span className="text-accent">（必須）</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={60}
                  placeholder="山田 花子"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label htmlFor="furigana" className="text-sm font-medium text-slate-900">
                  ひらがな <span className="text-accent">（必須）</span>
                </label>
                <input
                  id="furigana"
                  name="furigana"
                  type="text"
                  required
                  maxLength={80}
                  placeholder="やまだ はなこ"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-slate-900">
                  メールアドレス <span className="text-accent">（必須）</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label htmlFor="company" className="text-sm font-medium text-slate-900">
                  御社名
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  maxLength={100}
                  placeholder="株式会社〇〇"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium text-slate-900">
                  電話番号
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={20}
                  pattern="[0-9\-\+\(\)\s]+"
                  placeholder="090-1234-5678"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label htmlFor="subject" className="text-sm font-medium text-slate-900">
                  件名 <span className="text-accent">（必須）</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  maxLength={120}
                  placeholder="お問い合わせの件名"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium text-slate-900">
                  お問い合わせ内容 <span className="text-accent">（必須）</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={7}
                  required
                  maxLength={2000}
                  placeholder="現状の課題やご希望のスケジュールなどをご記入ください。"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                ※確認画面は表示されません。入力内容をよくご確認の上、送信ボタンを押してください。入力しても送信されません（ハッカソン後に Formspree や Server Actions に差し替え可能）。
              </p>

              <p className="text-xs text-muted-foreground">
                採用へのご応募は、
                <Link href="/recruit" className="font-medium text-slate-900 underline underline-offset-2 hover:opacity-70">
                  採用情報ページ
                </Link>
                の専用エントリーフォームをご利用ください。
              </p>

              {/* type="button" のため送信されないデモ。本番は type="submit" + Server Actions などへ。 */}
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
              >
                入力内容確認（デモ：動きません）
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </>
  );
}
