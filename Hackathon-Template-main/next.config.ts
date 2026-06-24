import type { NextConfig } from "next";

/**
 * ========================================
 * セキュリティ用のレスポンスヘッダ
 * ----------------------------------------
 * 88 項目の脆弱性チェックリスト（OWASP 系）への対応として、
 * 本サイトに該当する以下の項目をヘッダで防御しています。
 *  - クリックジャッキング（#73）
 *  - MIME スニッフィング由来の XSS（#16-18 補強）
 *  - Referer 漏えい
 *  - 不要なブラウザ機能の禁止
 *  - HTTPS 強制（HSTS, #58）
 *  - フレームワーク特定の防止（#21）
 *  - CSP による XSS / クリックジャッキング多層防御（#88）
 *  - 非暗号化通信の自動アップグレード（#72）
 * ========================================
 *
 * ★ OneDrive 配下で発生する `.next` 同期衝突については、
 *    `scripts/fix-onedrive.mjs` が `.next` を AppData への
 *    Junction（NTFS シンボリックリンク）として作成することで回避します。
 *    Next.js の `distDir` はプロジェクト外を指せないため、distDir 設定では対処できません。
 */

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy
 * ★ 開発環境（npm run dev）と本番で挙動が異なる点に注意：
 *
 *  - 開発時は Next.js の HMR（Hot Module Replacement）が eval() を使うため
 *    `'unsafe-eval'` を許可する必要があります。
 *    また dev server は ws://localhost:PORT で WebSocket 接続するので
 *    `connect-src` に `ws:` を追加します。
 *
 *  - 本番ビルドでは eval も WebSocket も使われないので、より厳格な CSP を適用します。
 *
 *  - frame-ancestors 'none' は両方で有効（クリックジャッキング防止）
 *  - HSTS は本番のみで意味があるので、開発時は無効にして
 *    localhost が常時 https に強制アップグレードされる事故を防ぎます。
 */
function buildCSP(): string {
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

  const connectSrc = isDev
    ? "connect-src 'self' ws: wss: https://zipcloud.ibsnet.co.jp"
    : "connect-src 'self' https://zipcloud.ibsnet.co.jp";

  const directives = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    connectSrc,
    "frame-src 'self' https://www.google.com https://maps.google.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  // upgrade-insecure-requests は本番のみ
  // （開発 http://localhost を https に強制すると即時破綻するため）
  if (!isDev) {
    directives.push("upgrade-insecure-requests");
  }
  return directives.join("; ");
}

const securityHeaders = [
  // CSP（#88）：XSS / クリックジャッキングの多層防御
  { key: "Content-Security-Policy", value: buildCSP() },
  // クリックジャッキング対策（#73）
  { key: "X-Frame-Options", value: "DENY" },
  // MIME スニッフィング防止
  { key: "X-Content-Type-Options", value: "nosniff" },
  // 外部サイト遷移時の Referer を最小限に
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // ブラウザ機能（カメラ・マイク等）を一切要求しないことを明示
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
  },
  // 旧 XSS フィルタは無効化が推奨（IE 旧版向け）
  { key: "X-XSS-Protection", value: "0" },
  // クロスオリジン分離（XS-Leaks / Spectre 系攻撃の緩和）
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

// 本番のみ付与するヘッダ群（HSTS / CORP）
const productionOnlyHeaders = isDev
  ? []
  : [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      // CORP は dev で next/image など同一オリジンでも一部の最適化で
      // クロスオリジン扱いになる場合があるため、本番のみ厳格化
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    ];

const allSecurityHeaders = [...securityHeaders, ...productionOnlyHeaders];

/**
 * /api/* 配下用の専用ヘッダ。
 * - キャッシュさせない（#79：機微情報のキャッシュ防止）
 * - 検索エンジンへのインデックスを完全に禁止
 */
const apiSecurityHeaders = [
  { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
  { key: "Pragma", value: "no-cache" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet, noarchive" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // 全ページに共通セキュリティヘッダ
        source: "/:path*",
        headers: allSecurityHeaders,
      },
      {
        // API ルートには追加でキャッシュ禁止・noindex
        source: "/api/:path*",
        headers: [...allSecurityHeaders, ...apiSecurityHeaders],
      },
    ];
  },

  // X-Powered-By: Next.js を出力しない（#21, #78 バージョン情報の秘匿）
  poweredByHeader: false,

  // 本番ブラウザ向けソースマップを出さない（依存関係・コード構造の漏えい防止）
  productionBrowserSourceMaps: false,

  // 本番ビルドで console.* を SWC で削除（error だけ残す）
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },

  // next/image：AVIF / WebP 配信、30日キャッシュ、inline 表示
  // dangerouslyAllowSVG は意図的に false（SVG XSS の防止）
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    contentDispositionType: "inline",
    dangerouslyAllowSVG: false,
  },

  // 本サイト固有の補足：
  //  - Vercel / CloudFront / Nginx 等が付与する "Server" ヘッダはアプリ側から削除不可
  //  - <meta name="generator"> は Next.js が付けないので追加対策不要
  //  - HTTP/2 リクエストスマグリング（#28）は Vercel フロントエンドの責務
};

export default nextConfig;
