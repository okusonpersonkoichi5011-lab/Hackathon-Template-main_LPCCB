import type { NextConfig } from "next";

/**
 * セキュリティ用のレスポンスヘッダ
 * - 静的に近いマーケサイト想定の "ハッカソン用デフォルト"
 * - もし外部の埋め込み（YouTube, X, など）を追加するときは
 *   その都度ヘッダを緩める必要があります（特に CSP / X-Frame-Options）。
 */
const securityHeaders = [
  // 他サイトに iframe で埋め込まれることを禁止（クリックジャッキング対策）
  { key: "X-Frame-Options", value: "DENY" },
  // MIME タイプを推測させない（content sniffing 対策）
  { key: "X-Content-Type-Options", value: "nosniff" },
  // 外部サイトへ遷移する際の Referrer を最小限に
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // ブラウザ機能（カメラ・マイク等）を一切要求しないことを明示
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HTTPS を強制（HSTS）。Vercel は既定で HTTPS、本番想定のみ有効化。
  // ローカル開発（http://localhost）には付与しません。
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // 推奨：旧 XSS フィルタは無効化が推奨（IE 旧版向け）
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig: NextConfig = {
  /* Vercel へのデプロイに追加設定は基本不要です */

  async headers() {
    return [
      {
        // すべてのページに上記ヘッダを適用
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // 環境情報を返すレスポンスヘッダ "X-Powered-By: Next.js" を非表示にする
  // （フレームワーク特定の手掛かりを与えない）
  poweredByHeader: false,

  // ===== 使用ライブラリ／フレームワークのバージョン情報をクライアントに露出させない設定 =====
  //
  // ▼ 本番ビルドではブラウザ向けソースマップを生成しない
  //   ソースマップを公開すると、元のファイル構成・依存ライブラリ名・モジュール内部までが
  //   クライアントから参照できてしまい、バージョン特定（→既知脆弱性の悪用）に直結します。
  //   デバッグが必要な時だけ一時的に true にし、すぐ false に戻す運用を推奨。
  productionBrowserSourceMaps: false,

  // ▼ 本番ビルド時に console.* 呼び出しを SWC で削除（error だけ残す）
  //   開発中の console.log にバージョン文字列や内部情報が紛れ込んだまま
  //   本番に出てしまう事故を防ぎます。error は運用監視に有用なので除外。
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },

  // 補足：
  //  - "Server: Vercel" 等のホスティング由来のヘッダはアプリ側から完全には削除できません
  //    （Vercel / CloudFront / Nginx などの最前面が付与するため）。
  //  - generator メタタグ（<meta name="generator">）は Next.js は付けないので追加対策不要です。
  //  - React.version は実行時オブジェクトから参照可能ですが、これはランタイム必須の挙動です。
};

export default nextConfig;
