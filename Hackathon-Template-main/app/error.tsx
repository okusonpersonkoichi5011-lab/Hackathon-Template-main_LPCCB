"use client";

/**
 * ルート配下でエラーが起きたときの表示（App Router 用）
 *
 * セキュリティ観点（#47 アプリエラーメッセージ / #48 エラー情報の公開）:
 * - 本番では error.message・error.stack を一切表示しない
 * - error.digest（Next.js が生成するハッシュ）のみ表示し、内部実装を隠蔽
 * - 開発時のみ詳細を表示してデバッグを容易にする
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-lg font-semibold text-slate-900">表示中にエラーが発生しました</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        しばらくしてから再度お試しください。
      </p>
      {isDev ? (
        // 開発時のみエラーメッセージを表示（本番ビルドでは出さない）
        <pre className="mx-auto mt-4 max-w-md overflow-auto text-left text-xs text-red-600">
          {error.message}
        </pre>
      ) : error.digest ? (
        // 本番では digest（実装情報を含まないハッシュ）のみ表示
        <p className="mt-4 text-xs text-muted-foreground">
          エラー ID: <code>{error.digest}</code>
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        再読み込み
      </button>
    </div>
  );
}
