import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * セキュリティ用ミドルウェア（多層防御 / defense in depth）
 * ------------------------------------------------------------
 * このサイトには現状、ユーザー入力でファイルパスを組み立てる処理や
 * 動的ルート・API ルートが無いため、ディレクトリトラバーサルは成立しません。
 * ただし将来 API やファイル配信を追加したときの「保険」として、
 * パストラバーサルの典型的なパターンを含むリクエストをエッジで拒否します。
 *
 * 検知対象（生 URL とデコード後パスの両方を確認）：
 *  - 親ディレクトリ参照（..）
 *  - URL エンコードされたトラバーサル（%2e=. / %2f=/ / %5c=\）
 *  - バックスラッシュ（\）
 *  - ヌルバイト（%00）
 *
 * 通常の静的ルート（/ /service /company /recruit /contact）は
 * これらを含まないため、正規アクセスには一切影響しません。
 */

// 生 URL（エンコード状態）で弾きたいパターン
const ENCODED_TRAVERSAL = /(%2e|%2f|%5c|%00|\.\.|\\)/i;

export function middleware(request: NextRequest) {
  // 1) 生のパス（エンコード状態）でチェック
  const rawPath = request.nextUrl.pathname + request.nextUrl.search;
  if (ENCODED_TRAVERSAL.test(rawPath)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 2) デコード後にも親参照が残っていないかチェック
  //    （多重エンコードや混在ケースの保険。デコード失敗自体も不正とみなす）
  try {
    const decoded = decodeURIComponent(request.nextUrl.pathname);
    if (decoded.includes("..") || decoded.includes("\\") || decoded.includes("\0")) {
      return new NextResponse("Bad Request", { status: 400 });
    }
  } catch {
    // decodeURIComponent が壊れた（不正なエスケープ）リクエストは拒否
    return new NextResponse("Bad Request", { status: 400 });
  }

  return NextResponse.next();
}

/**
 * 適用範囲（matcher）
 * - Next.js の内部アセット（_next/static, _next/image）と favicon は
 *   パフォーマンスのため除外。これらはフレームワークが安全に配信します。
 * - それ以外のすべてのリクエストにトラバーサル検査を適用します。
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
