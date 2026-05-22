import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "お問い合わせ",
};

/**
 * お問い合わせページ（/contact）
 * - 一般のお問い合わせ（案件相談・協業など）専用
 * - 連絡先の定数：lib/siteConfig.ts の contact
 * - フォーム：送信なし（デモ）。action や Server Actions を足すと発展できます。
 *
 * ※ 採用エントリー（応募）は /recruit に分離しています。
 */
export default function ContactPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        <SectionTitle
          eyebrow="Contact"
          title="お問い合わせ"
          description="サービスや協業に関するご相談をお待ちしています。下記はテンプレート用のデモ UI です（フォーム送信は行いません）。"
        />

        {/* CTA（ページ上部で迷わせない） */}
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={siteConfig.contact.phoneTel}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
          >
            電話する（{siteConfig.contact.phone}）
          </a>
          <Link
            href="/service"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-primary hover:text-primary hover:-translate-y-0.5"
          >
            サービス案内を見る
          </Link>
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          <p>TEL：{siteConfig.contact.phone}</p>
          <p className="mt-1">{siteConfig.contact.address}</p>
          <p className="mt-1">{siteConfig.contact.businessHours}</p>
        </div>

        {/* 採用希望者を /recruit へ誘導 */}
        <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          採用へのご応募・採用に関するご相談は、
          <Link href="/recruit" className="text-primary underline-offset-2 hover:underline">
            採用情報ページ
          </Link>
          の専用エントリーフォームをご利用ください。
        </div>

        {/* 一般お問い合わせフォーム（送信なしデモ） */}
        <Reveal>
          <section className="mt-12 rounded-xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">お問い合わせフォーム（デモ）</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              入力しても送信されません。ハッカソン後に Formspree や API 連携などに差し替えられます。
            </p>

            {/*
              セキュリティ補足：
              - 各入力の maxLength は、送信実装後のサーバ側で過剰な負荷／DoS 的入力を抑える防御。
              - 本実装時は CSRF トークン、サーバ側バリデーション、レート制限の追加を推奨。
            */}
            <form className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
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
                  <label htmlFor="company" className="text-sm font-medium text-slate-900">
                    会社名・団体名
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
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
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
              </div>

              <div>
                <label htmlFor="category" className="text-sm font-medium text-slate-900">
                  ご用件の種類 <span className="text-accent">（必須）</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900"
                  defaultValue="project"
                >
                  <option value="project">案件のご相談</option>
                  <option value="partner">協業のご相談</option>
                  <option value="service">サービスについて</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium text-slate-900">
                  お問い合わせ内容 <span className="text-accent">（必須）</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  maxLength={2000}
                  placeholder="現状の課題やご希望のスケジュールなどをご記入ください。"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                ※確認画面は表示されません。入力内容をよくご確認の上、送信ボタンを押してください。
              </p>

              {/*
                type="button" にしておくと、Server Component のまま「送信しないデモ」が作れます。
                本番で送信したいときは type="submit" + Server Actions などに変更してください。
              */}
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
              >
                送信する（デモ：動きません）
              </button>
            </form>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
