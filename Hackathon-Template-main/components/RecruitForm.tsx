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
  validatePdfFile,
} from "@/components/form-utils";

/**
 * 採用エントリーフォーム（入力 → 確認 → 完了 の3段階・送信なしデモ）
 * - 必須=赤・任意=緑のバッジ付き 3 カラム行レイアウト
 * - 姓名・ふりがな分割／電話番号 1 行／住所必須（郵便番号自動入力）
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
  /** 履歴書（ファイルアップロード・全雇用形態で必須） */
  resumeFile: File | null;
  /** 職務経歴の入力モード（テキスト or ファイル）。新卒採用では非表示。 */
  careerMode: CareerMode;
  /** 職務経歴（テキスト入力モード時） */
  career: string;
  /** 職務経歴（ファイルアップロードモード時） */
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

const employmentTypeLabel: Record<EmploymentType, string> = {
  "fulltime-newgrad": "正社員（新卒採用）",
  "fulltime-career": "正社員（キャリア採用）",
  parttime: "パート・アルバイト",
};

/** 新卒採用かどうか（職務経歴セクションの表示制御に使う） */
const isNewGrad = (t: EmploymentType): boolean => t === "fulltime-newgrad";

/**
 * 受け付ける履歴書／職務経歴ファイルは PDF のみ。
 * - input の accept 属性で .pdf / application/pdf 以外を選びにくくする
 * - 実際の防御は validatePdfFile（拡張子＋MIME＋マジックナンバー＋サーバ側 400）で行う
 */
const FILE_ACCEPT = ".pdf,application/pdf";

const validate = (data: RecruitData): RecruitErrors => {
  const e: RecruitErrors = {};
  if (!data.lastName.trim()) e.lastName = "姓を入力してください。";
  if (!data.firstName.trim()) e.firstName = "名を入力してください。";
  if (!data.lastNameKana.trim()) e.lastNameKana = "せい(ひらがな)を入力してください。";
  else if (!HIRAGANA_RE.test(data.lastNameKana)) e.lastNameKana = "ひらがなで入力してください。";
  if (!data.firstNameKana.trim()) e.firstNameKana = "めい(ひらがな)を入力してください。";
  else if (!HIRAGANA_RE.test(data.firstNameKana)) e.firstNameKana = "ひらがなで入力してください。";
  if (!data.email.trim()) e.email = "メールアドレスを入力してください。";
  else if (!EMAIL_RE.test(data.email))
    e.email = "メールアドレスの形式で入力してください。(例:you@example.com)";
  if (!data.phone.trim()) e.phone = "電話番号を入力してください。";
  else if (!PHONE_RE.test(data.phone))
    e.phone = "電話番号は半角数字・ハイフン等で入力してください。";
  if (data.age.trim()) {
    const n = Number(data.age);
    if (!Number.isInteger(n) || n < 16 || n > 99)
      e.age = "年齢は16〜99の半角数字で入力してください。";
  }
  if (!data.startDate.trim()) e.startDate = "就業可能時期を入力してください。";
  const postalDigits = data.postalCode.replace(/[^0-9]/g, "");
  if (!data.postalCode.trim()) e.postalCode = "郵便番号を入力してください。";
  else if (postalDigits.length !== 7)
    e.postalCode = "郵便番号は7桁の半角数字で入力してください。";
  if (!data.prefecture.trim()) e.prefecture = "都道府県を入力してください。";
  if (!data.city.trim()) e.city = "市区町村を入力してください。";
  if (!data.streetAddress.trim()) e.streetAddress = "字名・番地を入力してください。";

  // 履歴書は全雇用形態で必須（ファイルアップロード）
  if (!data.resumeFile) e.resumeFile = "履歴書ファイルをアップロードしてください。";

  // 職務経歴：新卒採用は不要、それ以外（キャリア採用・パート）は必須
  if (!isNewGrad(data.employmentType)) {
    if (data.careerMode === "text") {
      if (!data.career.trim()) e.career = "職務経歴を入力してください。";
    } else if (data.careerMode === "file") {
      if (!data.careerFile) e.careerFile = "職務経歴のファイルをアップロードしてください。";
    }
  }

  if (!data.motivation.trim()) e.motivation = "志望動機・PR 事項を入力してください。";
  return e;
};

export function RecruitForm() {
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

  /**
   * ファイル選択時の共通ハンドラ:
   *  - 解除（null）はそのまま受け入れる
   *  - 拡張子・MIME・先頭バイトをクライアント側で確認 → サーバ側 /api/upload-resume にも POST し
   *    両方を通った PDF のみ state に格納
   *  - 失敗時は state を null に戻し、エラー文を表示。input 値も空にして同じファイルを再選択可能に
   */
  const onFileFieldChange = async (
    key: "resumeFile" | "careerFile",
    inputEl: HTMLInputElement,
  ) => {
    /** key で示すフィールドだけ File|null に書き換えるヘルパ（型安全に） */
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
    const error = await validatePdfFile(file);
    if (error) {
      setFileField(null);
      setErrors((prev) => ({ ...prev, [key]: error }));
      // 同じファイルを再選択できるようにリセット
      inputEl.value = "";
      return;
    }
    // 通過：ファイルを保存し、その項目のエラーは消す
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
    { label: "電話番号", value: data.phone },
    { label: "年齢", value: data.age },
    { label: "就業可能時期", value: data.startDate },
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
    { label: "ご希望の雇用形態", value: employmentTypeLabel[data.employmentType] },
    {
      label: "履歴書",
      value: data.resumeFile ? `${data.resumeFile.name}（${Math.round(data.resumeFile.size / 1024)} KB）` : "",
    },
    // 職務経歴：新卒採用では非表示、それ以外はテキストまたはファイル
    ...(isNewGrad(data.employmentType)
      ? []
      : [
          {
            label: "職務経歴",
            value:
              data.careerMode === "file"
                ? data.careerFile
                  ? `${data.careerFile.name}（${Math.round(data.careerFile.size / 1024)} KB）`
                  : ""
                : data.career,
          },
        ]),
    { label: "志望動機・PR 事項など", value: data.motivation },
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
                <label htmlFor="lastNameKana" className="w-10 shrink-0 pt-2 text-sm text-slate-700">
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
                <label htmlFor="firstNameKana" className="w-10 shrink-0 pt-2 text-sm text-slate-700">
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

          {/* 電話番号（住所のように1行で表示） */}
          <FieldRow badge="required" label="電話番号" htmlFor="phone">
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

          {/* 年齢 */}
          <FieldRow badge="optional" label="年齢" htmlFor="age">
            <input
              id="age"
              type="number"
              min={16}
              max={99}
              placeholder="例：26"
              value={data.age}
              onChange={(e) => set("age", e.target.value)}
              aria-invalid={!!errors.age}
              aria-describedby={errors.age ? "age-error" : undefined}
              className={`${inputClass(!!errors.age)} max-w-[10rem]`}
            />
            <FieldError id="age-error" error={errors.age} />
          </FieldRow>

          {/* 就業可能時期 */}
          <FieldRow badge="required" label="就業可能時期" htmlFor="startDate">
            <input
              id="startDate"
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

          {/* 都道府県 */}
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

          {/* 市区町村 */}
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

          {/* 建物名・会社名 */}
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

          {/* ご希望の雇用形態（3区分のラジオ選択） */}
          <FieldRow badge="required" label="ご希望の雇用形態">
            <div className="space-y-2">
              {(
                [
                  "fulltime-newgrad",
                  "fulltime-career",
                  "parttime",
                ] as EmploymentType[]
              ).map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm text-slate-900">
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
            <p className="mt-2 text-xs text-muted-foreground">
              ※ 新卒採用の方は、職務経歴の入力は不要です（履歴書のみ必須）。
            </p>
          </FieldRow>

          {/* 履歴書（全雇用形態で必須・PDF のみ） */}
          <FieldRow badge="required" label="履歴書" htmlFor="resumeFile">
            <input
              id="resumeFile"
              type="file"
              accept={FILE_ACCEPT}
              onChange={(e) => {
                // React の合成イベントは async 後 currentTarget が null になり得るため
                // DOM 参照をローカルにつかんでから検証する
                const inputEl = e.currentTarget;
                void onFileFieldChange("resumeFile", inputEl);
              }}
              aria-invalid={!!errors.resumeFile}
              aria-describedby={errors.resumeFile ? "resumeFile-error" : "resumeFile-hint"}
              className="block w-full text-sm text-slate-900 file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
            />
            {data.resumeFile && (
              <p className="mt-1 text-xs text-slate-700">
                選択中：{data.resumeFile.name}（{Math.round(data.resumeFile.size / 1024)} KB）
              </p>
            )}
            <p id="resumeFile-hint" className="mt-1 text-xs text-muted-foreground">
              PDF 形式（.pdf）のファイルのみアップロード可能です。
            </p>
            <FieldError id="resumeFile-error" error={errors.resumeFile} />
          </FieldRow>

          {/* 職務経歴（新卒採用では非表示。それ以外はテキスト or ファイル選択） */}
          {!isNewGrad(data.employmentType) && (
            <FieldRow badge="required" label="職務経歴">
              {/* 入力モードの切替（テキスト or ファイル） */}
              <div className="mb-3 flex flex-wrap gap-4 text-sm text-slate-900">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="careerMode"
                    value="text"
                    checked={data.careerMode === "text"}
                    onChange={() => set("careerMode", "text")}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>テキストで入力</span>
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
                  <span>ファイルをアップロード</span>
                </label>
              </div>

              {data.careerMode === "text" ? (
                <>
                  <textarea
                    id="career"
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
                </>
              ) : (
                <>
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
                    className="block w-full text-sm text-slate-900 file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
                  />
                  {data.careerFile && (
                    <p className="mt-1 text-xs text-slate-700">
                      選択中：{data.careerFile.name}（{Math.round(data.careerFile.size / 1024)} KB）
                    </p>
                  )}
                  <p id="careerFile-hint" className="mt-1 text-xs text-muted-foreground">
                    PDF 形式（.pdf）のファイルのみアップロード可能です。
                  </p>
                  <FieldError id="careerFile-error" error={errors.careerFile} />
                </>
              )}
            </FieldRow>
          )}

          {/* 志望動機・PR 事項 */}
          <FieldRow badge="required" label="志望動機・PR 事項など" htmlFor="motivation">
            <textarea
              id="motivation"
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
          </FieldRow>

          {/* 注意書きと送信ボタン */}
          <div className="space-y-5 pt-6">
            <p className="text-xs text-muted-foreground">
              ※「入力内容確認」を押すと、確認画面に内容が表示されます。送信は確認画面で行います。
            </p>
            {/* 入力内容確認ボタン（注意書きの直下） */}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              入力内容確認
            </button>

            <p className="pt-4 text-xs text-muted-foreground">
              採用以外（案件・協業など）のご相談はこちらからご利用ください。
            </p>
            {/* お問い合わせページへの導線（黄色・お問い合わせフォーム送信ボタンと同じく常に全幅） */}
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              お問い合わせはこちら
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
