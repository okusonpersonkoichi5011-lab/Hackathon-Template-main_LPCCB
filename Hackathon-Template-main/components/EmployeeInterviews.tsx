"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import type { EmployeeInterview } from "@/lib/data/jobs";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type EmployeeInterviewsProps = {
  interviews: EmployeeInterview[];
};

/**
 * 社員インタビュー（開閉式・日英対応）
 * - 「社員インタビューはこちら」ボタンで表示／非表示を切り替えます。
 * - 各インタビューの initial / role / question / answer は Localized<*> なので
 *   pick() で現在の言語に変換します。
 */
export function EmployeeInterviews({ interviews }: EmployeeInterviewsProps) {
  const [open, setOpen] = useState(false);
  const { t, pick, lang } = useLanguage();

  const buttonLabel = open
    ? lang === "en"
      ? "Close interviews"
      : "社員インタビューを閉じる"
    : t("recruit.interviewsTitle");

  return (
    <div className="mt-8">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="employee-interviews"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
        >
          {buttonLabel}
        </button>
      </div>

      {open ? (
        <div
          id="employee-interviews"
          className="mt-8 grid gap-4 md:grid-cols-2 md:auto-rows-fr"
        >
          {interviews.map((interview, index) => {
            const delays = [100, 200, 300, 400, 500] as const;
            const delay = delays[index % delays.length];
            const initial = pick(interview.initial);
            const role = pick(interview.role);
            const question = pick(interview.question);
            const answer = pick(interview.answer);
            return (
              <Reveal
                key={`${initial}-${role}`}
                variant="fade-up-strong"
                delay={delay}
                className="h-full"
              >
                <article className="flex h-full flex-col rounded-xl border border-border bg-surface p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                      <Image
                        src="/images/human.png"
                        alt=""
                        width={28}
                        height={40}
                        className="h-8 w-auto"
                      />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{initial}</p>
                      <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-900">Q. {question}</p>
                  <div className="mt-2 flex-1 space-y-2 overflow-y-auto pr-1 text-sm leading-relaxed text-muted-foreground">
                    {answer.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
