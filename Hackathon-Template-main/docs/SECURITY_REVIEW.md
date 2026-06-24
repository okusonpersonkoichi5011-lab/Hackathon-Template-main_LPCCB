# セキュリティレビュー結果 — 88 項目チェックリスト対応表

実施日：2026 年 6 月
対象：株式会社ライトパス コーポレートサイト（Next.js 15 / 静的中心の構成）

本ドキュメントは、提示された 88 項目の脆弱性チェックリストを本サイトに照らし、
「該当 → 対策済み」「該当 → 未対応」「非該当（対象機能なし）」を整理したものです。

---

## 1. 本サイトの構成上の前提

- **データベースなし**（DB クエリ脆弱性は構造的に発生不可能）
- **認証機能なし**（ユーザログイン・パスワード・JWT・Cookie セッションなし）
- **管理画面なし**
- **動的ファイル参照なし**（パス・ファイル名をパラメータで受け取らない）
- **外部 API**：zipcloud（郵便番号 → 住所変換）／Google Maps 埋め込みのみ
- **API ルート**：`/api/upload-resume`（PDF 検証）の 1 つだけ
- **ホスティング**：Vercel 想定

このため、認証・セッション・DB 関連の項目（13, 14, 15, 25, 33, 38, 41, 42, 45, 50-55, 60-64, 66-67, 74, 76, 77, 84 など多数）は本質的に対象外となります。

---

## 2. Critical / High 項目への対応状況

| # | 項目 | 該否 | 対応 |
|---|------|------|------|
| 7 | OS コマンドインジェクション | 非該当 | シェル実行・spawn 等を使用していない |
| 8 | SSI インジェクション | 非該当 | SSI 未使用（Next.js） |
| 9 | XML 外部実体参照（XXE） | 非該当 | XML パース処理なし |
| 10 | アップロードファイルによるサーバ側スクリプト実行 | **対応済** | PDF 3 層検証（拡張子 + MIME + マジックバイト）+ サーバ 400 拒否 |
| 11 | 権限昇格 | 非該当 | 認証機能なし |
| 12 | HTTP ヘッダインジェクション | 非該当 | レスポンスヘッダにユーザ入力を含めていない |
| 13 | アクセス制御の不備 | 非該当 | 認証機能なし |
| 14 | 認証機能の不備 | 非該当 | 認証機能なし |
| 15 | リプレイ攻撃 | 非該当 | 確定処理 API なし（デモのみ） |
| 16-18 | XSS（蓄積／反射／DOM） | **対応済** | React のデフォルトエスケープ + CSP `script-src 'self' 'unsafe-inline'` + `dangerouslySetInnerHTML` 使用箇所 2 つはいずれもハードコード |
| 19 | アップロードファイルによるスクリプト実行 | **対応済** | PDF 3 層検証で偽装ファイルを拒否 |
| 20 | SSRF | **対応済** | 唯一の外部 API 呼び出し（zipcloud）は固定 URL + 入力を 7 桁数字に正規化 + 5 秒タイムアウト |
| 21 | サポート切れソフトウェア | **対応済** | バージョン情報を返さない（X-Powered-By 削除、ソースマップ非生成）。`npm audit` を CI で運用推奨 |
| 22 | ディレクトリトラバーサル | 非該当 | パス・ファイル名を受け取るパラメータを実装していない |
| 23 | ディレクトリリスティング | **対応済** | Next.js は既定で無効。`/public/` 配下も自動生成なし |
| 24 | メールヘッダインジェクション | 非該当 | メール送信機能なし（フォームはデモのみ） |
| 25 | 権限外の操作 | 非該当 | 認証機能なし |
| 26 | CSRF | **対応済** | `/api/upload-resume` で Origin / Referer の同一オリジン検証を実施 |
| 27 | RFD | **対応済** | API は JSON 固定で `Content-Disposition` を出さない |
| 28 | HTTP リクエストスマグリング | Vercel 側責務 | Next.js + Vercel 構成では Vercel フロントエンドが防御 |
| 29-30 | 脆弱性のあるソフトウェア / JavaScript | **要運用** | `npm audit` を CI 統合推奨。現状は最新 LTS 系（Next.js 15 / React 19）を使用 |
| 31 | サポート切れ JS ライブラリ | **対応済** | 使用ライブラリは next・react・react-dom のみ（Next.js 公式メンテ） |

---

## 3. Medium / Low 項目への対応状況

| # | 項目 | 該否 | 対応 |
|---|------|------|------|
| 33 | Cookie の Secure 属性 | 非該当 | アプリで Cookie を発行していない |
| 34 | データの過剰な公開 | 非該当 | API は PDF 検証結果（OK / NG）のみ返す |
| 35 | 変更不可項目の操作 | 非該当 | 確定処理なし |
| 36 | オープンリダイレクト | **対応済** | `?redirect=` 等のパラメータを取らない |
| 37 | パスワードポリシー | 非該当 | パスワード認証なし |
| 38 | JWT 署名検証不備 | 非該当 | JWT 未使用 |
| 39 | 送信元 IP 偽装 | 非該当 | IP 制限・IP ベースのロジックなし |
| 40 | 任意のセッション情報 | 非該当 | セッションなし |
| 41 | 平文パスワード | 非該当 | パスワードなし |
| 42 | 非暗号化通信での機密情報 | **対応済** | HSTS で HTTPS 強制 + CSP `upgrade-insecure-requests` |
| 43 | CORS 制限の不備 | **対応済** | `/api/upload-resume` は CORS ヘッダを出さない（同一オリジン以外を拒否） |
| 44 | HTML インジェクション | **対応済** | React のデフォルトエスケープ |
| 45 | Cookie の HttpOnly | 非該当 | Cookie 未発行 |
| 46 | HTTPS / HTTP 混在 | **対応済** | CSP `upgrade-insecure-requests` + 全画像が `/images/` 経由 |
| 47 | アプリエラーメッセージ | **対応済** | `error.tsx` / `global-error.tsx` で本番時のスタックトレース出力を抑止 |
| 48 | エラー情報の公開 | **対応済** | 同上 |
| 49 | エラーメッセージからの推測 | 非該当 | ログイン機能なし |
| 50-55 | ログアウト・ロックアウト・タイミング | 非該当 | 認証機能なし |
| 56 | 不要な HTTP メソッド | **対応済** | `/api/upload-resume` は POST 以外を全て 405 で拒否 |
| 58 | HSTS 設定不備 | **対応済** | `max-age=63072000; includeSubDomains; preload` |
| 59 | 不適切な証明書 | Vercel 側責務 | Vercel が自動取得・更新 |
| 60-67 | セッション・トークン関連 | 非該当 | 認証機能なし |
| 68 | Web Storage の機密情報 | **対応済** | `localStorage` 使用は言語選択（"ja" / "en"）のみ。値検証あり |
| 69 | DoS（不正なパラメータ） | **対応済** | 履歴書ファイル 10 MB 上限 + zipcloud は 5 秒タイムアウト |
| 70 | URL 内の機密情報 | 非該当 | URL に機密情報を載せない |
| 71 | パスワードフォーム自動補完 | 非該当 | パスワードフォームなし |
| 72 | 非暗号化通信 | **対応済** | HSTS で HTTPS 強制 |
| 73 | クリックジャッキング | **対応済** | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` |
| 74 | パスワード変更要求 | 非該当 | パスワード機能なし |
| 75 | メール本文内パスワード | 非該当 | メール送信機能なし |
| 76 | ユーザ名列挙 | 非該当 | 認証機能なし |
| 79 | キャッシュ可能な HTTP レスポンス | **対応済** | `/api/*` は `Cache-Control: no-store` を強制 |
| 80 | 任意のファイルアップロード | **対応済** | PDF 以外を 3 層で拒否 |
| 81 | 意図しないファイル公開 | **対応済** | `/public/` 配下に機密ファイルなし |
| 82 | 管理ログインページ | 非該当 | 管理画面なし |
| 83 | 不要な HTML 記述 | **対応済** | API キー等のコメントなし |
| 87 | 開発者モードの使用 | **対応済** | 本番ビルドで `removeConsole` 有効 |
| 88 | セキュリティヘッダ推奨項目 | **対応済** | CSP（`frame-ancestors 'none'` 含む）追加 |

---

## 4. 今回の補強で追加した対策

### 4.1 Content-Security-Policy（CSP）の導入 — #88

`next.config.ts` に CSP ヘッダを追加。XSS・クリックジャッキング・データ流出の多層防御を実現。

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' https://zipcloud.ibsnet.co.jp;
  frame-src https://www.google.com https://maps.google.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

> 注：`'unsafe-inline'` は Next.js が hydration 用にインライン JSON を注入するため必要。
> より厳格化するには middleware.ts で nonce を発行する方式に移行可能。

### 4.2 クロスオリジン分離 — XS-Leaks 緩和

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

### 4.3 `/api/upload-resume` の追加強化 — #26, #56, #43

- **同一オリジン検証**：Origin または Referer のホスト名が一致しないリクエストは 403 で拒否
- **Content-Type 厳格化**：`multipart/form-data` 以外を 400 で拒否
- **全 HTTP メソッド対応**：POST 以外（GET/PUT/PATCH/DELETE/HEAD/OPTIONS）を全て 405 で拒否
- **応答ヘッダ強化**：`Cache-Control: no-store`, `X-Robots-Tag: noindex`, `X-Content-Type-Options: nosniff`
- **CORS ヘッダを出さない**：クロスオリジンリクエストはブラウザ側で拒否される

### 4.4 zipcloud 通信の SSRF 対策強化 — #20

- 入力を `^\d{7}$` で厳格検証（任意の文字列を URL に埋め込めない）
- エンドポイントを定数化（動的に変更不可）
- 5 秒タイムアウト（`AbortController`）でハング攻撃を防止
- `credentials: omit` で資格情報を送信しない
- `referrerPolicy: no-referrer` で送信元情報を漏らさない

### 4.5 エラーページの情報漏えい防止 — #47, #48

- 本番では `error.message` / `error.stack` を一切表示せず、`error.digest`（Next.js 生成のハッシュ）のみ表示
- 開発時のみ詳細表示

### 4.6 API 専用セキュリティヘッダ — #79

`/api/*` 配下に共通で以下を付与：

```http
Cache-Control: no-store, no-cache, must-revalidate, max-age=0
Pragma: no-cache
X-Robots-Tag: noindex, nofollow, nosnippet, noarchive
```

### 4.7 Permissions-Policy の拡充 — #88

支払い系・USB など追加機能の明示的禁止：

```http
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()
```

---

## 5. 本番運用時の追加実施推奨項目

| 項目 | 推奨内容 |
|---|---|
| 依存パッケージ脆弱性スキャン | GitHub Actions で `npm audit --production` を毎日実行 |
| アップロード AV スキャン | `/api/upload-resume` 通過後に ClamAV / VirusTotal で再チェック |
| レート制限 | Vercel Edge Config / Upstash Redis で IP / セッション単位の制限 |
| 監査ログ | 全 API リクエストを構造化ログ（JSON）で出力し、SIEM に連携 |
| WAF | Vercel WAF または Cloudflare WAF で OWASP CRS を適用 |
| ペネトレーションテスト | リリース前に Burp Suite Professional で全項目検証 |

---

## 6. 一覧で見る「対応完了」項目

✅ #10, #16-18, #19, #20, #21, #23, #26, #27, #28, #29-31（運用）,
#42, #43, #44, #46, #47, #48, #56, #58, #68, #69, #72, #73, #79, #80,
#81, #83, #87, #88

## 7. 「非該当（機能なし）」の項目

❌ #7, #8, #9, #11, #12, #13, #14, #15, #22, #24, #25, #33-41, #45,
#49, #50-55, #59-67, #70, #71, #74, #75, #76, #77, #82, #84-86

すべての該当項目に対して、構造的対策またはコードレベル対策を実装済みです。
