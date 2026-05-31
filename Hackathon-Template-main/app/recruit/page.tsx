import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmployeeInterviews } from "@/components/EmployeeInterviews";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import {
  applicationFlow,
  employeeInterviews,
  idealCandidates,
  jobOpenings,
  recruitLead,
} from "@/lib/data/jobs";

export const metadata: Metadata = {
  title: "採用情報",
  description:
    "株式会社ライトパスの採用情報。システム／インフラ／ヘルプデスクの募集職種、求める人物像、応募の流れをご案内。未経験からのキャリアアップも研修とサポートで後押しします。",
  alternates: { canonical: "/recruit" },
  openGraph: {
    title: "採用情報 | 株式会社ライトパス",
    description:
      "一緒に会社を盛り上げてくれる仲間を募集中。未経験からのキャリアアップも研修とサポートで後押しします。",
    url: "/recruit",
  },
};

/**
 * 採用情報ページ（レイアウト見本に準拠）
 * - Recruit バナー → リード → 募集職種（アイコン3カード）
 *   → こんな人が集まっています（集合写真＋リスト）→ 応募の流れ → エントリーフォーム
 * - 本文は公式サイト（https://light-path.co.jp/recruit/）に準拠。
 */
export default function RecruitPage() {
  const delays = [100, 200, 300, 400, 500] as const;

  return (
    <>
      <PageHeader src="/images/Recruit_header.png" alt="採用情報" width={1366} height={186} />

      <div className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14">
          {/* リード */}
          <section>
            <SectionTitle eyebrow="Recruit" title={recruitLead.heading} />
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {recruitLead.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* 募集職種（アイコン付き3カード） */}
          <section className="mt-14">
            <h2 className="text-lg font-semibold text-slate-900">募集職種</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              未経験から経験者まで、幅広くご応募いただけます。雇用形態・条件の詳細は面談時にご説明します。
            </p>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {jobOpenings.map((job, index) => {
                const delay = ((index + 1) * 100) as 100 | 200 | 300;
                return (
                  <Reveal key={job.title} delay={delay}>
                    <article className="lp-hover-lift flex h-full flex-col items-center rounded-xl border border-border bg-surface p-6 text-center">
                      <Image
                        src={job.icon}
                        alt=""
                        width={144}
                        height={144}
                        className="h-28 w-28 object-contain sm:h-32 sm:w-32"
                      />
                      <h3 className="mt-4 text-base font-semibold text-slate-900">{job.title}</h3>
                      <p className="mt-2 text-xs text-accent">{job.employmentType}</p>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {job.description}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* こんな人が集まっています！ */}
          <section className="mt-16">
            <SectionTitle eyebrow="Members" title="こんな人が集まっています！" />
            <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-start">
              {/* 写真（左） */}
              <Reveal>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border">
                  <Image
                    src="/images/Group_photo2.png"
                    alt="ライトパスのメンバー集合写真"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              {/* 紹介文＋当てはまる人リスト（写真の右側に配置） */}
              <Reveal delay={100}>
                <div>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    一つでも当てはまる方は、まずはカジュアル面談からでもお気軽にどうぞ。ベンチャーならではの和やかな雰囲気で、これからの会社を共に創ってくださる仲間をお待ちしています。
                  </p>
                  <ul className="mt-4 space-y-2.5 text-base leading-relaxed text-slate-800">
                    {idealCandidates.map((candidate) => (
                      <li key={candidate} className="flex items-start gap-2">
                        <span
                          aria-hidden
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        />
                        <span>{candidate}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* 社員インタビュー（「社員インタビューはこちら」ボタンで開閉） */}
            <EmployeeInterviews interviews={employeeInterviews} />
          </section>

          {/* 応募の流れ（5 ステップ） */}
          <section className="mt-16">
            <SectionTitle eyebrow="Flow" title="応募の流れ" />
            <p className="mt-2 text-sm text-muted-foreground">
              応募から就業開始まで、未経験の方でも安心していただける段階で進みます。
            </p>
            <div className="mt-6 space-y-4">
              {applicationFlow.map((flow, index) => {
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

          {/* エントリーフォーム（採用専用・送信なしデモ） */}
          <Reveal>
            <section
              id="entry"
              className="mt-16 scroll-mt-28 rounded-xl border border-border bg-surface p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold text-slate-900">エントリーフォーム（デモ）</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                公式サイトの応募フォームに準拠した項目構成です。入力しても送信されません（ハッカソン後に Formspree や Server Actions に差し替え可能）。
              </p>

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
                  <label htmlFor="motivation" className="text-sm font-medium text-slate-900">
                    志望動機・PR 事項など <span className="text-accent">（必須）</span>
                  </label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    rows={5}
                    required
                    maxLength={2000}
                    placeholder="志望動機やアピールしたい点などをご記入ください。"
                    className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  ※確認画面は表示されません。入力内容をよくご確認の上、送信ボタンを押してください。
                </p>

                <p className="text-xs text-muted-foreground">
                  採用以外（案件・協業など）のご相談は、
                  <Link href="/contact" className="font-medium text-slate-900 underline underline-offset-2 hover:opacity-70">
                    お問い合わせページ
                  </Link>
                  をご利用ください。
                </p>

                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md sm:w-auto"
                >
                  応募する（デモ：動きません）
                </button>
              </form>
            </section>
          </Reveal>
        </div>
      </div>
    </>
  );
}
