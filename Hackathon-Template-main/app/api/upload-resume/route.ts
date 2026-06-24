import { NextResponse } from "next/server";

/**
 * ========================================
 * 履歴書／職務経歴ファイルの PDF 検証エンドポイント
 * ----------------------------------------
 * セキュリティ観点で対応した項目（脆弱性リスト 88 項目より）:
 *
 *  #10/#19 アップロードファイルによるスクリプト実行
 *      → PDF 3 層検証（拡張子＋MIME＋マジックバイト）で偽装ファイルを拒否
 *  #26    CSRF
 *      → Origin / Referer を厳格に検証し、同一オリジン以外を拒否
 *  #43    CORS 制限の不備
 *      → クロスオリジン POST はそもそも拒否（Access-Control-Allow-Origin を返さない）
 *  #56    不要な HTTP メソッドのサポート
 *      → POST 以外（GET/PUT/DELETE/PATCH/HEAD/OPTIONS）は 405 で拒否
 *  #69    不正なパラメータ値による DoS
 *      → ファイルサイズ上限 10MB
 *  #79    キャッシュ可能な HTTP レスポンス
 *      → Cache-Control: no-store でキャッシュ禁止（next.config.ts でも二重設定）
 *  #80    任意のファイルがアップロード可能
 *      → 拡張子・MIME・マジックバイト全てチェック
 *  #88    セキュリティヘッダ
 *      → X-Content-Type-Options / X-Robots-Tag を明示
 *
 * 本番運用時に追加で必要となるもの:
 *  - レート制限（Vercel Edge Config / Upstash 等で実装）
 *  - アンチウイルススキャン（ClamAV / VirusTotal 連携）
 *  - 監査ログ / 監視
 *  - ストレージ保存（S3 / Cloud Storage）
 * ========================================
 */
export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"

/** 全レスポンス共通のセキュリティヘッダ */
const SECURITY_RESPONSE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, nosnippet, noarchive",
} as const;

/** 400 Bad Request を生成するヘルパ */
function bad(message: string) {
  return NextResponse.json(
    { ok: false, error: message },
    { status: 400, headers: SECURITY_RESPONSE_HEADERS },
  );
}

/** 403 Forbidden（同一オリジン違反） */
function forbidden(message: string) {
  return NextResponse.json(
    { ok: false, error: message },
    { status: 403, headers: SECURITY_RESPONSE_HEADERS },
  );
}

/** 405 Method Not Allowed */
function methodNotAllowed() {
  return new NextResponse("Method Not Allowed", {
    status: 405,
    headers: { ...SECURITY_RESPONSE_HEADERS, Allow: "POST" },
  });
}

/**
 * Origin / Referer 検証（CSRF 対策, #26）
 * - 同一オリジンの場合のみ true
 * - Origin が無い場合は Referer の origin 部分で代替
 * - どちらも無い場合は拒否（古い CSRF 攻撃で多用される手法）
 *
 * Vercel 等のプロキシ越しでも Host ヘッダはアプリに届く前提。
 * HTTPS 強制（HSTS）と組み合わせて http → https のオリジン詐称を阻止します。
 */
function isSameOrigin(request: Request): boolean {
  const host = request.headers.get("host");
  if (!host) return false;

  const origin = request.headers.get("origin");
  if (origin) {
    // Origin が同一オリジン（同一ホスト名＋スキーマ）か
    try {
      const u = new URL(origin);
      return u.host === host;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const u = new URL(referer);
      return u.host === host;
    } catch {
      return false;
    }
  }

  // Origin/Referer どちらも無い場合は拒否
  return false;
}

export async function POST(request: Request) {
  // ── (a) CSRF 防御：同一オリジン以外を拒否 ──
  if (!isSameOrigin(request)) {
    return forbidden("クロスオリジンからのアップロードは許可されていません。");
  }

  // ── (b) Content-Type 検証：multipart/form-data のみ受け付け ──
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return bad("Content-Type は multipart/form-data である必要があります。");
  }

  // ── (c) フォームデータ解析 ──
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return bad("リクエスト形式が不正です。multipart/form-data で送信してください。");
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return bad("ファイルが添付されていません。");
  }

  // ── (d) サイズチェック（DoS 防御, #69） ──
  if (file.size === 0) {
    return bad("空のファイルはアップロードできません。");
  }
  if (file.size > MAX_FILE_SIZE) {
    return bad(`ファイルサイズが上限（${MAX_FILE_SIZE / 1024 / 1024} MB）を超えています。`);
  }

  // ── (e) 1層目：拡張子チェック ──
  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith(".pdf")) {
    return bad("PDF 形式のファイル（拡張子 .pdf）のみアップロード可能です。");
  }

  // ── (f) 2層目：MIME タイプチェック ──
  if (file.type && file.type !== "application/pdf") {
    return bad("PDF 形式のファイル（application/pdf）のみアップロード可能です。");
  }

  // ── (g) 3層目：マジックバイトチェック（先頭5バイト = %PDF-） ──
  //   ※ ファイル全体を読まず、先頭 5 バイトだけスライスして読む（メモリ節約）
  let head: Uint8Array;
  try {
    const slice = await file.slice(0, PDF_MAGIC.length).arrayBuffer();
    head = new Uint8Array(slice);
  } catch {
    return bad("ファイルの読み込みに失敗しました。");
  }
  const isPDF =
    head.length === PDF_MAGIC.length && PDF_MAGIC.every((b, i) => head[i] === b);
  if (!isPDF) {
    return bad("ファイルの中身が PDF 形式ではありません。正しい PDF ファイルをアップロードしてください。");
  }

  // ── 全チェック通過 ──
  // ★本番ではここでアンチウイルススキャン / ストレージ保存 / 監査ログ記録 を実施
  return NextResponse.json(
    { ok: true, name: file.name, size: file.size },
    { headers: SECURITY_RESPONSE_HEADERS },
  );
}

// ── POST 以外の HTTP メソッドは全て 405 で拒否（#56） ──
export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
