# レッスン編 — 全15回

各レッスンは「学ぶ概念 → 既存コードのどこを見るか → 自分で手を動かす」の3点セットです。

> 受講前提：HTML / CSS は少し触ったことがある。Tailwind / React / Next.js は初めて。

---

## Lesson 1 — 環境を整えて、サイトを動かしてみる

🎯 ゴール：Next.js プロジェクトを起動して、ホットリロードを体感する。

1. **Node.js** が入っているか確認：`node --version` で v18 以上が出れば OK
2. プロジェクトに移動：`cd Hackathon-Template-main`
3. 依存をインストール（初回のみ）：`npm install`
4. 開発サーバを起動：`npm run dev`
5. ブラウザで `http://localhost:3000` を開く

🛠 やってみよう：`lib/siteConfig.ts` の `siteName: "株式会社ライトパス"` を別の名前に変えて保存。**ブラウザを更新せずに**ヘッダーが切り替わったら成功です（=ホットリロード）。

💡 ポイント：Web 開発は「ファイルを保存 → 自動でブラウザが追従」のサイクルが速いほど楽しい。

---

## Lesson 2 — フォルダ=URL の世界（App Router）

🎯 ゴール：「`app/foo/page.tsx` を作ると `/foo` で開ける」を理解する。

Next.js（App Router）では URL がフォルダ構造で決まります。

| ファイル | URL |
|---|---|
| `app/page.tsx` | `/` |
| `app/company/page.tsx` | `/company` |
| `app/recruit/page.tsx` | `/recruit` |
| `app/api/upload-resume/route.ts` | `/api/upload-resume`（APIエンドポイント） |

🛠 やってみよう：`app/test/page.tsx` を作って中身に `export default function Test(){ return <h1>テスト</h1>; }` と書く → `http://localhost:3000/test` で表示されることを確認。

⚠️ 注意：作ったあとはコミットしないファイルなので、確認後は `app/test` フォルダごと削除してOK。

💡 ポイント：URL = フォルダ。ページの中身 = `page.tsx`。これだけで Next.js のルーティングはほぼ完結します。

---

## Lesson 3 — Tailwind CSS の考え方

🎯 ゴール：`text-lg font-bold text-slate-900` のような「ユーティリティクラス」で UI を作る感覚を掴む。

CSS を別ファイルに書かず、HTML の `class` に直接書きます。例：

```tsx
<button className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
  送信
</button>
```

| クラス | 意味 |
|---|---|
| `rounded-md` | 角丸 6px |
| `bg-primary` | 背景色を CSS 変数 `--color-primary`（黄色）に |
| `px-5 py-3` | 左右 padding 1.25rem、上下 0.75rem |
| `text-sm` | font-size 14px |
| `font-medium` | font-weight 500 |
| `text-primary-foreground` | 文字色を CSS 変数で |

🛠 やってみよう：`components/Footer.tsx` のコピーライト下を探して、`text-xs` を `text-base` に変えてみる → 文字が大きくなれば OK。

💡 ポイント：覚えるのではなく **エディタの補完** に頼る。VS Code に「Tailwind CSS IntelliSense」拡張を入れると候補が出ます。

---

## Lesson 4 — CSS変数とTailwindの組み合わせ（色テーマ）

🎯 ゴール：色を1か所変えるだけでサイト全体に反映される仕組みを理解する。

`app/globals.css` の冒頭を見てください:

```css
:root {
  --color-primary: #ebc528;     /* 黄色 */
  --color-primary-foreground: #0f172a;
  /* ... */
}
```

`tailwind.config.ts` で:
```ts
colors: {
  primary: "var(--color-primary)",
  "primary-foreground": "var(--color-primary-foreground)",
}
```

→ `bg-primary` `text-primary-foreground` が **常に CSS 変数経由**で色を取得するようになります。

🛠 やってみよう：`--color-primary: #ebc528;` を `#2563eb;`（青）に変えて保存 → ボタン・下線がすべて青に変わる。元に戻す。

💡 ポイント：「色は CSS 変数で集中管理」。直接 `bg-yellow-500` などを書かないことで、テーマ変更が一発で終わります。

---

## Lesson 5 — レスポンシブ（モバイルファースト）

🎯 ゴール：「`sm:` `md:` `lg:` の使い分け」を理解する。

Tailwind では **プレフィックスなし=モバイル既定**、`sm:` 以降が大画面の上書きです。

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  ...
</div>
```

→ モバイル：1列、640px以上：2列、1024px以上：3列。

🛠 やってみよう：ブラウザの DevTools を開き、ウィンドウ幅を狭めて、TOP の特徴 3カードが 1 列 → 2 列 → 3 列と切り替わるのを確認。

💡 ポイント：常に「小さい画面ベースで考え、大きい画面で上書き」する。逆だと PC のスタイルがモバイルに漏れて崩れます。

---

## Lesson 6 — React コンポーネント

🎯 ゴール：「関数 = コンポーネント」「JSX = HTML っぽい構文」を理解する。

`components/FeatureCard.tsx` を開いてください。たった数行で 1 つの UI 部品ができています。

```tsx
type FeatureCardProps = {
  title: string;
  body: string;
};

export function FeatureCard({ title, body }: FeatureCardProps) {
  return (
    <article className="...">
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}
```

呼び出し側 (`app/page.tsx`):
```tsx
<FeatureCard title="専門スキル" body="..." />
```

🛠 やってみよう：`FeatureCard` の `<article>` に `border-l-4 border-primary` を追加。すべての特徴カードの左に黄色い線が出れば OK（**1か所変えると全箇所に反映**＝再利用の効果）。

💡 ポイント：UI を「**部品の積み重ね**」として見る。これが React 的思考の中心です。

---

## Lesson 7 — props でデータを渡す

🎯 ゴール：「同じ部品に違うデータを流し込んで違う見た目を作る」を体得。

```tsx
<FeatureCard title="A" body="aaa" />
<FeatureCard title="B" body="bbb" />
```

`title` と `body` が **props**（プロパティ）。型は `type FeatureCardProps = {...}` で定義します（TypeScript）。

🛠 やってみよう：`FeatureCard` に新しい props `accent?: "yellow" | "green"` を追加し、`accent="green"` のときだけ左の線が緑になるよう改造してみる。

💡 ポイント：TypeScript の型定義は、エディタに「ここに何を書けばいいか」を教えるためのもの。最初は呪文だが、慣れると最強の補完が手に入ります。

---

## Lesson 8 — データを配列で管理して `.map` する

🎯 ゴール：「データは別ファイル、見た目は map で量産」を理解する。

`lib/data/homeFeatures.ts`:
```ts
export const homeFeatures = [
  { title: "...", body: "..." },
  { title: "...", body: "..." },
  { title: "...", body: "..." },
];
```

`app/page.tsx`:
```tsx
{homeFeatures.map((feature) => (
  <FeatureCard key={feature.title} title={feature.title} body={feature.body} />
))}
```

🛠 やってみよう：`homeFeatures.ts` に 4 つめのアイテムを追加して保存 → ページに 4 つ目のカードが自動で増える。`key` を消すとどうなるか試してみる（コンソールに警告が出る）。

💡 ポイント：データと見た目を分離すると、コンテンツ変更が **データファイル1つの編集** だけで終わります。

---

## Lesson 9 — 画像の扱い（next/image）

🎯 ゴール：`<img>` の代わりに `<Image>` を使う理由を知る。

```tsx
import Image from "next/image";

<Image
  src="/images/photo.jpg"
  alt="説明"
  width={1200}
  height={800}
  priority
/>
```

Next.js がやってくれること:
- ブラウザに合わせて **WebP/AVIF** 配信
- ビューポートに応じて **複数サイズ** 用意
- **遅延読み込み**（priority がない画像は viewport に入るまで読まない）

🛠 やってみよう：`components/FeatureCard.tsx` に `<Image src="/images/lightpath-logo.png" width={40} height={40} alt="" />` を追加。表示されれば OK。

⚠️ 注意：`fill` プロパティを使う場合は **親に `position: relative` と寸法**（aspect-ratio や h-*）が必要です。

💡 ポイント：画像はサイト表示速度の最大の敵。Next.js Image を使うだけで自動で速くなります。

---

## Lesson 10 — フォームの基本

🎯 ゴール：`<form>` `<input>` `<label>` の組み立てを Tailwind 流に書く。

```tsx
<form>
  <label htmlFor="name">お名前</label>
  <input id="name" type="text" required className="rounded border px-3 py-2" />
  <button type="submit" className="rounded bg-primary px-5 py-2">送信</button>
</form>
```

🛠 やってみよう：`components/ContactForm.tsx` を見て、`<input>` のスタイル（`inputClass()` 関数）を観察。空のフォームを別ファイルに作って、姓・メールアドレス・送信ボタンだけのフォームを再現してみる。

💡 ポイント：`<label htmlFor="id">` で `<input id="id">` と対応付けると、ラベルクリックで入力欄にフォーカスが当たるようになります（地味だが UX 大事）。

---

## Lesson 11 — useState で状態管理

🎯 ゴール：「ボタンを押したら何かが変わる」をReact 流に書く。

```tsx
"use client";   // ← 状態を持つコンポーネントは "use client" 宣言が必須

import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>カウント：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

🛠 やってみよう：`components/EmployeeInterviews.tsx` の中で `useState(false)` が「開閉」を管理しているのを観察。`open ? "閉じる" : "開く"` の出し分けがどう動いているか手で追ってみる。

💡 ポイント：「state が変わると React が再描画する」が React の核。最初はピンと来なくても、書いて動かすうちに馴染みます。

---

## Lesson 12 — アニメーション

🎯 ゴール：CSS キーフレームと Reveal コンポーネントを使い分ける。

`app/globals.css` のキーフレーム例:
```css
@keyframes lp-fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lp-animate-fade-up { animation: lp-fade-up 0.8s both; }
```

スクロールで表示したい時は `<Reveal>` でラップ:
```tsx
<Reveal variant="slide-right">
  <h2>会社概要</h2>
</Reveal>
```

🛠 やってみよう：`Reveal` の `variant` を `fade-up`, `slide-left`, `scale` に変えて見え方を比較。

💡 ポイント：アニメーションは「やりすぎ注意」。出現の0.5〜1.0秒程度で抑えると上品です。

---

## Lesson 13 — レイアウトの作り方（flex と grid）

🎯 ゴール：Tailwind の `flex` `grid` で並べ替えを自在に。

```tsx
<div className="flex gap-4">   {/* 横並び */}
<div className="grid grid-cols-3 gap-4">  {/* 3列グリッド */}
<div className="flex flex-col gap-2">  {/* 縦並び */}
```

🛠 やってみよう：`components/Footer.tsx` の grid を見て、列数を `lg:grid-cols-4` から `lg:grid-cols-2` に変えると見た目がどう変わるか試す。元に戻す。

💡 ポイント：迷ったら `flex`、明確に「●列にしたい」が決まっているなら `grid`。

---

## Lesson 14 — SEO とメタデータ

🎯 ゴール：「検索結果に出る」「SNSでシェアされた時に見える」仕組みを知る。

`app/layout.tsx`:
```tsx
export const metadata: Metadata = {
  title: { default: "...", template: "%s | ..." },
  description: "...",
  openGraph: { ... },
};
```

各ページ (`app/contact/page.tsx`):
```tsx
export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "...",
};
```

🛠 やってみよう：`/contact` を Google Chrome で開き、DevTools → Elements → `<head>` 内に `<meta name="description">` が入っていることを確認。

💡 ポイント：見えないけど大事な「検索エンジン向けの設定」がここで決まります。

---

## Lesson 15 — デプロイ（Vercel）

🎯 ゴール：自分のサイトをインターネットに公開する。

1. GitHub にプロジェクトを push
2. https://vercel.com にアクセス、GitHub でログイン
3. 「Add New → Project」でリポジトリを選ぶ
4. 設定はそのままで「Deploy」
5. 2〜3 分で `https://<プロジェクト名>.vercel.app` で公開

🛠 やってみよう：本リポジトリを自分の GitHub にコピー（fork）→ Vercel に繋いで公開してみる。詳しくは `DEPLOY.md` を参照。

💡 ポイント：Vercel は Next.js の作者が運営しているので追加設定がほぼ要りません。

---

## レッスン完了後

ここまで読んで手を動かせば、本サイトのコードの大半が「**なぜそうなっているのか**」が見えるようになります。
次は **`02_CODE_TOUR.md`** で実際のファイル群を順に読み歩いてみましょう。
