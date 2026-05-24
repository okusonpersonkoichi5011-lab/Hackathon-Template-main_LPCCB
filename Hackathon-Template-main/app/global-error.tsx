"use client";

/**
 * ルート layout 自体が失敗したとき用（html / body をここで描画する必要があります）
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.125rem", fontWeight: 600 }}>致命的なエラーが発生しました</h1>
        <p style={{ marginTop: "0.75rem", color: "#64748b", fontSize: "0.875rem" }}>
          {process.env.NODE_ENV === "development" ? error.message : "ページを再読み込みしてください。"}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            background: "#ebc528",
            color: "#0f172a",
            border: "none",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          再試行
        </button>
      </body>
    </html>
  );
}
