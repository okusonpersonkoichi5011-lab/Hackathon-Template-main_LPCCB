# コードツアー編 — ファイル別「読み歩き」ガイド

このドキュメントは、本サイトのコードを **読む順序に沿って** 解説します。
レッスン編で文法を学んだら、ここで「実物がどう組まれているか」を体験してください。

> 推奨ペース：1ファイル 10〜20分。1日2〜3ファイルずつでOK。

---

## ツアーマップ（読む順番）

```
1. lib/siteConfig.ts                  ← サイト全体の設定
2. app/layout.tsx                     ← 全ページ共通の枠
3. app/globals.css                    ← 色とアニメーションの源泉
4. tailwind.config.ts                 ← Tailwindと色変数の橋渡し
5. components/Header.tsx              ← 共通ヘッダー
6. components/Footer.tsx              ← 共通フッター
7. app/page.tsx                       ← トップページ
8. components/FeatureCard.tsx         ← 最小のコンポーネント
9. lib/data/homeFeatures.ts           ← データ定義
10. components/Reveal.tsx             ← スクロール出現アニメ
11. app/company/page.tsx              ← 会社情報ページ
12. app/recruit/page.tsx              ← 採用ページ
13. components/EmployeeInterviews.tsx ← 開閉できる社員紹介
14. components/RecruitForm.tsx        ← エントリーフォーム
15. components/form-utils.tsx        ← フォーム共通部品
16. app/api/upload-resume/route.ts   ← PDF検証 API
17. next.config.ts                    ← セキュリティと画像設定
```

---

## 1. `lib/siteConfig.ts` — サイト全体の設定

**なぜ最初に読むか**：会社名、URL、SNSリンクなど **全ページで参照される定数** がここに集まっているからです。

🔍 読みどころ
- `siteName` / `siteNameEn`：日本語社名と英表記
- `siteUrl`：本番 URL（OGPやcanonicalで使う）
- `externalLinks`：公式サイト・Instagram などの外部リンクをここで一元管理

💡 ポイント：「定数は集める」「呼び出し側ではこのファイルだけ見ればよい」状態を作る。

---

## 2. `app/layout.tsx` — 全ページ共通の枠

**役割**：HTML の `<html>` `<head>` `<body>` を構成。ヘッダーとフッターは全ページ共通なのでここに配置。

🔍 読みどころ
- `metadata`：title・description・OGP・robots など SEO 関連の集合体
- `organizationJsonLd`：Google向けの構造化データ
- `<html className="no-js">` ＋ インラインスクリプトで `no-js` を外す **JS無効フォールバック**
- `suppressHydrationWarning`：上記の意図的差分の警告抑制

💡 ポイント：層の重なりは
`html → body → Header → main(children) → Footer`
の順。`children` が各ページの中身になります。

---

## 3. `app/globals.css` — 色とアニメーションの源泉

**役割**：CSS変数（色）と全アニメーションのキーフレームを定義。

🔍 読みどころ
- `:root { --color-primary: #ebc528; ... }`：色テーマの集中管理場所
- `@keyframes lp-fade-up / lp-fade-in / lp-scale-in / lp-slide-in-right / lp-slide-in-left / lp-fade-up-strong`：6種類の動き
- `.reveal-init` `.reveal-in*`：`Reveal` コンポーネントが利用するクラス
- `.no-js .reveal-init`：JS無効時のフォールバック（必ず表示）
- `@media (prefers-reduced-motion: reduce)`：動きを減らす設定の人への配慮

💡 ポイント：色を変えたい時はここの `--color-*` を編集するだけ。アニメ追加もこのファイルで完結。

---

## 4. `tailwind.config.ts` — Tailwindと色変数の橋渡し

**役割**：`bg-primary` のようなクラス名と、CSS変数 `--color-primary` を結びつける設定。

🔍 読みどころ
- `theme.extend.colors`：`primary: "var(--color-primary)"` の対応
- `content`：Tailwind がクラスをスキャンする対象ファイル指定

💡 ポイント：このマッピングのおかげで「Tailwindのクラス名から CSS 変数経由で色が決まる」流れが成立します。

---

## 5. `components/Header.tsx` — 共通ヘッダー

🔍 読みどころ
- 上部 = ロゴ＋ナビ、下部 = サブメニュー、と縦に2層構造
- `Link` コンポーネント（`next/link`）：高速なクライアントサイド遷移
- スマホ用ハンバーガー：`useState` で開閉トグル
- スクロールで背景が変わる効果は `useEffect` + `scroll` イベント

💡 ポイント：ヘッダーはサイトで一番見られる場所。ここを丁寧に作るとサイト全体の印象が締まります。

---

## 6. `components/Footer.tsx` — 共通フッター

🔍 読みどころ
- `grid` レイアウト：列数をブレークポイントで切替
- 各セクション（会社情報・サービス・採用・SNS）はデータ駆動

💡 ポイント：フッターは「サイトマップ」も兼ねる。SEO 的にも内部リンクの集まりとして大事。

---

## 7. `app/page.tsx` — トップページ

🔍 読みどころ
- 上から順に：Hero（キャッチコピー）→ 特徴3カード → 写真バンド（マーキー）→ 会社情報抜粋 → CTA
- `homeFeatures.map(...)` でカードを量産（Lesson 8の実例）
- `<Reveal variant="fade-up-strong">` でスクロール出現

💡 ポイント：トップページはランディング。1スクロールで会社が何屋か伝わる構造を意識。

---

## 8. `components/FeatureCard.tsx` — 最小のコンポーネント

🔍 読みどころ
- たった数十行で「再利用部品」が完成している
- `props` の型定義 (`type FeatureCardProps`)
- Tailwindクラスで色・余白・角丸を指定

💡 ポイント：すべてのコンポーネントの **最小単位** のサンプル。ここを読めば他のコンポーネントもパターンが分かります。

---

## 9. `lib/data/homeFeatures.ts` — データ定義

🔍 読みどころ
- ただの配列＋型注釈
- ページ側 (`app/page.tsx`) で `import { homeFeatures }` して使う

💡 ポイント：データを別ファイルに置くと「言葉づかいを変えたい」時もコンポーネントを触らずに済む。

---

## 10. `components/Reveal.tsx` — スクロール出現アニメ

🔍 読みどころ
- `"use client"` 宣言（IntersectionObserver はブラウザAPIのため）
- `useRef` で DOM 要素を捕まえる
- `useEffect` で Observer を登録／クリーンアップ
- `setTimeout(3000)`：万が一 Observer が発火しなかった場合の **3秒セーフティタイマー**
- `variant` props で6種類のクラスを切替

💡 ポイント：「アニメの裏で何が起きているか」を知ると、ハマったときの原因切り分けが速くなります。

---

## 11. `app/company/page.tsx` — 会社情報ページ

🔍 読みどころ
- セクション構成：会社概要 → ミッション → 沿革 → 所在地（地図）
- `<Reveal variant="slide-right">` `slide-left` を左右で使い分け
- `metadata` を上書きしてページ専用のtitleに

💡 ポイント：定型情報ページの作り方の標準テンプレ。新しい情報ページを作るときの雛形にできます。

---

## 12. `app/recruit/page.tsx` — 採用ページ

🔍 読みどころ
- 募集職種カード → 社員インタビュー → エントリーフォームの3層構造
- `lp-card-hover-zoom` カードのホバー演出
- インタビュー (`EmployeeInterviews`) とフォーム (`RecruitForm`) はクライアントコンポーネント

💡 ポイント：「サーバ部品で枠を作り、必要な所だけ `"use client"` で動的に」が App Router の基本パターン。

---

## 13. `components/EmployeeInterviews.tsx` — 開閉できる社員紹介

🔍 読みどころ
- `useState(false)` で開閉管理
- 開閉ボタンのテキスト・アイコンを三項演算子で切替
- `lib/data/jobs.ts` から4人分のデータを受け取って `.map`

💡 ポイント：「開閉」「タブ」「モーダル」などUIの "状態" は全部 useState で素直に書けます。

---

## 14. `components/RecruitForm.tsx` — エントリーフォーム

🔍 読みどころ
- **3段階フロー**：入力 → 確認 → 送信完了（`step` という state で管理）
- ラジオボタン部分：「正社員 / パート・アルバイト」の2択
- PDF 添付：3層検証（拡張子 → MIMEタイプ → マジックバイト `%PDF-`）
- 郵便番号 → 住所自動補完（Zipcloud API）
- 必須/任意バッジ（赤/緑）は `Badge` 共通部品で
- ボタン配色：黄色 (`bg-primary`)

💡 ポイント：本サイトで最も複雑なコンポーネント。**全部一気に読まず**、まずは「3段階フローの骨」だけ理解しよう。

---

## 15. `components/form-utils.tsx` — フォーム共通部品

🔍 読みどころ
- `Badge`：必須＝赤500 / 任意＝エメラルド500
- `FieldRow`：ラベル＋入力欄＋エラーの定型レイアウト
- `validatePdfFile`：PDF検証ロジック（再利用可能）
- `fetchAddressFromPostalCode`：郵便番号→住所変換

💡 ポイント：複数フォームで使う部品はここに集約。`ContactForm` と `RecruitForm` の両方が利用しています。

---

## 16. `app/api/upload-resume/route.ts` — PDF検証 API

🔍 読みどころ
- `export async function POST(req: Request)`：Next.js の Route Handler
- `req.formData()` でファイル取得
- 検証順：① content-type → ② 拡張子 → ③ マジックバイト
- 失敗時：`return new Response('Bad Request', { status: 400 })`

💡 ポイント：**クライアント側の検証は突破される前提**で、サーバ側でも同じ検証をする。これがセキュリティの基本。

---

## 17. `next.config.ts` — セキュリティと画像設定

🔍 読みどころ
- `securityHeaders`：X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Permissions-Policy / HSTS など
- `poweredByHeader: false`：`X-Powered-By: Next.js` ヘッダを削除（バージョン秘匿）
- `productionBrowserSourceMaps: false`：本番でソースマップを出さない（内部構造の秘匿）
- `compiler.removeConsole`：本番ビルドで console.log を削除（error 以外）
- `images`：AVIF/WebP優先、30日キャッシュ

💡 ポイント：セキュリティは「画面に出ない設定ファイル」で決まることが多い。本ファイルを通読すると、本サイトの防御層が見えてきます。

---

## ツアー完了後

ここまで読めば、本サイトのコードは **おおよそ全部見たことがある状態** になります。
次は **`03_EXERCISES.md`** で、自分の手で改造する課題に挑戦してみましょう。
