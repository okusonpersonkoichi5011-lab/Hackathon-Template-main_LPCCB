"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  EMAIL_RE,
  FieldError,
  FieldRow,
  fetchAddressFromPostalCode,
  HIRAGANA_RE,
  inputClass,
  PHONE_RE,
} from "@/components/form-utils";

/**
 * お問い合わせフォーム（入力 → 確認 → 完了 の3段階・送信なしデモ）
 * - 必須=赤・任意=緑のバッジ付き 3 カラム行レイアウト
 * - 姓名・ふりがな分割／電話番号 1 行／住所必須（郵便番号・都道府県・市区町村・字名番地）
 * - 郵便番号を 7 桁入力すると住所が自動で入る（zipcloud API）
 * - 各項目下に赤字エラー、入力修正で自動クリア
 */

type ContactData = {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  email: string;
  company: string;
  phone: string;
  postalCode: string;
  prefecture: string;
  city: string;
  streetAddress: string;
  buildingName: string;
  subject: string;
  message: string;
};

type ContactErrors = Partial<Record<keyof ContactData, string>>;

const initialData: ContactData = {
  lastName: "",
  firstName: "",
  lastNameKana: "",
  firstNameKana: "",
  email: "",
  company: "",
  phone: "",
  postalCode: "",
  prefecture: "",
  city: "",
  streetAddress: "",
  buildingName: "",
  subject: "",
  message: "",
};

const validate = (data: ContactData): ContactErrors => {
  const e: ContactErrors = {};
  if (!data.lastName.trim()) e.lastName = "姓を入力してください。";
  if (!data.firstName.trim()) e.firstName = "名を入力してください。";
  if (!data.lastNameKana.trim()) e.lastNameKana = "せい(ひらがな)を入力してください。";
  else if (!HIRAGANA_RE.test(data.lastNameKana)) e.lastNameKana = "ひらがなで入力してください。";
  if (!data.firstNameKana.trim()) e.firstNameKana = "めい(ひらがな)を入力してください。";
  else if (!HIRAGANA_RE.test(data.firstNameKana)) e.firstNameKana = "ひらがなで入力してください。";
  if (!data.email.trim()) e.email = "メールアドレスを入力してください。";
  else if (!EMAIL_RE.test(data.email))
    e.email = "メールアドレスの形式で入力してください。(例:you@example.com)";
  if (data.phone && !PHONE_RE.test(data.phone))
    e.phone = "電話番号は半角数字・ハイフン等で入力してください。";
  const postalDigits = data.postalCode.replace(/[^0-9]/g, "");
  if (!data.postalCode.trim()) e.postalCode = "郵便番号を入力してください。";
  else if (postalDigits.length !== 7)
    e.postalCode = "郵便番号は7桁の半角数字で入力してください。";
  if (!data.prefecture.trim()) e.prefecture = "都道府県を入力してください。";
  if (!data.city.trim()) e.city = "市区町村を入力してください。";
  if (!data.streetAddress.trim()) e.streetAddress = "字名・番地を入力してください。";
  if (!data.subject.trim()) e.subject = "件名を入力してください。";
  if (!data.message.trim()) e.message = "お問い合わせ内容を入力してください。";
  return e;
};

export function ContactForm() {
  const [data, setData] = useState<ContactData>(initialData);
  const [step, setStep] = useState<"input" | "confirm" | "done">("input");
  const [errors, setErrors] = useState<ContactErrors>({});
  const containerRef = useRef<HTMLDivElement>(null);

  /** 値を更新し、その項目のエラーがあればクリア */
  const set = <K extends keyof ContactData>(key: K, value: ContactData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  /** 郵便番号変更時：7桁になったら住所APIを叩いて自動入力 */
  const onPostalCodeChange = (value: string) => {
    set("postalCode", value);
    const digits = value.replace(/[^0-9]/g, "");
    if (digits.length === 7) {
      void fetchAddressFromPostalCode(value).then((result) => {
        if (result) {
          setData((prev) => ({
            ...prev,
            prefecture: result.prefecture,
            city: result.city,
          }));
          setErrors((prev) => {
            const next = { ...prev };
            delete next.prefecture;
            delete next.city;
            return next;
          });
        }
      });
    }
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
    // ★本番ではここで API/Server Actions に送信。今はデモのため送信しません。
    setStep("done");
    scrollToFormTop();
  };

  const backToEdit = () => {
    setStep("input");
    scrollToFormTop();
  };

  // 確認画面：複数欄をまとめた表示
  const confirmRows: { label: string; value: string }[] = [
    { label: "お名前", value: `${data.lastName} ${data.firstName}`.trim() },
    { label: "ふりがな", value: `${data.lastNameKana} ${data.firstNameKana}`.trim() },
    { label: "メールアドレス", value: data.email },
    { label: "御社名", value: data.company },
    { label: "電話番号", value: data.phone },
    {
      label: "住所",
      value: [
        data.postalCode ? `〒${data.postalCode}` : "",
        `${data.prefecture}${data.city}${data.streetAddress}`,
        data.buildingName,
      ]
        .filter((s) => s && s.trim())
        .join("\n"),
    },
    { label: "件名", value: data.subject },
    { label: "お問い合わせ内容", value: data.message },
  ];

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
            {confirmRows.map(({ label, value }) => (
              <div
                key={label}
                className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5"
              >
                <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                <dd className="whitespace-pre-wrap break-words text-sm text-slate-900">
                  {value || <span className="text-muted-foreground">（未入力）</span>}
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
        // 入力画面（3カラム行レイアウト）
        <form
          onSubmit={handleInputSubmit}
          className="divide-y divide-border border-y border-border"
          noValidate
        >
          {/* お名前（姓・名） */}
          <FieldRow badge="required" label="お名前">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="flex items-start gap-2">
                <label htmlFor="lastName" className="w-10 shrink-0 pt-2 text-sm text-slate-700">
                  姓
                </label>
                <div className="flex-1">
                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    maxLength={30}
                    placeholder="例：山田"
                    value={data.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    className={inputClass(!!errors.lastName)}
                  />
                  <FieldError id="lastName-error" error={errors.lastName} />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <label htmlFor="firstName" className="w-10 shrink-0 pt-2 text-sm text-slate-700">
                  名
                </label>
                <div className="flex-1">
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    maxLength={30}
                    placeholder="例：太郎"
                    value={data.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    className={inputClass(!!errors.firstName)}
                  />
                  <FieldError id="firstName-error" error={errors.firstName} />
                </div>
              </div>
            </div>
          </FieldRow>

          {/* ふりがな（せい・めい） */}
          <FieldRow badge="required" label="ふりがな">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="flex items-start gap-2">
                <label
                  htmlFor="lastNameKana"
                  className="w-10 shrink-0 pt-2 text-sm text-slate-700"
                >
                  せい
                </label>
                <div className="flex-1">
                  <input
                    id="lastNameKana"
                    type="text"
                    maxLength={40}
                    placeholder="例：やまだ"
                    value={data.lastNameKana}
                    onChange={(e) => set("lastNameKana", e.target.value)}
                    aria-invalid={!!errors.lastNameKana}
                    aria-describedby={errors.lastNameKana ? "lastNameKana-error" : undefined}
                    className={inputClass(!!errors.lastNameKana)}
                  />
                  <FieldError id="lastNameKana-error" error={errors.lastNameKana} />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <label
                  htmlFor="firstNameKana"
                  className="w-10 shrink-0 pt-2 text-sm text-slate-700"
                >
                  めい
                </label>
                <div className="flex-1">
                  <input
                    id="firstNameKana"
                    type="text"
                    maxLength={40}
                    placeholder="例：たろう"
                    value={data.firstNameKana}
                    onChange={(e) => set("firstNameKana", e.target.value)}
                    aria-invalid={!!errors.firstNameKana}
                    aria-describedby={errors.firstNameKana ? "firstNameKana-error" : undefined}
                    className={inputClass(!!errors.firstNameKana)}
                  />
                  <FieldError id="firstNameKana-error" error={errors.firstNameKana} />
                </div>
              </div>
            </div>
          </FieldRow>

          {/* メールアドレス */}
          <FieldRow badge="required" label="メールアドレス" htmlFor="email">
            <input
              id="email"
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
          </FieldRow>

          {/* 御社名 */}
          <FieldRow badge="optional" label="御社名" htmlFor="company">
            <input
              id="company"
              type="text"
              autoComplete="organization"
              maxLength={100}
              placeholder="株式会社〇〇"
              value={data.company}
              onChange={(e) => set("company", e.target.value)}
              className={inputClass(false)}
            />
          </FieldRow>

          {/* 電話番号（住所のように1行で表示） */}
          <FieldRow badge="optional" label="電話番号" htmlFor="phone">
            <input
              id="phone"
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
          </FieldRow>

          {/* 郵便番号（7桁で住所自動入力） */}
          <FieldRow badge="required" label="郵便番号" htmlFor="postalCode">
            <div className="flex flex-wrap items-center gap-3">
              <input
                id="postalCode"
                type="text"
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={8}
                placeholder="例：1500043"
                value={data.postalCode}
                onChange={(e) => onPostalCodeChange(e.target.value)}
                aria-invalid={!!errors.postalCode}
                aria-describedby={errors.postalCode ? "postalCode-error" : "postalCode-hint"}
                className={`${inputClass(!!errors.postalCode)} max-w-[10rem]`}
              />
              <a
                href="https://www.post.japanpost.jp/zipcode/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-700 underline underline-offset-2 hover:text-slate-900"
              >
                郵便番号がわからない方はこちら ↗
              </a>
            </div>
            <p id="postalCode-hint" className="mt-1 text-xs text-muted-foreground">
              ハイフンを入れずに入力してください
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ▼ 郵便番号を入力すると、住所の一部が自動的に入力されます
            </p>
            <FieldError id="postalCode-error" error={errors.postalCode} />
          </FieldRow>

          {/* 都道府県（自動入力／手修正可） */}
          <FieldRow badge="required" label="都道府県" htmlFor="prefecture">
            <input
              id="prefecture"
              type="text"
              autoComplete="address-level1"
              maxLength={20}
              placeholder="例：東京都"
              value={data.prefecture}
              onChange={(e) => set("prefecture", e.target.value)}
              aria-invalid={!!errors.prefecture}
              aria-describedby={errors.prefecture ? "prefecture-error" : undefined}
              className={`${inputClass(!!errors.prefecture)} max-w-[16rem]`}
            />
            <FieldError id="prefecture-error" error={errors.prefecture} />
          </FieldRow>

          {/* 市区町村（自動入力／手修正可） */}
          <FieldRow badge="required" label="市区町村" htmlFor="city">
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              maxLength={50}
              placeholder="例：渋谷区道玄坂"
              value={data.city}
              onChange={(e) => set("city", e.target.value)}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error" : undefined}
              className={inputClass(!!errors.city)}
            />
            <FieldError id="city-error" error={errors.city} />
          </FieldRow>

          {/* 字名・番地 */}
          <FieldRow badge="required" label="字名・番地" htmlFor="streetAddress">
            <input
              id="streetAddress"
              type="text"
              autoComplete="street-address"
              maxLength={100}
              placeholder="例：1-19-11"
              value={data.streetAddress}
              onChange={(e) => set("streetAddress", e.target.value)}
              aria-invalid={!!errors.streetAddress}
              aria-describedby={errors.streetAddress ? "streetAddress-error" : "streetAddress-hint"}
              className={inputClass(!!errors.streetAddress)}
            />
            <p id="streetAddress-hint" className="mt-1 text-xs text-muted-foreground">
              ※ ご注意：ご住所が番地まで入力されているか、ご確認ください。
            </p>
            <FieldError id="streetAddress-error" error={errors.streetAddress} />
          </FieldRow>

          {/* 建物名・会社名（任意） */}
          <FieldRow badge="optional" label="建物名・会社名" htmlFor="buildingName">
            <input
              id="buildingName"
              type="text"
              maxLength={100}
              placeholder="例：寿道玄坂ビル 8F／株式会社〇〇 など"
              value={data.buildingName}
              onChange={(e) => set("buildingName", e.target.value)}
              className={inputClass(false)}
            />
          </FieldRow>

          {/* 件名 */}
          <FieldRow badge="required" label="件名" htmlFor="subject">
            <input
              id="subject"
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
          </FieldRow>

          {/* お問い合わせ内容 */}
          <FieldRow badge="required" label="お問い合わせ内容" htmlFor="message">
            <textarea
              id="message"
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
          </FieldRow>

          {/* 注意書きと送信ボタン */}
          <div className="space-y-5 pt-6">
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
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              入力内容確認
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
