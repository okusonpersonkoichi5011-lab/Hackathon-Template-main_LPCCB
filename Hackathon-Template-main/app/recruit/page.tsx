import type { Metadata } from "next";
import Image from "next/image";
import { EmployeeInterviews } from "@/components/EmployeeInterviews";
import { PageHeader } from "@/components/PageHeader";
import { RecruitForm } from "@/components/RecruitForm";
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
          {/* リード（画面外右から左へスライド＋フェードイン） */}
          <section>
            <Reveal variant="slide-right">
              <SectionTitle eyebrow="Recruit" title={recruitLead.heading} />
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {recruitLead.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
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
                    <article className="lp-card-hover-zoom flex h-full flex-col items-center rounded-xl border border-border bg-surface p-6 text-center">
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
              {/* 写真（左）：画面外左から右の定位置へスライド＋フェードイン */}
              <Reveal variant="slide-left">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border">
                  <Image
                    src="/images/Group_photo2.jpg"
                    alt="ライトパスのメンバー集合写真"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              {/* 紹介文（早め）と当てはまる人リスト（やや遅れて）：どちらも画面外右からスライド */}
              <div>
                <Reveal variant="slide-right" delay={100}>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    一つでも当てはまる方は、まずはカジュアル面談からでもお気軽にどうぞ。ベンチャーならではの和やかな雰囲気で、これからの会社を共に創ってくださる仲間をお待ちしています。
                  </p>
                </Reveal>
                <Reveal variant="slide-right" delay={200}>
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
                </Reveal>
              </div>
            </div>

            {/* 社員インタビュー（「社員インタビューはこちら」ボタンで開閉） */}
            <EmployeeInterviews interviews={employeeInterviews} />
          </section>

          {/* 応募の流れ（5 ステップ・縦タイムライン：黄色いドットを線でつなぐ） */}
          <section className="mt-16">
            <SectionTitle eyebrow="Flow" title="応募の流れ" />
            <p className="mt-2 text-sm text-muted-foreground">
              応募から就業開始まで、未経験の方でも安心していただける段階で進みます。
            </p>
            <div className="mt-8">
              {applicationFlow.map((flow, index) => {
                const delay = delays[index % delays.length];
                const isLast = index === applicationFlow.length - 1;
                return (
                  <Reveal key={flow.step} delay={delay}>
                    <div className="flex gap-5">
                      {/* 左：黄色いドット＋縦線（次のステップへつなぐ） */}
                      <div className="flex flex-col items-center">
                        <span
                          aria-hidden
                          className="mt-1 h-4 w-4 shrink-0 rounded-full bg-primary ring-4 ring-background"
                        />
                        {!isLast && (
                          <div aria-hidden className="w-0.5 grow bg-primary" />
                        )}
                      </div>
                      {/* 右：ステップの本文 */}
                      <div className={isLast ? "" : "pb-10"}>
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                          STEP {String(flow.step).padStart(2, "0")}
                        </p>
                        <p className="mt-1 text-base font-semibold text-slate-900">
                          {flow.title}
                        </p>
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

              <div className="mt-8">
                <RecruitForm />
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </>
  );
}
