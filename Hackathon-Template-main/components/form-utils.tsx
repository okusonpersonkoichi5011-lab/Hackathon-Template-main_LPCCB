"use client";

import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n/types";

/**
 * フォーム共通ユーティリティ（ContactForm / RecruitForm が共有）
 * - 必須バッジ＝赤、任意バッジ＝緑
 * - 入力欄共通スタイル、エラー表示、3カラム行レイアウト
 * - 郵便番号 → 住所自動取得（zipcloud API）
 *
 * すべての文言は `lang` 引数または Badge の i18n でランタイム切替されます。
 */

// ----- 入力検証用の正規表現 -----
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^[0-9\-+()\s]+$/;
/** ひらがな（と全角/半角スペース）のみ */
export const HIRAGANA_RE = /^[぀-ゟ\s　]+$/;

// ----- 入力欄の共通クラス（エラー時は赤枠） -----
export const inputClass = (hasError: boolean) =>
  `w-full rounded-md border bg-background px-3 py-2 text-sm text-slate-900 placeholder:text-muted-foreground focus:outline-2 focus:outline-offset-2 focus:outline-primary ${
    hasError ? "border-red-500" : "border-border"
  }`;

// ----- 必須=赤 / 任意=緑 バッジ（日英切替） -----
export function Badge({ type, lang = "ja" }: { type: "required" | "optional"; lang?: Lang }) {
  const labelMap = {
    required: { ja: "必須", en: "Required" },
    optional: { ja: "任意", en: "Optional" },
  };
  return (
    <span
      className={`inline-flex h-6 min-w-[3rem] items-center justify-center rounded px-2 text-xs font-bold text-white ${
        type === "required" ? "bg-red-500" : "bg-emerald-500"
      }`}
    >
      {labelMap[type][lang]}
    </span>
  );
}

// ----- 項目下に表示する赤字エラー -----
export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-red-600">
      {error}
    </p>
  );
}

// ----- バッジ + ラベル + 入力欄の 3 カラム行 -----
export function FieldRow({
  badge,
  label,
  htmlFor,
  children,
  lang = "ja",
}: {
  badge: "required" | "optional";
  label: string;
  /** 単一入力フィールドに紐づけるID（複数入力時は省略可） */
  htmlFor?: string;
  children: ReactNode;
  lang?: Lang;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-[5rem_8rem_1fr] sm:items-start sm:gap-4 sm:py-5">
      {/* バッジ（モバイルではラベルと横並び・PCでは左列） */}
      <div className="flex items-center gap-3 sm:block sm:pt-1">
        <Badge type={badge} lang={lang} />
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-900 sm:hidden">
          {label}
        </label>
      </div>
      {/* PC用ラベル */}
      <label htmlFor={htmlFor} className="hidden text-sm font-medium text-slate-900 sm:block sm:pt-1.5">
        {label}
      </label>
      {/* 入力欄エリア */}
      <div>{children}</div>
    </div>
  );
}

// ----- 共通メッセージ（日英） -----
const pdfMessages = {
  ext: {
    ja: "PDF 形式のファイル（拡張子 .pdf）のみアップロード可能です。",
    en: "Only PDF files (.pdf extension) can be uploaded.",
  },
  mime: {
    ja: "PDF 形式のファイル（application/pdf）のみアップロード可能です。",
    en: "Only PDF files (application/pdf) can be uploaded.",
  },
  notPdf: {
    ja: "ファイルの中身が PDF 形式ではありません。正しい PDF ファイルをアップロードしてください。",
    en: "The file is not a valid PDF. Please upload a proper PDF file.",
  },
  readFail: {
    ja: "ファイルの読み込みに失敗しました。",
    en: "Failed to read the file.",
  },
  serverReject: {
    ja: "サーバ側の検証で拒否されました。",
    en: "The server rejected the file during validation.",
  },
  uploadFail: (status: number, lang: Lang) =>
    lang === "en"
      ? `Upload failed (status: ${status}).`
      : `アップロードに失敗しました（ステータス: ${status}）。`,
  serverCommErr: {
    ja: "サーバ側の検証に失敗しました（通信エラー）。",
    en: "Server validation failed (communication error).",
  },
};

// ----- PDF ファイル検証（クライアント側即時チェック＋サーバ側検証） -----
/**
 * クライアント側で PDF かを 3 段階で検証:
 *  1) 拡張子 (.pdf)
 *  2) MIME タイプ (application/pdf。空文字は他2つでカバー)
 *  3) 先頭5バイトのマジックナンバー (%PDF-)
 * 全てパス時 null、失敗時はエラーメッセージを返す。
 */
export async function validatePdfFileClient(
  file: File,
  lang: Lang = "ja",
): Promise<string | null> {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return pdfMessages.ext[lang];
  }
  if (file.type && file.type !== "application/pdf") {
    return pdfMessages.mime[lang];
  }
  try {
    const buf = await file.slice(0, 5).arrayBuffer();
    const bytes = new Uint8Array(buf);
    const isPDF =
      bytes.length === 5 &&
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46 &&
      bytes[4] === 0x2D;
    if (!isPDF) {
      return pdfMessages.notPdf[lang];
    }
  } catch {
    return pdfMessages.readFail[lang];
  }
  return null;
}

/**
 * サーバ側 API ルート /api/upload-resume へ POST して検証。
 * 400 が返ってきたらサーバ側エラー文言を返す。通信エラー時はその旨。
 */
export async function validatePdfFileServer(
  file: File,
  lang: Lang = "ja",
): Promise<string | null> {
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload-resume", { method: "POST", body: fd });
    if (res.status === 200) return null;
    if (res.status === 400) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      return body?.error ?? pdfMessages.serverReject[lang];
    }
    return pdfMessages.uploadFail(res.status, lang);
  } catch {
    return pdfMessages.serverCommErr[lang];
  }
}

/** クライアント検証 → サーバ検証 の順に実行（クライアント NG ならサーバには投げない） */
export async function validatePdfFile(file: File, lang: Lang = "ja"): Promise<string | null> {
  const c = await validatePdfFileClient(file, lang);
  if (c) return c;
  return await validatePdfFileServer(file, lang);
}

// ----- 郵便番号 → 住所自動取得（zipcloud：無料・キー不要・CORS対応） -----
/**
 * 7桁の郵便番号から都道府県・市区町村を取得。失敗時は null。
 *
 * セキュリティ対策（SSRF #20 / 入力検証）：
 * - 入力値を厳格に「半角数字 7 桁」に正規化してから埋め込み（URL 注入を阻止）
 * - 5 秒タイムアウトでハング攻撃を防止
 * - HTTPS 固定。エンドポイントはハードコードで動的化しない
 * - エラー時は null を返すだけで、内部情報を含むエラーメッセージは外に出さない
 */
const ZIPCLOUD_ENDPOINT = "https://zipcloud.ibsnet.co.jp/api/search";

export async function fetchAddressFromPostalCode(
  postalCode: string,
): Promise<{ prefecture: string; city: string } | null> {
  // 数字以外を除去 → 厳格に 7 桁検証（任意の文字を埋め込めないように）
  const digits = postalCode.replace(/[^0-9]/g, "");
  if (!/^\d{7}$/.test(digits)) return null;

  // 5 秒タイムアウト（AbortController）。ネットワークハング攻撃の防御
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    // URL は固定エンドポイント + サニタイズ済み 7 桁数字のみ
    const url = `${ZIPCLOUD_ENDPOINT}?zipcode=${digits}`;
    const res = await fetch(url, {
      signal: controller.signal,
      // 第三者 API には credentials を付与しない
      credentials: "omit",
      // 不必要な情報の流出を避ける
      referrerPolicy: "no-referrer",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      status?: number;
      results?: { address1?: string; address2?: string; address3?: string }[] | null;
    };
    if (json.status === 200 && json.results && json.results[0]) {
      const r = json.results[0];
      return {
        prefecture: r.address1 ?? "",
        city: (r.address2 ?? "") + (r.address3 ?? ""),
      };
    }
    return null;
  } catch {
    // タイムアウト・ネットワークエラーは静かに null
    return null;
  } finally {
    clearTimeout(timer);
  }
}
