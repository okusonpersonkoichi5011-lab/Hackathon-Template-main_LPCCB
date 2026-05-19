import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import {
  applicationFlow,
  idealCandidates,
  jobOpenings,
  recruitLead,
} from "@/lib/data/jobs";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "お問い合わせ",
};

/**
 * お問い合わせページ（採用情報 + フォーム風 UI）
 * - 募集職種・採用リード・応募フロー：lib/data/jobs.ts
 * - 連絡先の定数：lib/siteConfig.ts の contact
 * - フォーム：送信なし（デモ）。action や Server Actions を足すと発展できます。
 * - 採用情報の本文は公式サイト（https://light-path.co.jp/recruit/）に準拠。
 */
export default function ContactPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        <SectionTitle
          eyebrow="Contact / Careers"
          title="お問い合わせ・採用のご相談"
          description="お客様・採用候補者の皆さまからのお問い合わせをお待ちしています。下記はテンプレート用のデモ UI です（フォーム送信は行いません）。"
        />

        {/* CTA（ページ上部で迷わせない） */}
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={siteConfig.contact.phoneTel}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            電話する（{siteConfig.contact.phone}）
          </a>
          <Link
            href="/service"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-slate-800 hover:border-primary hover:text-primary"
          >
            サービス案内を見る
          </Link>
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          <p>TEL：{siteConfig.contact.phone}</p>
          <p className="mt-1">{siteConfig.contact.address}</p>
          <p className="mt-1">{siteConfig.contact.businessHours}</p>
        </div>

        {/* 採用情報セクション（公式サイトの recruit ページに沿った構成） */}
        <section id="jobs" className="mt-16 scroll-mt-28">
          <h2 className="text-2xl font-semibold text-slate-900">{recruitLead.heading}</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            {recruitLead.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* 募集職種カード */}
          <h3 className="mt-12 text-lg font-semibold text-slate-900">募集職種</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            未経験から経験者まで、幅広くご応募いただけます。雇用形態・条件の詳細は面談時にご説明します。
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {jobOpenings.map((job, index) => {
              const delay = ((index + 1) * 100) as 100 | 200 | 300;
              return (
                <Reveal key={job.title} delay={delay}>
                  <article className="lp-hover-lift h-full rounded-xl border border-border bg-surface p-6">
                    <h4 className="text-base font-semibold text-slate-900">{job.title}</h4>
                    <p className="mt-2 text-xs text-accent">{job.employmentType}</p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{job.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {/* こんな人が集まっています！ */}
          <h3 className="mt-14 text-lg font-semibold text-slate-900">こんな人が集まっています！</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            一つでも当てはまる方は、まずはカジュアル面談からでもお気軽にどうぞ。
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {idealCandidates.map((candidate, index) => {
              // 7 項目を 100ms ずつずらすと最後が遅すぎるので 5 段階で循環
              const delays = [100, 200, 300, 400, 500] as const;
              const delay = delays[index % delays.length];
              return (
                <Reveal key={candidate} delay={delay}>
                  <div className="lp-hover-lift flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-slate-800">
                    <span
                      aria-hidden
                      className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary"
                    />
                    <span>{candidate}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* 応募の流れ（5 ステップ） */}
          <h3 className="mt-14 text-lg font-semibold text-slate-900">応募の流れ</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            応募から就業開始まで、未経験の方でも安心していただける段階で進みます。
          </p>
          <div className="mt-6 space-y-4">
            {applicationFlow.map((flow, index) => {
              const delays = [100, 200, 300, 400, 500] as const;
              const delay = delays[index % delays.length];
              return (
                <Reveal key={flow.step} delay={delay}>
                  <div className="lp-hover-lift flex gap-4 rounded-xl border border-border bg-surface p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {flow.step}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{flow.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {flow.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* エントリーフォーム風 UI（送信なし） */}
        <Reveal>
        <section id="entry" className="mt-16 scroll-mt-28 rounded-xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">エントリーフォーム（デモ）</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            公式サイトの応募フォームに準拠した項目構成です。入力しても送信されません（ハッカソン後に Formspree や Server Actions に差し替え可能）。
          </p>

          {/*
            セキュリティ補足：
            - 各入力の maxLength は、送信実装後のサーバ側で過剰な負荷／DoS 的入力を抑える防御。
            - autoComplete はブラウザの自動入力 UI を適切に出すための指定。
            - novalidate にしていないので、ブラウザ側のフォーマット検証（type=email/tel）も有効。
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
                <label htmlFor="furigana" className="text-sm font-medium text-slate-900">
                  ふりがな <span className="text-accent">（必須）</span>
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
                  電話番号 <span className="text-accent">（必須）</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  maxLength={20}
                  // ハイフン許容の数字パターン（不正なスクリプト混入抑止）
                  pattern="[0-9\-\+\(\)\s]+"
                  placeholder="090-1234-5678"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className="text-sm font-medium text-slate-900">
                  年齢
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min={16}
                  max={99}
                  placeholder="例：26"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label htmlFor="startDate" className="text-sm font-medium text-slate-900">
                  就業可能時期 <span className="text-accent">（必須）</span>
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="text"
                  required
                  maxLength={60}
                  placeholder="例：2026年7月〜、即日 など"
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="text-sm font-medium text-slate-900">
                住所
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                maxLength={200}
                placeholder="〒150-0043 東京都渋谷区道玄坂…"
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label htmlFor="employmentType" className="text-sm font-medium text-slate-900">
                ご希望の雇用形態 <span className="text-accent">（必須）</span>
              </label>
              <select
                id="employmentType"
                name="employmentType"
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900"
                defaultValue="fulltime"
              >
                <option value="fulltime">正社員</option>
                <option value="parttime">パート・アルバイト</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="text-sm font-medium text-slate-900">
                ご用件の種類
              </label>
              <select
                id="category"
                name="category"
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900"
                defaultValue="career"
              >
                <option value="career">採用について（エントリー）</option>
                <option value="casual">カジュアル面談を希望</option>
                <option value="project">案件のご相談</option>
                <option value="partner">協業のご相談</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div>
              <label htmlFor="career" className="text-sm font-medium text-slate-900">
                職務経歴 <span className="text-accent">（必須）</span>
              </label>
              <textarea
                id="career"
                name="career"
                rows={4}
                required
                maxLength={2000}
                placeholder="これまでのご職業・担当業務などを簡単にご記入ください。"
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-medium text-slate-900">
                志望動機・PR 事項など <span className="text-accent">（必須）</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                maxLength={2000}
                placeholder="志望動機やアピールしたい点、現状の課題・ご希望のスケジュールなどをご記入ください。"
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
