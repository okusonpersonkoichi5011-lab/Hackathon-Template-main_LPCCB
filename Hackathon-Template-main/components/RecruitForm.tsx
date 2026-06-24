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
  validatePdfFile,
} from "@/components/form-utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Lang } from "@/lib/i18n/types";

/**
 * 採用エントリーフォーム（入力 → 確認 → 完了・日英対応）
 * - 必須=赤・任意=緑バッジ + 3 カラム行レイアウト
 * - 履歴書 PDF アップロード（3層検証）、職務経歴はテキスト/ファイル切替
 * - 言語切替時はラベル・プレースホルダー・エラー・ボタンの全てが切り替わります
 * - 英語表示時は「ふりがな」フィールドを非表示にします
 */

type EmploymentType = "fulltime-newgrad" | "fulltime-career" | "parttime";
type CareerMode = "text" | "file";

type RecruitData = {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  email: string;
  phone: string;
  age: string;
  startDate: string;
  postalCode: string;
  prefecture: string;
  city: string;
  streetAddress: string;
  buildingName: string;
  employmentType: EmploymentType;
  resumeFile: File | null;
  careerMode: CareerMode;
  career: string;
  careerFile: File | null;
  motivation: string;
};

type RecruitErrors = Partial<Record<keyof RecruitData, string>>;

const initialData: RecruitData = {
  lastName: "",
  firstName: "",
  lastNameKana: "",
  firstNameKana: "",
  email: "",
  phone: "",
  age: "",
  startDate: "",
  postalCode: "",
  prefecture: "",
  city: "",
  streetAddress: "",
  buildingName: "",
  employmentType: "fulltime-career",
  resumeFile: null,
  careerMode: "text",
  career: "",
  careerFile: null,
  motivation: "",
};

const isNewGrad = (t: EmploymentType): boolean => t === "fulltime-newgrad";

const FILE_ACCEPT = ".pdf,application/pdf";

function getTexts(lang: Lang) {
  const isEn = lang === "en";
  return {
    // ラベル
    name: isEn ? "Name" : "お名前",
    lastName: isEn ? "Family name" : "姓",
    firstName: isEn ? "Given name" : "名",
    kana: isEn ? "Furigana" : "ふりがな",
    lastNameKana: isEn ? "Family name (hiragana)" : "せい",
    firstNameKana: isEn ? "Given name (hiragana)" : "めい",
    email: isEn ? "Email address" : "メールアドレス",
    phone: isEn ? "Phone number" : "電話番号",
    age: isEn ? "Age" : "年齢",
    startDate: isEn ? "Earliest start date" : "就業可能時期",
    postalCode: isEn ? "Postal code" : "郵便番号",
    prefecture: isEn ? "Prefecture / State" : "都道府県",
    city: isEn ? "City / Ward" : "市区町村",
    streetAddress: isEn ? "Street address" : "字名・番地",
    buildingName: isEn ? "Building / Company" : "建物名・会社名",
    employmentType: isEn ? "Preferred employment type" : "ご希望の雇用形態",
    resume: isEn ? "Resume (CV)" : "履歴書",
    career: isEn ? "Work history" : "職務経歴",
    motivation: isEn ? "Motivation & self-PR" : "志望動機・PR 事項など",

    // 雇用形態の選択肢
    fulltimeNewgrad: isEn ? "Full-time (new graduate)" : "正社員（新卒採用）",
    fulltimeCareer: isEn ? "Full-time (career hire)" : "正社員（キャリア採用）",
    parttime: isEn ? "Part-time" : "パート・アルバイト",
    employmentNote: isEn
      ? "* New graduates do not need to fill in work history (resume only)."
      : "※ 新卒採用の方は、職務経歴の入力は不要です（履歴書のみ必須）。",

    // 職務経歴モード
    careerModeText: isEn ? "Enter as text" : "テキストで入力",
    careerModeFile: isEn ? "Upload a file" : "ファイルをアップロード",

    // プレースホルダー
    phLastName: isEn ? "e.g. Smith" : "例：山田",
    phFirstName: isEn ? "e.g. John" : "例：太郎",
    phLastNameKana: "例：やまだ",
    phFirstNameKana: "例：たろう",
    phEmail: "you@example.com",
    phPhone: isEn ? "+81 90 1234 5678" : "090-1234-5678",
    phAge: isEn ? "e.g. 26" : "例：26",
    phStartDate: isEn ? "e.g. From July 2026, immediately" : "例：2026年7月〜、即日 など",
    phPostal: isEn ? "e.g. 1500043" : "例：1500043",
    phPrefecture: isEn ? "e.g. Tokyo" : "例：東京都",
    phCity: isEn ? "e.g. Shibuya-ku Dogenzaka" : "例：渋谷区道玄坂",
    phStreet: isEn ? "e.g. 1-19-11" : "例：1-19-11",
    phBuilding: isEn
      ? "e.g. Kotobuki Dogenzaka Bldg 8F"
      : "例：寿道玄坂ビル 8F／株式会社〇〇 など",
    phCareerText: isEn
      ? "Briefly describe your past roles and responsibilities."
      : "これまでのご職業・担当業務などを簡単にご記入ください。",
    phMotivation: isEn
      ? "Please share your motivation and anything you would like us to know."
      : "志望動機やアピールしたい点などをご記入ください。",

    // ヒント
    postalHint: isEn ? "Enter digits only, no hyphen." : "ハイフンを入れずに入力してください",
    postalAutoFill: isEn
      ? "▼ When you enter the postal code, part of the address is filled automatically."
      : "▼ 郵便番号を入力すると、住所の一部が自動的に入力されます",
    postalHelpLink: isEn ? "Look up postal codes ↗" : "郵便番号がわからない方はこちら ↗",
    streetHint: isEn
      ? "* Please make sure the address includes the building/lot number."
      : "※ ご注意：ご住所が番地まで入力されているか、ご確認ください。",
    fileHint: isEn
      ? "Only PDF files (.pdf) can be uploaded."
      : "PDF 形式（.pdf）のファイルのみアップロード可能です。",
    selected: isEn ? "Selected" : "選択中",
    chooseFile: isEn ? "Choose file" : "ファイルを選択",
    changeFile: isEn ? "Change file" : "ファイルを変更",
    noFileSelected: isEn ? "No file selected" : "選択されていません",

    // 注意書き・ボタン
    submitNote: isEn
      ? "* Pressing “Review entries” shows a confirmation screen. Submission happens on that screen."
      : "※「入力内容確認」を押すと、確認画面に内容が表示されます。送信は確認画面で行います。",
    review: isEn ? "Review entries" : "入力内容確認",
    contactNote: isEn
      ? "For non-recruitment inquiries (projects, partnerships, etc.), please use the contact form below."
      : "採用以外（案件・協業など）のご相談はこちらからご利用ください。",
    contactCta: isEn ? "Go to contact form" : "お問い合わせはこちら",

    // 確認画面
    confirmIntro: isEn
      ? "We will submit the following entries. To change any item, press “Edit”."
      : "以下の内容で応募します。修正したい項目があれば「修正する」を押してください。",
    sendDemo: isEn
      ? "Submit (demo: nothing is actually sent)"
      : "送信する（デモ：実際には送信されません）",
    edit: isEn ? "Edit" : "修正する",
    confirmLabels: {
      name: isEn ? "Name" : "お名前",
      kana: isEn ? "Furigana" : "ふりがな",
      email: isEn ? "Email" : "メールアドレス",
      phone: isEn ? "Phone" : "電話番号",
      age: isEn ? "Age" : "年齢",
      startDate: isEn ? "Earliest start date" : "就業可能時期",
      address: isEn ? "Address" : "住所",
      employmentType: isEn ? "Preferred employment type" : "ご希望の雇用形態",
      resume: isEn ? "Resume" : "履歴書",
      career: isEn ? "Work history" : "職務経歴",
      motivation: isEn ? "Motivation & self-PR" : "志望動機・PR 事項など",
    },
    notEntered: isEn ? "(not entered)" : "（未入力）",

    // 完了画面
    doneTitle: isEn ? "Submission complete (demo)" : "送信が完了しました（デモ）",
    doneBody: isEn
      ? "Nothing was actually sent. In production, connect this form to a backend such as Formspree or Server Actions."
      : "実際には送信されていません。本番運用時は Formspree や Server Actions などのバックエンドへ接続してください。",
    submitAnother: isEn ? "Submit another application" : "続けて別の応募を入力する",

    // エラー
    err: {
      lastName: isEn ? "Please enter your family name." : "姓を入力してください。",
      firstName: isEn ? "Please enter your given name." : "名を入力してください。",
      lastNameKana: isEn
        ? "Please enter your family name in hiragana."
        : "せい(ひらがな)を入力してください。",
      lastNameKanaInvalid: isEn ? "Please use hiragana characters." : "ひらがなで入力してください。",
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
      phone: isEn ? "Please enter your phone number." : "電話番号を入力してください。",
      phoneInvalid: isEn
        ? "Please use digits, hyphens, etc. only."
        : "電話番号は半角数字・ハイフン等で入力してください。",
      age: isEn
        ? "Age must be a whole number between 16 and 99."
        : "年齢は16〜99の半角数字で入力してください。",
      startDate: isEn ? "Please enter your earliest start date." : "就業可能時期を入力してください。",
      postalCode: isEn ? "Please enter your postal code." : "郵便番号を入力してください。",
      postalCodeInvalid: isEn
        ? "Postal code must be 7 digits."
        : "郵便番号は7桁の半角数字で入力してください。",
      prefecture: isEn ? "Please enter the prefecture / state." : "都道府県を入力してください。",
      city: isEn ? "Please enter the city / ward." : "市区町村を入力してください。",
      streetAddress: isEn ? "Please enter the street address." : "字名・番地を入力してください。",
      resumeFile: isEn
        ? "Please upload your resume file."
        : "履歴書ファイルをアップロードしてください。",
      career: isEn ? "Please enter your work history." : "職務経歴を入力してください。",
      careerFile: isEn
        ? "Please upload a work history file."
        : "職務経歴のファイルをアップロードしてください。",
      motivation: isEn
        ? "Please enter your motivation / self-PR."
        : "志望動機・PR 事項を入力してください。",
    },
  };
}

const validate = (data: RecruitData, lang: Lang): RecruitErrors => {
  const e: RecruitErrors = {};
  const t = getTexts(lang).err;
  if (!data.lastName.trim()) e.lastName = t.lastName;
  if (!data.firstName.trim()) e.firstName = t.firstName;
  // ふりがなは日本語表示時のみチェック
  if (lang === "ja") {
    if (!data.lastNameKana.trim()) e.lastNameKana = t.lastNameKana;
    else if (!HIRAGANA_RE.test(data.lastNameKana)) e.lastNameKana = t.lastNameKanaInvalid;
    if (!data.firstNameKana.trim()) e.firstNameKana = t.firstNameKana;
    else if (!HIRAGANA_RE.test(data.firstNameKana)) e.firstNameKana = t.firstNameKanaInvalid;
  }
  if (!data.email.trim()) e.email = t.email;
  else if (!EMAIL_RE.test(data.email)) e.email = t.emailInvalid;
  if (!data.phone.trim()) e.phone = t.phone;
  else if (!PHONE_RE.test(data.phone)) e.phone = t.phoneInvalid;
  if (data.age.trim()) {
    const n = Number(data.age);
    if (!Number.isInteger(n) || n < 16 || n > 99) e.age = t.age;
  }
  if (!data.startDate.trim()) e.startDate = t.startDate;
  const postalDigits = data.postalCode.replace(/[^0-9]/g, "");
  if (!data.postalCode.trim()) e.postalCode = t.postalCode;
  else if (postalDigits.length !== 7) e.postalCode = t.postalCodeInvalid;
  if (!data.prefecture.trim()) e.prefecture = t.prefecture;
  if (!data.city.trim()) e.city = t.city;
  if (!data.streetAddress.trim()) e.streetAddress = t.streetAddress;

  if (!data.resumeFile) e.resumeFile = t.resumeFile;

  if (!isNewGrad(data.employmentType)) {
    if (data.careerMode === "text") {
      if (!data.career.trim()) e.career = t.career;
    } else if (data.careerMode === "file") {
      if (!data.careerFile) e.careerFile = t.careerFile;
    }
  }

  if (!data.motivation.trim()) e.motivation = t.motivation;
  return e;
};

export function RecruitForm() {
  const { lang } = useLanguage();
  // 言語が変わった時だけ文言バンドルを再生成
  const texts = useMemo(() => getTexts(lang), [lang]);
  const employmentTypeLabel: Record<EmploymentType, string> = useMemo(
    () => ({
      "fulltime-newgrad": texts.fulltimeNewgrad,
      "fulltime-career": texts.fulltimeCareer,
      parttime: texts.parttime,
    }),
    [texts.fulltimeNewgrad, texts.fulltimeCareer, texts.parttime],
  );

  const [data, setData] = useState<RecruitData>(initialData);
  const [step, setStep] = useState<"input" | "confirm" | "done">("input");
  const [errors, setErrors] = useState<RecruitErrors>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof RecruitData>(key: K, value: RecruitData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

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

  const onFileFieldChange = async (
    key: "resumeFile" | "careerFile",
    inputEl: HTMLInputElement,
  ) => {
    const setFileField = (value: File | null) => {
      setData((prev) => {
        const next = { ...prev };
        next[key] = value;
        return next;
      });
    };

    const file = inputEl.files?.[0] ?? null;
    if (!file) {
      setFileField(null);
      return;
    }
    const error = await validatePdfFile(file, lang);
    if (error) {
      setFileField(null);
      setErrors((prev) => ({ ...prev, [key]: error }));
      inputEl.value = "";
      return;
    }
    setFileField(file);
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
    setStep("done");
    scrollToFormTop();
  };

  const backToEdit = () => {
    setStep("input");
    scrollToFormTop();
  };

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
    { label: texts.confirmLabels.phone, value: data.phone },
    { label: texts.confirmLabels.age, value: data.age },
    { label: texts.confirmLabels.startDate, value: data.startDate },
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
    { label: texts.confirmLabels.employmentType, value: employmentTypeLabel[data.employmentType] },
    {
      label: texts.confirmLabels.resume,
      value: data.resumeFile
        ? `${data.resumeFile.name}（${Math.round(data.resumeFile.size / 1024)} KB）`
        : "",
    },
    ...(isNewGrad(data.employmentType)
      ? []
      : [
          {
            label: texts.confirmLabels.career,
            value:
              data.careerMode === "file"
                ? data.careerFile
                  ? `${data.careerFile.name}（${Math.round(data.careerFile.size / 1024)} KB）`
                  : ""
                : data.career,
          },
        ]),
    { label: texts.confirmLabels.motivation, value: data.motivation },
  ];

  return (
    <div ref={containerRef} className="scroll-mt-24">
      {step === "done" ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-900">{texts.doneTitle}</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{texts.doneBody}</p>
          <button
            type="button"
            onClick={() => {
              setData(initialData);
              setErrors({});
              setStep("input");
              scrollToFormTop();
            }}
            className="mt-6 inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-base font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-primary hover:text-slate-900"
          >
            {texts.submitAnother}
          </button>
        </div>
      ) : step === "confirm" ? (
        <form onSubmit={handleSendSubmit} className="space-y-6">
          <p className="text-base text-muted-foreground">{texts.confirmIntro}</p>
          <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {confirmRows.map(({ label, value }) => (
              <div
                key={label}
                className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5"
              >
                <dt className="text-base font-medium text-muted-foreground">{label}</dt>
                <dd className="whitespace-pre-wrap break-words text-base text-slate-900">
                  {value || <span className="text-muted-foreground">{texts.notEntered}</span>}
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-base font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              {texts.sendDemo}
            </button>
            <button
              type="button"
              onClick={backToEdit}
              className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-3 text-base font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-primary hover:text-slate-900"
            >
              {texts.edit}
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleInputSubmit}
          className="divide-y divide-border border-y border-border"
          noValidate
        >
          {/* 名前 */}
          <FieldRow badge="required" label={texts.name} lang={lang}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="flex items-start gap-2">
                <label htmlFor="lastName" className="w-10 shrink-0 pt-2 text-base text-slate-700">
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
                <label htmlFor="firstName" className="w-10 shrink-0 pt-2 text-base text-slate-700">
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
                    className="w-10 shrink-0 pt-2 text-base text-slate-700"
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
                    className="w-10 shrink-0 pt-2 text-base text-slate-700"
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

          {/* 電話番号 */}
          <FieldRow badge="required" label={texts.phone} htmlFor="phone" lang={lang}>
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

          {/* 年齢 */}
          <FieldRow badge="optional" label={texts.age} htmlFor="age" lang={lang}>
            <input
              id="age"
              type="number"
              min={16}
              max={99}
              placeholder={texts.phAge}
              value={data.age}
              onChange={(e) => set("age", e.target.value)}
              aria-invalid={!!errors.age}
              aria-describedby={errors.age ? "age-error" : undefined}
              className={`${inputClass(!!errors.age)} max-w-[10rem]`}
            />
            <FieldError id="age-error" error={errors.age} />
          </FieldRow>

          {/* 就業可能時期 */}
          <FieldRow badge="required" label={texts.startDate} htmlFor="startDate" lang={lang}>
            <input
              id="startDate"
              type="text"
              maxLength={60}
              placeholder={texts.phStartDate}
              value={data.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              aria-invalid={!!errors.startDate}
              aria-describedby={errors.startDate ? "startDate-error" : undefined}
              className={inputClass(!!errors.startDate)}
            />
            <FieldError id="startDate-error" error={errors.startDate} />
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
                className="text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900"
              >
                {texts.postalHelpLink}
              </a>
            </div>
            <p id="postalCode-hint" className="mt-1 text-sm text-muted-foreground">
              {texts.postalHint}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{texts.postalAutoFill}</p>
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
              aria-describedby={
                errors.streetAddress ? "streetAddress-error" : "streetAddress-hint"
              }
              className={inputClass(!!errors.streetAddress)}
            />
            <p id="streetAddress-hint" className="mt-1 text-sm text-muted-foreground">
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

          {/* 雇用形態 */}
          <FieldRow badge="required" label={texts.employmentType} lang={lang}>
            <div className="space-y-2">
              {(
                ["fulltime-newgrad", "fulltime-career", "parttime"] as EmploymentType[]
              ).map((type) => (
                <label key={type} className="flex items-center gap-2 text-base text-slate-900">
                  <input
                    type="radio"
                    name="employmentType"
                    value={type}
                    checked={data.employmentType === type}
                    onChange={() => set("employmentType", type)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>{employmentTypeLabel[type]}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{texts.employmentNote}</p>
          </FieldRow>

          {/* 履歴書（カスタム UI でブラウザ既定の日本語表示を回避） */}
          <FieldRow badge="required" label={texts.resume} htmlFor="resumeFile" lang={lang}>
            {/* 入力本体は sr-only で隠し、見えるラベル（ボタン状）から操作する。
                これにより「ファイルを選択」「選択されていません」のブラウザ既定テキストを
                自前の翻訳語に置き換えできる。 */}
            <input
              id="resumeFile"
              type="file"
              accept={FILE_ACCEPT}
              onChange={(e) => {
                const inputEl = e.currentTarget;
                void onFileFieldChange("resumeFile", inputEl);
              }}
              aria-invalid={!!errors.resumeFile}
              aria-describedby={errors.resumeFile ? "resumeFile-error" : "resumeFile-hint"}
              className="sr-only"
            />
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="resumeFile"
                className="inline-flex cursor-pointer items-center justify-center rounded bg-primary px-3 py-1.5 text-base font-medium text-primary-foreground transition hover:opacity-90 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
              >
                {data.resumeFile ? texts.changeFile : texts.chooseFile}
              </label>
              <span className="text-sm text-slate-700">
                {data.resumeFile
                  ? `${data.resumeFile.name}（${Math.round(data.resumeFile.size / 1024)} KB）`
                  : texts.noFileSelected}
              </span>
            </div>
            <p id="resumeFile-hint" className="mt-1 text-sm text-muted-foreground">
              {texts.fileHint}
            </p>
            <FieldError id="resumeFile-error" error={errors.resumeFile} />
          </FieldRow>

          {/* 職務経歴 */}
          {!isNewGrad(data.employmentType) && (
            <FieldRow badge="required" label={texts.career} lang={lang}>
              <div className="mb-3 flex flex-wrap gap-4 text-base text-slate-900">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="careerMode"
                    value="text"
                    checked={data.careerMode === "text"}
                    onChange={() => set("careerMode", "text")}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>{texts.careerModeText}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="careerMode"
                    value="file"
                    checked={data.careerMode === "file"}
                    onChange={() => set("careerMode", "file")}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>{texts.careerModeFile}</span>
                </label>
              </div>

              {data.careerMode === "text" ? (
                <>
                  <textarea
                    id="career"
                    rows={4}
                    maxLength={2000}
                    placeholder={texts.phCareerText}
                    value={data.career}
                    onChange={(e) => set("career", e.target.value)}
                    aria-invalid={!!errors.career}
                    aria-describedby={errors.career ? "career-error" : undefined}
                    className={inputClass(!!errors.career)}
                  />
                  <FieldError id="career-error" error={errors.career} />
                </>
              ) : (
                <>
                  {/* 職務経歴ファイル：同じくカスタム UI に */}
                  <input
                    id="careerFile"
                    type="file"
                    accept={FILE_ACCEPT}
                    onChange={(e) => {
                      const inputEl = e.currentTarget;
                      void onFileFieldChange("careerFile", inputEl);
                    }}
                    aria-invalid={!!errors.careerFile}
                    aria-describedby={errors.careerFile ? "careerFile-error" : "careerFile-hint"}
                    className="sr-only"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <label
                      htmlFor="careerFile"
                      className="inline-flex cursor-pointer items-center justify-center rounded bg-primary px-3 py-1.5 text-base font-medium text-primary-foreground transition hover:opacity-90 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
                    >
                      {data.careerFile ? texts.changeFile : texts.chooseFile}
                    </label>
                    <span className="text-sm text-slate-700">
                      {data.careerFile
                        ? `${data.careerFile.name}（${Math.round(data.careerFile.size / 1024)} KB）`
                        : texts.noFileSelected}
                    </span>
                  </div>
                  <p id="careerFile-hint" className="mt-1 text-sm text-muted-foreground">
                    {texts.fileHint}
                  </p>
                  <FieldError id="careerFile-error" error={errors.careerFile} />
                </>
              )}
            </FieldRow>
          )}

          {/* 志望動機 */}
          <FieldRow badge="required" label={texts.motivation} htmlFor="motivation" lang={lang}>
            <textarea
              id="motivation"
              rows={5}
              maxLength={2000}
              placeholder={texts.phMotivation}
              value={data.motivation}
              onChange={(e) => set("motivation", e.target.value)}
              aria-invalid={!!errors.motivation}
              aria-describedby={errors.motivation ? "motivation-error" : undefined}
              className={inputClass(!!errors.motivation)}
            />
            <FieldError id="motivation-error" error={errors.motivation} />
          </FieldRow>

          {/* 注意書きと送信ボタン */}
          <div className="space-y-5 pt-6">
            <p className="text-sm text-muted-foreground">{texts.submitNote}</p>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-base font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              {texts.review}
            </button>

            <p className="pt-4 text-sm text-muted-foreground">{texts.contactNote}</p>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-base font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              {texts.contactCta}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
