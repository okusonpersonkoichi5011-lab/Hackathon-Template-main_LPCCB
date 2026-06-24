"use client";

import Image from "next/image";
import { EmployeeInterviews } from "@/components/EmployeeInterviews";
import { ImageCarousel } from "@/components/ImageCarousel";
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
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * 採用情報ページの本体（クライアント側・日英対応）
 *
 * 各セクション：
 * - Recruit バナー → リード → 募集職種3カード
 *   → こんな人が集まっています → 応募の流れ → エントリーフォーム
 */
export function RecruitPageBody() {
  const { t, lang, pick } = useLanguage();
  const delays = [100, 200, 300, 400, 500] as const;

  // 言語別の小さな補助文言（辞書化するほどではないものはここで分岐）
  const openingsDesc =
    lang === "en"
      ? "Open to candidates from no experience through experienced engineers. Details of employment type and conditions are discussed at interview."
      : "未経験から経験者まで、幅広くご応募いただけます。雇用形態・条件の詳細は面談時にご説明します。";

  const membersIntro =
    lang === "en"
      ? "If any of these resonate, please feel free to start with a casual interview. We're waiting for the people who'll build this company with us in our friendly venture atmosphere."
      : "一つでも当てはまる方は、まずはカジュアル面談からでもお気軽にどうぞ。ベンチャーならではの和やかな雰囲気で、これからの会社を共に創ってくださる仲間をお待ちしています。";

  const flowDesc =
    lang === "en"
      ? "From application to start of work, we move through stages that are reassuring even for those new to the industry."
      : "応募から就業開始まで、未経験の方でも安心していただける段階で進みます。";

  const formIntro =
    lang === "en"
      ? "The form fields mirror the official application. Submissions are not actually sent in this demo (can be swapped to Formspree or Server Actions later)."
      : "公式サイトの応募フォームに準拠した項目構成です。入力しても送信されません（ハッカソン後に Formspree や Server Actions に差し替え可能）。";

  const formHeading =
    lang === "en" ? "Application Form (demo)" : "エントリーフォーム（デモ）";

  const membersTitle =
    lang === "en" ? "People who join us tend to be…" : "こんな人が集まっています！";

  // 「こんな人が集まっています！」のカルーセル画像（5枚）
  // ファイル名は ASCII セーフな形に統一済み（public/images 配下）
  const carouselImages = [
    {
      src: "/images/recruit-carousel-1.jpg",
      alt:
        lang === "en"
          ? "Light Path members enjoying time together"
          : "ライトパスの仲間と過ごす様子",
    },
    {
      src: "/images/recruit-carousel-2.jpg",
      alt:
        lang === "en" ? "Casual conversation between colleagues" : "和やかに会話する社員",
    },
    {
      src: "/images/recruit-carousel-3.jpg",
      alt: lang === "en" ? "Team gathering moment" : "チームで集まる様子",
    },
    {
      src: "/images/recruit-carousel-4.jpg",
      alt:
        lang === "en"
          ? "Smiling members during a get-together"
          : "笑顔で集まるメンバー",
    },
    {
      src: "/images/recruit-carousel-5.jpg",
      alt:
        lang === "en" ? "Group photo at the office" : "オフィスでの集合写真",
    },
  ];

  const carouselLabels =
    lang === "en"
      ? {
          ariaLabel: "Photos of Light Path members",
          prev: "Previous image",
          next: "Next image",
          goto: (i: number) => `Go to image ${i + 1}`,
          pause: "Pause autoplay",
          play: "Resume autoplay",
        }
      : {
          ariaLabel: "ライトパス メンバー写真のカルーセル",
          prev: "前の写真へ",
          next: "次の写真へ",
          goto: (i: number) => `${i + 1} 枚目へ`,
          pause: "自動再生を停止",
          play: "自動再生を再開",
        };

  return (
    <>
      <PageHeader src="/images/Recruit_header.png" alt={t("recruit.pageAlt")} />

      <div className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14">
          {/* リード */}
          <section>
            <Reveal variant="slide-right">
              <SectionTitle eyebrow="Recruit" title={pick(recruitLead.heading)} />
              <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                {pick(recruitLead.paragraphs).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </section>

          {/* 募集職種 */}
          <section className="mt-14">
            <h2 className="text-xl font-semibold text-slate-900">
              {t("recruit.openingsTitle")}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">{openingsDesc}</p>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {jobOpenings.map((job, index) => {
                const delay = ((index + 1) * 100) as 100 | 200 | 300;
                const title = pick(job.title);
                return (
                  <Reveal key={title} delay={delay}>
                    <article className="lp-card-hover-zoom flex h-full flex-col items-center rounded-xl border border-border bg-surface p-6 text-center">
                      <Image
                        src={job.icon}
                        alt=""
                        width={144}
                        height={144}
                        className="h-28 w-28 object-contain sm:h-32 sm:w-32"
                      />
                      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                      <p className="mt-2 text-sm text-accent">{pick(job.employmentType)}</p>
                      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                        {pick(job.description)}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* こんな人が集まっています！ */}
          <section className="mt-16">
            <SectionTitle eyebrow="Members" title={membersTitle} />
            <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-start">
              {/* メンバー写真カルーセル（5 枚・5 秒で自動切替・ホバーで停止） */}
              <Reveal variant="slide-left">
                <ImageCarousel
                  images={carouselImages}
                  autoPlayMs={5000}
                  aspectRatio="4 / 3"
                  ariaLabel={carouselLabels.ariaLabel}
                  labels={{
                    prev: carouselLabels.prev,
                    next: carouselLabels.next,
                    goto: carouselLabels.goto,
                    pause: carouselLabels.pause,
                    play: carouselLabels.play,
                  }}
                />
              </Reveal>
              <div>
                <Reveal variant="slide-right" delay={100}>
                  <p className="text-lg leading-relaxed text-muted-foreground">{membersIntro}</p>
                </Reveal>
                <Reveal variant="slide-right" delay={200}>
                  <ul className="mt-4 space-y-2.5 text-lg leading-relaxed text-slate-800">
                    {pick(idealCandidates).map((candidate) => (
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

            {/* 社員インタビュー */}
            <EmployeeInterviews interviews={employeeInterviews} />
          </section>

          {/* 応募の流れ */}
          <section className="mt-16">
            <SectionTitle eyebrow="Flow" title={t("recruit.flowTitle")} />
            <p className="mt-2 text-base text-muted-foreground">{flowDesc}</p>
            <div className="mt-8">
              {applicationFlow.map((flow, index) => {
                const delay = delays[index % delays.length];
                const isLast = index === applicationFlow.length - 1;
                return (
                  <Reveal key={flow.step} delay={delay}>
                    <div className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <span
                          aria-hidden
                          className="mt-1 h-4 w-4 shrink-0 rounded-full bg-primary ring-4 ring-background"
                        />
                        {!isLast && <div aria-hidden className="w-0.5 grow bg-primary" />}
                      </div>
                      <div className={isLast ? "" : "pb-10"}>
                        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                          STEP {String(flow.step).padStart(2, "0")}
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">
                          {pick(flow.title)}
                        </p>
                        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                          {pick(flow.description)}
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
              <h2 className="text-xl font-semibold text-slate-900">{formHeading}</h2>
              <p className="mt-2 text-base text-muted-foreground">{formIntro}</p>

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
