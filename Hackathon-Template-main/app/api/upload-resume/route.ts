import { NextResponse } from "next/server";

/**
 * 履歴書／職務経歴ファイルの PDF 検証エンドポイント
 *
 * セキュリティ観点での「PDF 以外を絶対に受け付けない」防御:
 *  1) 拡張子（小文字化して .pdf のみ許可）
 *  2) MIME タイプ（application/pdf のみ許可。空文字は拡張子と先頭バイトでカバー）
 *  3) ファイル先頭5バイトのマジックナンバー（%PDF- = 0x25 0x50 0x44 0x46 0x2D）
 * いずれかに違反した場合は 400 Bad Request を返す。
 *
 * 実際のファイル保存・ウイルススキャン・暗号化等は本番運用時に追加してください。
 * このエンドポイント単体では受け取った内容を返却するだけで、保存はしません。
 */
export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** 400 Bad Request を生成するヘルパ */
function bad(message: string) {
  return NextResponse.json(
    { ok: false, error: message },
    {
      status: 400,
      headers: {
        // 念のためキャッシュさせない
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  // multipart/form-data として読み取り
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

  // サイズチェック
  if (file.size === 0) {
    return bad("空のファイルはアップロードできません。");
  }
  if (file.size > MAX_FILE_SIZE) {
    return bad(`ファイルサイズが上限（${MAX_FILE_SIZE / 1024 / 1024} MB）を超えています。`);
  }

  // (1) 拡張子チェック（小文字比較）
  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith(".pdf")) {
    return bad("PDF 形式のファイル（拡張子 .pdf）のみアップロード可能です。");
  }

  // (2) MIME タイプチェック（type が空のブラウザもあるので空は許容、値があれば application/pdf 限定）
  if (file.type && file.type !== "application/pdf") {
    return bad("PDF 形式のファイル（application/pdf）のみアップロード可能です。");
  }

  // (3) マジックナンバーチェック（先頭5バイト = %PDF-）
  let bytes: Uint8Array;
  try {
    const buf = await file.arrayBuffer();
    bytes = new Uint8Array(buf.slice(0, 5));
  } catch {
    return bad("ファイルの読み込みに失敗しました。");
  }
  const isPDF =
    bytes.length === 5 &&
    bytes[0] === 0x25 && // %
    bytes[1] === 0x50 && // P
    bytes[2] === 0x44 && // D
    bytes[3] === 0x46 && // F
    bytes[4] === 0x2D; //  -
  if (!isPDF) {
    return bad("ファイルの中身が PDF 形式ではありません。正しい PDF ファイルをアップロードしてください。");
  }

  // 全チェック OK
  // ★本番ではここでアンチウイルススキャン / ストレージ保存 / メタデータ登録 などを行う
  return NextResponse.json(
    {
      ok: true,
      name: file.name,
      size: file.size,
    },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}

/** その他のメソッドは 405 で拒否（GET 等で内部処理を覗かれないように） */
export async function GET() {
  return new NextResponse("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
}
