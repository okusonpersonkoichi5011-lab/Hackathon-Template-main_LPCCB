"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import type { EmployeeInterview } from "@/lib/data/jobs";

type EmployeeInterviewsProps = {
  interviews: EmployeeInterview[];
};

/**
 * 社員インタビュー（開閉式）
 * - 「社員インタビューはこちら」ボタンで表示／非表示を切り替えます。
 * - クリック操作のためクライアントコンポーネントにしています。
 */
export function EmployeeInterviews({ interviews }: EmployeeInterviewsProps) {
  const [open, setOpen] = useState(false);

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
          {open ? "社員インタビューを閉じる" : "社員インタビューはこちら"}
        </button>
      </div>

      {open ? (
        <div id="employee-interviews" className="mt-8 grid gap-4 md:grid-cols-2">
          {interviews.map((interview, index) => {
            // 100/200/300/400/500ms とずらすことで、カードが画面下から順番に出現
            const delays = [100, 200, 300, 400, 500] as const;
            const delay = delays[index % delays.length];
            return (
              <Reveal
                key={`${interview.initial}-${interview.role}`}
                variant="fade-up-strong"
                delay={delay}
              >
                <article className="rounded-xl border border-border bg-surface p-6">
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
                      <p className="text-sm font-semibold text-slate-900">{interview.initial}</p>
                      <p className="text-xs text-muted-foreground">{interview.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    Q. {interview.question}
                  </p>
                  <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {interview.answer.map((paragraph, idx) => (
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
