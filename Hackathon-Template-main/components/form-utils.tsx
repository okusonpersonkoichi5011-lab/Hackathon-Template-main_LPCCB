"use client";

import type { ReactNode } from "react";

/**
 * フォーム共通ユーティリティ（ContactForm / RecruitForm が共有）
 * - 必須バッジ＝赤、任意バッジ＝緑
 * - 入力欄共通スタイル、エラー表示、3カラム行レイアウト
 * - 郵便番号 → 住所自動取得（zipcloud API）
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

// ----- 必須=赤 / 任意=緑 バッジ -----
export function Badge({ type }: { type: "required" | "optional" }) {
  return (
    <span
      className={`inline-flex h-6 min-w-[3rem] items-center justify-center rounded px-2 text-xs font-bold text-white ${
        type === "required" ? "bg-red-500" : "bg-emerald-500"
      }`}
    >
      {type === "required" ? "必須" : "任意"}
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
}: {
  badge: "required" | "optional";
  label: string;
  /** 単一入力フィールドに紐づけるID（複数入力時は省略可） */
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-[5rem_8rem_1fr] sm:items-start sm:gap-4 sm:py-5">
      {/* バッジ（モバイルではラベルと横並び・PCでは左列） */}
      <div className="flex items-center gap-3 sm:block sm:pt-1">
        <Badge type={badge} />
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

// ----- PDF ファイル検証（クライアント側即時チェック＋サーバ側検証） -----
/**
 * クライアント側で PDF かを 3 段階で検証:
 *  1) 拡張子 (.pdf)
 *  2) MIME タイプ (application/pdf。空文字は他2つでカバー)
 *  3) 先頭5バイトのマジックナンバー (%PDF-)
 * 全てパス時 null、失敗時はエラーメッセージを返す。
 */
export async function validatePdfFileClient(file: File): Promise<string | null> {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return "PDF 形式のファイル（拡張子 .pdf）のみアップロード可能です。";
  }
  if (file.type && file.type !== "application/pdf") {
    return "PDF 形式のファイル（application/pdf）のみアップロード可能です。";
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
      return "ファイルの中身が PDF 形式ではありません。正しい PDF ファイルをアップロードしてください。";
    }
  } catch {
    return "ファイルの読み込みに失敗しました。";
  }
  return null;
}

/**
 * サーバ側 API ルート /api/upload-resume へ POST して検証。
 * 400 が返ってきたらサーバ側エラー文言を返す。通信エラー時はその旨。
 */
export async function validatePdfFileServer(file: File): Promise<string | null> {
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload-resume", { method: "POST", body: fd });
    if (res.status === 200) return null;
    if (res.status === 400) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      return body?.error ?? "サーバ側の検証で拒否されました。";
    }
    return `アップロードに失敗しました（ステータス: ${res.status}）。`;
  } catch {
    return "サーバ側の検証に失敗しました（通信エラー）。";
  }
}

/** クライアント検証 → サーバ検証 の順に実行（クライアント NG ならサーバには投げない） */
export async function validatePdfFile(file: File): Promise<string | null> {
  const c = await validatePdfFileClient(file);
  if (c) return c;
  return await validatePdfFileServer(file);
}

// ----- 郵便番号 → 住所自動取得（zipcloud：無料・キー不要・CORS対応） -----
/**
 * 7桁の郵便番号から都道府県・市区町村を取得。失敗時は null。
 * - 通信エラー・タイムアウト・ヒットなしは null を返し、ユーザーが手入力できる状態にする
 */
export async function fetchAddressFromPostalCode(
  postalCode: string,
): Promise<{ prefecture: string; city: string } | null> {
  const digits = postalCode.replace(/[^0-9]/g, "");
  if (digits.length !== 7) return null;
  try {
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${digits}`);
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
    return null;
  }
}
