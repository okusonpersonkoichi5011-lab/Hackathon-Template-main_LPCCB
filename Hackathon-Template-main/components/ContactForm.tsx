"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  EMAIL_RE,
  FieldError,
  FieldRow,
  fetchAddressFromPostalCode,
  HIRAGANA_RE,
  inputClass,
  PHONE_RE,
} from "@/components/form-utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Lang } from "@/lib/i18n/types";

/**
 * お問い合わせフォーム（入力 → 確認 → 完了 の3段階・送信なしデモ・日英対応）
 * - 必須=赤・任意=緑のバッジ付き 3 カラム行レイアウト
 * - 姓名・ふりがな分割／電話番号 1 行／住所必須（郵便番号・都道府県・市区町村・字名番地）
 * - 郵便番号を 7 桁入力すると住所が自動で入る（zipcloud API）
 * - 各項目下に赤字エラー、入力修正で自動クリア
 *
 * 言語切替時はラベル・プレースホルダー・エラーメッセージ・ボタン文言の全てが切り替わります。
 * 英語表示時は「ふりがな」フィールドを非表示にします（英語圏ユーザには不要のため）。
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

/** 言語ごとの文言バンドル */
function getTexts(lang: Lang) {
  const isEn = lang === "en";
  return {
    // ラベル
    name: isEn ? "Name" : "お名前",
    lastName: isEn ? "Family name" : "姓",
    firstName: isEn ? "Given name" : "名",
    kana: isEn ? "Furigana (Japanese reading)" : "ふりがな",
    lastNameKana: isEn ? "Family name (hiragana)" : "せい",
    firstNameKana: isEn ? "Given name (hiragana)" : "めい",
    email: isEn ? "Email address" : "メールアドレス",
    company: isEn ? "Company name" : "御社名",
    phone: isEn ? "Phone number" : "電話番号",
    postalCode: isEn ? "Postal code" : "郵便番号",
    prefecture: isEn ? "Prefecture / State" : "都道府県",
    city: isEn ? "City / Ward" : "市区町村",
    streetAddress: isEn ? "Street address" : "字名・番地",
    buildingName: isEn ? "Building / Company" : "建物名・会社名",
    subject: isEn ? "Subject" : "件名",
    message: isEn ? "Message" : "お問い合わせ内容",
    // プレースホルダー
    phLastName: isEn ? "e.g. Smith" : "例：山田",
    phFirstName: isEn ? "e.g. John" : "例：太郎",
    phLastNameKana: "例：やまだ",
    phFirstNameKana: "例：たろう",
    phEmail: "you@example.com",
    phCompany: isEn ? "Your Company Inc." : "株式会社〇〇",
    phPhone: isEn ? "+81 90 1234 5678" : "090-1234-5678",
    phPostal: isEn ? "e.g. 1500043" : "例：1500043",
    phPrefecture: isEn ? "e.g. Tokyo" : "例：東京都",
    phCity: isEn ? "e.g. Shibuya-ku Dogenzaka" : "例：渋谷区道玄坂",
    phStreet: isEn ? "e.g. 1-19-11" : "例：1-19-11",
    phBuilding: isEn
      ? "e.g. Kotobuki Dogenzaka Bldg 8F"
      : "例：寿道玄坂ビル 8F／株式会社〇〇 など",
    phSubject: isEn ? "Subject of your inquiry" : "お問い合わせの件名",
    phMessage: isEn
      ? "Please share your current challenges or preferred schedule."
      : "現状の課題やご希望のスケジュールなどをご記入ください。",
    // ヒント・注意
    postalHint: isEn ? "Enter digits only, no hyphen." : "ハイフンを入れずに入力してください",
    postalAutoFill: isEn
      ? "▼ When you enter the postal code, part of the address is filled automatically."
      : "▼ 郵便番号を入力すると、住所の一部が自動的に入力されます",
    postalHelpLink: isEn ? "Look up postal codes ↗" : "郵便番号がわからない方はこちら ↗",
    streetHint: isEn
      ? "* Please make sure the address includes the building/lot number."
      : "※ ご注意：ご住所が番地まで入力されているか、ご確認ください。",
    submitNote: isEn
      ? "* Pressing “Review entries” shows a confirmation screen. Submission happens on that screen."
      : "※「入力内容確認」を押すと、確認画面に内容が表示されます。送信は確認画面で行います。",
    recruitNote: isEn
      ? "For job applications, please use the dedicated form on the "
      : "採用へのご応募は、",
    recruitNoteLink: isEn ? "Careers page" : "採用情報ページ",
    recruitNoteAfter: isEn
      ? "."
      : "の専用エントリーフォームをご利用ください。",
    // ボタン
    review: isEn ? "Review entries" : "入力内容確認",
    sendDemo: isEn
      ? "Send (demo: nothing is actually sent)"
      : "送信する（デモ：実際には送信されません）",
    edit: isEn ? "Edit" : "修正する",
    sendAnother: isEn ? "Send another inquiry" : "続けて別のお問い合わせを送る",
    // 確認画面
    confirmIntro: isEn
      ? "We will send the following content. To change any item, press “Edit”."
      : "以下の内容で送信します。修正したい項目があれば「修正する」を押してください。",
    confirmLabels: {
      name: isEn ? "Name" : "お名前",
      kana: isEn ? "Furigana" : "ふりがな",
      email: isEn ? "Email" : "メールアドレス",
      company: isEn ? "Company" : "御社名",
      phone: isEn ? "Phone" : "電話番号",
      address: isEn ? "Address" : "住所",
      subject: isEn ? "Subject" : "件名",
      message: isEn ? "Message" : "お問い合わせ内容",
    },
    notEntered: isEn ? "(not entered)" : "（未入力）",
    // 完了画面
    doneTitle: isEn ? "Submission complete (demo)" : "送信が完了しました（デモ）",
    doneBody: isEn
      ? "Nothing was actually sent. In production, connect this form to a backend such as Formspree or Server Actions."
      : "実際には送信されていません。本番運用時は Formspree や Server Actions などのバックエンドへ接続してください。",
    // エラーメッセージ
    err: {
      lastName: isEn ? "Please enter your family name." : "姓を入力してください。",
      firstName: isEn ? "Please enter your given name." : "名を入力してください。",
      lastNameKana: isEn
        ? "Please enter your family name in hiragana."
        : "せい(ひらがな)を入力してください。",
      lastNameKanaInvalid: isEn
        ? "Please use hiragana characters."
        : "ひらがなで入力してください。",
      firstNameKana: isEn
        ? "Please enter your given name in hiragana."
        : "めい(ひらがな)を入力してください。",
      firstNameKanaInvalid: isEn
        ? "Please use hiragana characters."
        : "ひらがなで入力してください。",
      email: isEn ? "Please enter your email address." : "メールアドレスを入力してください。",
      emailInvalid: isEn
        ? "Please enter a valid email address (e.g. you@example.com)."
        : "メールアドレスの形式で入力してください。(例:you@example.com)",
      phoneInvalid: isEn
        ? "Please use digits, hyphens, etc. only."
        : "電話番号は半角数字・ハイフン等で入力してください。",
      postalCode: isEn ? "Please enter your postal code." : "郵便番号を入力してください。",
      postalCodeInvalid: isEn
        ? "Postal code must be 7 digits."
        : "郵便番号は7桁の半角数字で入力してください。",
      prefecture: isEn ? "Please enter the prefecture / state." : "都道府県を入力してください。",
      city: isEn ? "Please enter the city / ward." : "市区町村を入力してください。",
      streetAddress: isEn ? "Please enter the street address." : "字名・番地を入力してください。",
      subject: isEn ? "Please enter a subject." : "件名を入力してください。",
      message: isEn ? "Please enter your message." : "お問い合わせ内容を入力してください。",
    },
  };
}

const validate = (data: ContactData, lang: Lang): ContactErrors => {
  const e: ContactErrors = {};
  const t = getTexts(lang).err;
  if (!data.lastName.trim()) e.lastName = t.lastName;
  if (!data.firstName.trim()) e.firstName = t.firstName;
  // ふりがなは日本語表示時のみ必須チェック（英語表示時は対象フィールドが無いため）
  if (lang === "ja") {
    if (!data.lastNameKana.trim()) e.lastNameKana = t.lastNameKana;
    else if (!HIRAGANA_RE.test(data.lastNameKana)) e.lastNameKana = t.lastNameKanaInvalid;
    if (!data.firstNameKana.trim()) e.firstNameKana = t.firstNameKana;
    else if (!HIRAGANA_RE.test(data.firstNameKana)) e.firstNameKana = t.firstNameKanaInvalid;
  }
  if (!data.email.trim()) e.email = t.email;
  else if (!EMAIL_RE.test(data.email)) e.email = t.emailInvalid;
  if (data.phone && !PHONE_RE.test(data.phone)) e.phone = t.phoneInvalid;
  const postalDigits = data.postalCode.replace(/[^0-9]/g, "");
  if (!data.postalCode.trim()) e.postalCode = t.postalCode;
  else if (postalDigits.length !== 7) e.postalCode = t.postalCodeInvalid;
  if (!data.prefecture.trim()) e.prefecture = t.prefecture;
  if (!data.city.trim()) e.city = t.city;
  if (!data.streetAddress.trim()) e.streetAddress = t.streetAddress;
  if (!data.subject.trim()) e.subject = t.subject;
  if (!data.message.trim()) e.message = t.message;
  return e;
};

export function ContactForm() {
  const { lang } = useLanguage();
  // 言語が変わった時だけ文言バンドルを再生成（毎レンダーでの不要な再構築を回避）
  const texts = useMemo(() => getTexts(lang), [lang]);
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
    const v = validate(data, lang);
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
    { label: texts.confirmLabels.name, value: `${data.lastName} ${data.firstName}`.trim() },
    ...(lang === "ja"
      ? [
          {
            label: texts.confirmLabels.kana,
            value: `${data.lastNameKana} ${data.firstNameKana}`.trim(),
          },
        ]
      : []),
    { label: texts.confirmLabels.email, value: data.email },
    { label: texts.confirmLabels.company, value: data.company },
    { label: texts.confirmLabels.phone, value: data.phone },
    {
      label: texts.confirmLabels.address,
      value: [
        data.postalCode ? (lang === "en" ? data.postalCode : `〒${data.postalCode}`) : "",
        `${data.prefecture}${data.city}${data.streetAddress}`,
        data.buildingName,
      ]
        .filter((s) => s && s.trim())
        .join("\n"),
    },
    { label: texts.confirmLabels.subject, value: data.subject },
    { label: texts.confirmLabels.message, value: data.message },
  ];

  return (
    <div ref={containerRef} className="scroll-mt-24">
      {step === "done" ? (
        // 完了画面（デモ）
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-900">{texts.doneTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{texts.doneBody}</p>
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
            {texts.sendAnother}
          </button>
        </div>
      ) : step === "confirm" ? (
        // 確認画面
        <form onSubmit={handleSendSubmit} className="space-y-6">
          <p className="text-sm text-muted-foreground">{texts.confirmIntro}</p>
          <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {confirmRows.map(({ label, value }) => (
              <div
                key={label}
                className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5"
              >
                <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                <dd className="whitespace-pre-wrap break-words text-sm text-slate-900">
                  {value || <span className="text-muted-foreground">{texts.notEntered}</span>}
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              {texts.sendDemo}
            </button>
            <button
              type="button"
              onClick={backToEdit}
              className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-3 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-primary hover:text-slate-900"
            >
              {texts.edit}
            </button>
          </div>
        </form>
      ) : (
        // 入力画面
        <form
          onSubmit={handleInputSubmit}
          className="divide-y divide-border border-y border-border"
          noValidate
        >
          {/* お名前（姓・名） */}
          <FieldRow badge="required" label={texts.name} lang={lang}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="flex items-start gap-2">
                <label htmlFor="lastName" className="w-10 shrink-0 pt-2 text-sm text-slate-700">
                  {texts.lastName}
                </label>
                <div className="flex-1">
                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    maxLength={30}
                    placeholder={texts.phLastName}
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
                  {texts.firstName}
                </label>
                <div className="flex-1">
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    maxLength={30}
                    placeholder={texts.phFirstName}
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

          {/* ふりがな（日本語表示時のみ） */}
          {lang === "ja" && (
            <FieldRow badge="required" label={texts.kana} lang={lang}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div className="flex items-start gap-2">
                  <label
                    htmlFor="lastNameKana"
                    className="w-10 shrink-0 pt-2 text-sm text-slate-700"
                  >
                    {texts.lastNameKana}
                  </label>
                  <div className="flex-1">
                    <input
                      id="lastNameKana"
                      type="text"
                      maxLength={40}
                      placeholder={texts.phLastNameKana}
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
                    {texts.firstNameKana}
                  </label>
                  <div className="flex-1">
                    <input
                      id="firstNameKana"
                      type="text"
                      maxLength={40}
                      placeholder={texts.phFirstNameKana}
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
          )}

          {/* メールアドレス */}
          <FieldRow badge="required" label={texts.email} htmlFor="email" lang={lang}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              placeholder={texts.phEmail}
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass(!!errors.email)}
            />
            <FieldError id="email-error" error={errors.email} />
          </FieldRow>

          {/* 会社名 */}
          <FieldRow badge="optional" label={texts.company} htmlFor="company" lang={lang}>
            <input
              id="company"
              type="text"
              autoComplete="organization"
              maxLength={100}
              placeholder={texts.phCompany}
              value={data.company}
              onChange={(e) => set("company", e.target.value)}
              className={inputClass(false)}
            />
          </FieldRow>

          {/* 電話番号 */}
          <FieldRow badge="optional" label={texts.phone} htmlFor="phone" lang={lang}>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              maxLength={20}
              placeholder={texts.phPhone}
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={inputClass(!!errors.phone)}
            />
            <FieldError id="phone-error" error={errors.phone} />
          </FieldRow>

          {/* 郵便番号 */}
          <FieldRow badge="required" label={texts.postalCode} htmlFor="postalCode" lang={lang}>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id="postalCode"
                type="text"
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={8}
                placeholder={texts.phPostal}
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
                {texts.postalHelpLink}
              </a>
            </div>
            <p id="postalCode-hint" className="mt-1 text-xs text-muted-foreground">
              {texts.postalHint}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{texts.postalAutoFill}</p>
            <FieldError id="postalCode-error" error={errors.postalCode} />
          </FieldRow>

          {/* 都道府県 */}
          <FieldRow badge="required" label={texts.prefecture} htmlFor="prefecture" lang={lang}>
            <input
              id="prefecture"
              type="text"
              autoComplete="address-level1"
              maxLength={20}
              placeholder={texts.phPrefecture}
              value={data.prefecture}
              onChange={(e) => set("prefecture", e.target.value)}
              aria-invalid={!!errors.prefecture}
              aria-describedby={errors.prefecture ? "prefecture-error" : undefined}
              className={`${inputClass(!!errors.prefecture)} max-w-[16rem]`}
            />
            <FieldError id="prefecture-error" error={errors.prefecture} />
          </FieldRow>

          {/* 市区町村 */}
          <FieldRow badge="required" label={texts.city} htmlFor="city" lang={lang}>
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              maxLength={50}
              placeholder={texts.phCity}
              value={data.city}
              onChange={(e) => set("city", e.target.value)}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error" : undefined}
              className={inputClass(!!errors.city)}
            />
            <FieldError id="city-error" error={errors.city} />
          </FieldRow>

          {/* 字名・番地 */}
          <FieldRow
            badge="required"
            label={texts.streetAddress}
            htmlFor="streetAddress"
            lang={lang}
          >
            <input
              id="streetAddress"
              type="text"
              autoComplete="street-address"
              maxLength={100}
              placeholder={texts.phStreet}
              value={data.streetAddress}
              onChange={(e) => set("streetAddress", e.target.value)}
              aria-invalid={!!errors.streetAddress}
              aria-describedby={errors.streetAddress ? "streetAddress-error" : "streetAddress-hint"}
              className={inputClass(!!errors.streetAddress)}
            />
            <p id="streetAddress-hint" className="mt-1 text-xs text-muted-foreground">
              {texts.streetHint}
            </p>
            <FieldError id="streetAddress-error" error={errors.streetAddress} />
          </FieldRow>

          {/* 建物名・会社名 */}
          <FieldRow
            badge="optional"
            label={texts.buildingName}
            htmlFor="buildingName"
            lang={lang}
          >
            <input
              id="buildingName"
              type="text"
              maxLength={100}
              placeholder={texts.phBuilding}
              value={data.buildingName}
              onChange={(e) => set("buildingName", e.target.value)}
              className={inputClass(false)}
            />
          </FieldRow>

          {/* 件名 */}
          <FieldRow badge="required" label={texts.subject} htmlFor="subject" lang={lang}>
            <input
              id="subject"
              type="text"
              maxLength={120}
              placeholder={texts.phSubject}
              value={data.subject}
              onChange={(e) => set("subject", e.target.value)}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "subject-error" : undefined}
              className={inputClass(!!errors.subject)}
            />
            <FieldError id="subject-error" error={errors.subject} />
          </FieldRow>

          {/* お問い合わせ内容 */}
          <FieldRow badge="required" label={texts.message} htmlFor="message" lang={lang}>
            <textarea
              id="message"
              rows={7}
              maxLength={2000}
              placeholder={texts.phMessage}
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
            <p className="text-xs text-muted-foreground">{texts.submitNote}</p>
            <p className="text-xs text-muted-foreground">
              {texts.recruitNote}
              <Link
                href="/recruit"
                className="font-medium text-slate-900 underline underline-offset-2 hover:opacity-70"
              >
                {texts.recruitNoteLink}
              </Link>
              {texts.recruitNoteAfter}
            </p>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              {texts.review}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
