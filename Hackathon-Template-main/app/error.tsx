"use client";

/**
 * ルート配下でエラーが起きたときの表示（App Router 用）
 * 「missing required error components」対策として最低限の UI を用意しています。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-lg font-semibold text-slate-900">表示中にエラーが発生しました</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {process.env.NODE_ENV === "development" ? error.message : "しばらくしてから再度お試しください。"}
      </p>
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
