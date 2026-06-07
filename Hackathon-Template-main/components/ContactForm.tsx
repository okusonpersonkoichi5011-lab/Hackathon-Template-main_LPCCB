"use client";

import Link from "next/link";
import { useRef, useState } from "react";

/**
 * お問い合わせフォーム（入力 → 確認 → 完了 の3段階・送信なしデモ）
 * - 自前バリデーションで「必須」「形式」をチェックし、エラー文を赤字で各項目の下に表示
 * - form には noValidate を指定し、ブラウザ標準のポップアップを抑止
 * - 入力修正したらその項目のエラーは自動で消える
 * - 画面切り替え時はフォーム上端へスムーズスクロール
 */

type ContactData = {
  name: string;
  furigana: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
};

type ContactErrors = Partial<Record<keyof ContactData, string>>;

const initialData: ContactData = {
  name: "",
  furigana: "",
  email: "",
  company: "",
  phone: "",
  subject: "",
  message: "",
};

const labelMap: Record<keyof ContactData, string> = {
  name: "お名前",
  furigana: "ひらがな",
  email: "メールアドレス",
  company: "御社名",
  phone: "電話番号",
  subject: "件名",
  message: "お問い合わせ内容",
};

// メールアドレスの簡易検証（厳密 RFC ではなく、現実的なパターン）
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 電話番号：半角数字・ハイフン・プラス・括弧・空白のみ
const PHONE_RE = /^[0-9\-+()\s]+$/;
// ひらがな（と全角空白・半角空白）のみ
const HIRAGANA_RE = /^[぀-ゟ\s　]+$/;

const validate = (data: ContactData): ContactErrors => {
  const e: ContactErrors = {};
  if (!data.name.trim()) e.name = "お名前を入力してください。";
  if (!data.furigana.trim()) {
    e.furigana = "ひらがなを入力してください。";
  } else if (!HIRAGANA_RE.test(data.furigana)) {
    e.furigana = "ひらがなで入力してください。";
  }
  if (!data.email.trim()) {
    e.email = "メールアドレスを入力してください。";
  } else if (!EMAIL_RE.test(data.email)) {
    e.email = "メールアドレスの形式で入力してください。(例:you@example.com)";
  }
  // 御社名は任意のため、空でもエラーなし
  if (data.phone && !PHONE_RE.test(data.phone)) {
    e.phone = "電話番号は半角数字・ハイフン等で入力してください。";
  }
  if (!data.subject.trim()) e.subject = "件名を入力してください。";
  if (!data.message.trim()) e.message = "お問い合わせ内容を入力してください。";
  return e;
};

const labelClass = "text-sm font-medium text-slate-900";
const requiredMark = <span className="text-accent">（必須）</span>;
const inputClass = (hasError: boolean) =>
  `mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground ${
    hasError ? "border-red-500" : "border-border"
  }`;

/** 各項目の下に表示する赤字エラー */
function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-red-600">
      {error}
    </p>
  );
}

export function ContactForm() {
  const [data, setData] = useState<ContactData>(initialData);
  const [step, setStep] = useState<"input" | "confirm" | "done">("input");
  const [errors, setErrors] = useState<ContactErrors>({});
  const containerRef = useRef<HTMLDivElement>(null);

  /** 値を更新し、その項目のエラーがあればクリアする */
  const set = <K extends keyof ContactData>(key: K, value: ContactData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const scrollToFormTop = () => {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(data);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      scrollToFormTop();
      return;
    }
    setErrors({});
    setStep("confirm");
    scrollToFormTop();
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ★本番ではここで API/Server Actions へ送信。今はデモのため送信しません。
    setStep("done");
    scrollToFormTop();
  };

  const backToEdit = () => {
    setStep("input");
    scrollToFormTop();
  };

  return (
    <div ref={containerRef} className="scroll-mt-24">
      {step === "done" ? (
        // 完了画面（デモ）
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-900">送信が完了しました（デモ）</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            実際には送信されていません。本番運用時は Formspree や Server Actions などのバックエンドへ接続してください。
          </p>
          <button
            type="button"
            onClick={() => {
              setData(initialData);
              setErrors({});
              setStep("input");
              scrollToFormTop();
            }}
            className="mt-6 inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-primary hover:text-slate-900"
          >
            続けて別のお問い合わせを送る
          </button>
        </div>
      ) : step === "confirm" ? (
        // 確認画面
        <form onSubmit={handleSendSubmit} className="space-y-6">
          <p className="text-sm text-muted-foreground">
            以下の内容で送信します。修正したい項目があれば「修正する」を押してください。
          </p>
          <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {(Object.keys(labelMap) as (keyof ContactData)[]).map((key) => (
              <div
                key={key}
                className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5"
              >
                <dt className="text-sm font-medium text-muted-foreground">{labelMap[key]}</dt>
                <dd className="whitespace-pre-wrap break-words text-sm text-slate-900">
                  {data[key] || <span className="text-muted-foreground">（未入力）</span>}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
            >
              送信する（デモ：実際には送信されません）
            </button>
            <button
              type="button"
              onClick={backToEdit}
              className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-3 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-primary hover:text-slate-900"
            >
              修正する
            </button>
          </div>
        </form>
      ) : (
        // 入力画面
        <form onSubmit={handleInputSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="name" className={labelClass}>
              お名前 {requiredMark}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={60}
              placeholder="山田 花子"
              value={data.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClass(!!errors.name)}
            />
            <FieldError id="name-error" error={errors.name} />
          </div>

          <div>
            <label htmlFor="furigana" className={labelClass}>
              ひらがな {requiredMark}
            </label>
            <input
              id="furigana"
              name="furigana"
              type="text"
              maxLength={80}
              placeholder="やまだ はなこ"
              value={data.furigana}
              onChange={(e) => set("furigana", e.target.value)}
              aria-invalid={!!errors.furigana}
              aria-describedby={errors.furigana ? "furigana-error" : undefined}
              className={inputClass(!!errors.furigana)}
            />
            <FieldError id="furigana-error" error={errors.furigana} />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              メールアドレス {requiredMark}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass(!!errors.email)}
            />
            <FieldError id="email-error" error={errors.email} />
          </div>

          <div>
            <label htmlFor="company" className={labelClass}>
              御社名
            </label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              maxLength={100}
              placeholder="株式会社〇〇"
              value={data.company}
              onChange={(e) => set("company", e.target.value)}
              className={inputClass(false)}
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              電話番号
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={20}
              placeholder="090-1234-5678"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={inputClass(!!errors.phone)}
            />
            <FieldError id="phone-error" error={errors.phone} />
          </div>

          <div>
            <label htmlFor="subject" className={labelClass}>
              件名 {requiredMark}
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              maxLength={120}
              placeholder="お問い合わせの件名"
              value={data.subject}
              onChange={(e) => set("subject", e.target.value)}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "subject-error" : undefined}
              className={inputClass(!!errors.subject)}
            />
            <FieldError id="subject-error" error={errors.subject} />
          </div>

          <div>
            <label htmlFor="message" className={labelClass}>
              お問い合わせ内容 {requiredMark}
            </label>
            <textarea
              id="message"
              name="message"
              rows={7}
              maxLength={2000}
              placeholder="現状の課題やご希望のスケジュールなどをご記入ください。"
              value={data.message}
              onChange={(e) => set("message", e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={inputClass(!!errors.message)}
            />
            <FieldError id="message-error" error={errors.message} />
          </div>

          <p className="text-xs text-muted-foreground">
            ※「入力内容確認」を押すと、確認画面に内容が表示されます。送信は確認画面で行います。
          </p>

          <p className="text-xs text-muted-foreground">
            採用へのご応募は、
            <Link
              href="/recruit"
              className="font-medium text-slate-900 underline underline-offset-2 hover:opacity-70"
            >
              採用情報ページ
            </Link>
            の専用エントリーフォームをご利用ください。
          </p>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
          >
            入力内容確認
          </button>
        </form>
      )}
    </div>
  );
}
