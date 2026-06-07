"use client";

import Link from "next/link";
import { useRef, useState } from "react";

/**
 * 採用エントリーフォーム（入力 → 確認 → 完了 の3段階・送信なしデモ）
 * - 自前バリデーションで「必須」「形式」をチェックし、エラー文を赤字で各項目の下に表示
 * - form には noValidate を指定し、ブラウザ標準のポップアップを抑止
 * - 入力修正したらその項目のエラーは自動で消える
 * - 画面切り替え時はフォーム上端へスムーズスクロール
 */

type RecruitData = {
  name: string;
  furigana: string;
  email: string;
  phone: string;
  age: string;
  startDate: string;
  address: string;
  employmentType: "fulltime" | "parttime";
  career: string;
  motivation: string;
};

type RecruitErrors = Partial<Record<keyof RecruitData, string>>;

const initialData: RecruitData = {
  name: "",
  furigana: "",
  email: "",
  phone: "",
  age: "",
  startDate: "",
  address: "",
  employmentType: "fulltime",
  career: "",
  motivation: "",
};

const employmentTypeLabel: Record<RecruitData["employmentType"], string> = {
  fulltime: "正社員",
  parttime: "パート・アルバイト",
};

/** 確認画面の項目順とラベル */
const fields: { key: keyof RecruitData; label: string }[] = [
  { key: "name", label: "お名前" },
  { key: "furigana", label: "ふりがな" },
  { key: "email", label: "メールアドレス" },
  { key: "phone", label: "電話番号" },
  { key: "age", label: "年齢" },
  { key: "startDate", label: "就業可能時期" },
  { key: "address", label: "住所" },
  { key: "employmentType", label: "ご希望の雇用形態" },
  { key: "career", label: "職務経歴" },
  { key: "motivation", label: "志望動機・PR 事項など" },
];

// メールアドレスの簡易検証
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 電話番号：半角数字・ハイフン・プラス・括弧・空白のみ
const PHONE_RE = /^[0-9\-+()\s]+$/;
// ひらがな（と全角空白・半角空白）のみ
const HIRAGANA_RE = /^[぀-ゟ\s　]+$/;

const validate = (data: RecruitData): RecruitErrors => {
  const e: RecruitErrors = {};
  if (!data.name.trim()) e.name = "お名前を入力してください。";

  if (!data.furigana.trim()) {
    e.furigana = "ふりがなを入力してください。";
  } else if (!HIRAGANA_RE.test(data.furigana)) {
    e.furigana = "ふりがなはひらがなで入力してください。";
  }

  if (!data.email.trim()) {
    e.email = "メールアドレスを入力してください。";
  } else if (!EMAIL_RE.test(data.email)) {
    e.email = "メールアドレスの形式で入力してください。(例:you@example.com)";
  }

  if (!data.phone.trim()) {
    e.phone = "電話番号を入力してください。";
  } else if (!PHONE_RE.test(data.phone)) {
    e.phone = "電話番号は半角数字・ハイフン等で入力してください。";
  }

  // 年齢は任意。入力された場合のみ範囲チェック
  if (data.age.trim()) {
    const n = Number(data.age);
    if (!Number.isInteger(n) || n < 16 || n > 99) {
      e.age = "年齢は16〜99の半角数字で入力してください。";
    }
  }

  if (!data.startDate.trim()) e.startDate = "就業可能時期を入力してください。";

  // 住所は任意のためエラーなし
  // employmentType は常にどちらか選択されているのでエラーなし

  if (!data.career.trim()) e.career = "職務経歴を入力してください。";
  if (!data.motivation.trim())
    e.motivation = "志望動機・PR 事項を入力してください。";

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

export function RecruitForm() {
  const [data, setData] = useState<RecruitData>(initialData);
  const [step, setStep] = useState<"input" | "confirm" | "done">("input");
  const [errors, setErrors] = useState<RecruitErrors>({});
  const containerRef = useRef<HTMLDivElement>(null);

  /** 値を更新し、その項目のエラーがあればクリアする */
  const set = <K extends keyof RecruitData>(key: K, value: RecruitData[K]) => {
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

  const renderValue = (key: keyof RecruitData): React.ReactNode => {
    const raw = data[key];
    if (key === "employmentType") {
      return employmentTypeLabel[data.employmentType];
    }
    if (!raw) return <span className="text-muted-foreground">（未入力）</span>;
    return raw;
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
            続けて別の応募を入力する
          </button>
        </div>
      ) : step === "confirm" ? (
        // 確認画面
        <form onSubmit={handleSendSubmit} className="space-y-6">
          <p className="text-sm text-muted-foreground">
            以下の内容で応募します。修正したい項目があれば「修正する」を押してください。
          </p>
          <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {fields.map(({ key, label }) => (
              <div
                key={key}
                className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5"
              >
                <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                <dd className="whitespace-pre-wrap break-words text-sm text-slate-900">
                  {renderValue(key)}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
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
          <div className="grid gap-5 sm:grid-cols-2">
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
                ふりがな {requiredMark}
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
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
              <label htmlFor="phone" className={labelClass}>
                電話番号 {requiredMark}
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
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="age" className={labelClass}>
                年齢
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min={16}
                max={99}
                placeholder="例：26"
                value={data.age}
                onChange={(e) => set("age", e.target.value)}
                aria-invalid={!!errors.age}
                aria-describedby={errors.age ? "age-error" : undefined}
                className={inputClass(!!errors.age)}
              />
              <FieldError id="age-error" error={errors.age} />
            </div>
            <div>
              <label htmlFor="startDate" className={labelClass}>
                就業可能時期 {requiredMark}
              </label>
              <input
                id="startDate"
                name="startDate"
                type="text"
                maxLength={60}
                placeholder="例：2026年7月〜、即日 など"
                value={data.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                aria-invalid={!!errors.startDate}
                aria-describedby={errors.startDate ? "startDate-error" : undefined}
                className={inputClass(!!errors.startDate)}
              />
              <FieldError id="startDate-error" error={errors.startDate} />
            </div>
          </div>

          <div>
            <label htmlFor="address" className={labelClass}>
              住所
            </label>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              maxLength={200}
              placeholder="〒150-0043 東京都渋谷区道玄坂…"
              value={data.address}
              onChange={(e) => set("address", e.target.value)}
              className={inputClass(false)}
            />
          </div>

          <div>
            <label htmlFor="employmentType" className={labelClass}>
              ご希望の雇用形態 {requiredMark}
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={data.employmentType}
              onChange={(e) => set("employmentType", e.target.value as RecruitData["employmentType"])}
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-900"
            >
              <option value="fulltime">正社員</option>
              <option value="parttime">パート・アルバイト</option>
            </select>
          </div>

          <div>
            <label htmlFor="career" className={labelClass}>
              職務経歴 {requiredMark}
            </label>
            <textarea
              id="career"
              name="career"
              rows={4}
              maxLength={2000}
              placeholder="これまでのご職業・担当業務などを簡単にご記入ください。"
              value={data.career}
              onChange={(e) => set("career", e.target.value)}
              aria-invalid={!!errors.career}
              aria-describedby={errors.career ? "career-error" : undefined}
              className={inputClass(!!errors.career)}
            />
            <FieldError id="career-error" error={errors.career} />
          </div>

          <div>
            <label htmlFor="motivation" className={labelClass}>
              志望動機・PR 事項など {requiredMark}
            </label>
            <textarea
              id="motivation"
              name="motivation"
              rows={5}
              maxLength={2000}
              placeholder="志望動機やアピールしたい点などをご記入ください。"
              value={data.motivation}
              onChange={(e) => set("motivation", e.target.value)}
              aria-invalid={!!errors.motivation}
              aria-describedby={errors.motivation ? "motivation-error" : undefined}
              className={inputClass(!!errors.motivation)}
            />
            <FieldError id="motivation-error" error={errors.motivation} />
          </div>

          <p className="text-xs text-muted-foreground">
            ※「入力内容確認」を押すと、確認画面に内容が表示されます。送信は確認画面で行います。
          </p>

          <p className="text-xs text-muted-foreground">
            採用以外（案件・協業など）のご相談は、
            <Link
              href="/contact"
              className="font-medium text-slate-900 underline underline-offset-2 hover:opacity-70"
            >
              お問い合わせページ
            </Link>
            をご利用ください。
          </p>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md sm:w-auto"
          >
            入力内容確認
          </button>
        </form>
      )}
    </div>
  );
}
