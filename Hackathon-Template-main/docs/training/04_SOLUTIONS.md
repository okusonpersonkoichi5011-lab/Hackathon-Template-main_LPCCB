# 解答編 — 演習の答え合わせ

> 先に `03_EXERCISES.md` で自力でやってから読みましょう。

---

## Q1. サイト名を変える ★

`lib/siteConfig.ts`:
```ts
export const siteConfig = {
  siteName: "あなたの名前カンパニー",  // ← ここ
  // ...
};
```

ヘッダー・タイトル・フッターは全部このファイルを参照しているので **1か所変更で全反映**。

---

## Q2. テーマカラーを青に変える ★

`app/globals.css`:
```css
:root {
  --color-primary: #2563eb;            /* ← yellow → blue */
  --color-primary-foreground: #ffffff; /* 青に黒文字は読みづらいので白に */
}
```

ボタン・下線・カードのホバー枠線などがすべて青に。

---

## Q3. フッターのコピーライト年を「動的」にする ★

`components/Footer.tsx`:
```tsx
<p className="text-xs text-slate-500">
  © {new Date().getFullYear()} {siteConfig.siteName}
</p>
```

`new Date().getFullYear()` で実行時の年を取得。サーバコンポーネントなのでビルド時に確定します。

---

## Q4. ヘッダーロゴをクリックでトップに戻る ★

`components/Header.tsx`:
```tsx
import Link from "next/link";

<Link href="/" className="flex items-center gap-2">
  <img src="/images/lightpath-logo.png" alt="..." />
  <span>株式会社ライトパス</span>
</Link>
```

すでに `Link` で囲まれている場合は OK。`<a>` だとフルリロードになるので必ず `Link`。

---

## Q5. 特徴カードを4枚に増やす ★

`lib/data/homeFeatures.ts`:
```ts
export const homeFeatures = [
  { title: "...", body: "..." },
  { title: "...", body: "..." },
  { title: "...", body: "..." },
  { title: "サポート体制", body: "受付から導入まで一貫してサポートします。" }, // ←追加
];
```

`app/page.tsx` 側は `.map` なので **何枚あっても自動で増える**。グリッドが崩れるなら `lg:grid-cols-4` に。

---

## Q6. ボタンにホバーで暗くなる効果 ★★

ボタン要素のクラスに `hover:brightness-95 transition` を追加:
```tsx
<button className="rounded-md bg-primary text-primary-foreground hover:brightness-95 transition">
  送信
</button>
```

または `hover:bg-amber-500` で別色指定。

---

## Q7. 新しいページ「/news」を作る ★★

`app/news/page.tsx`（新規作成）:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "株式会社ライトパスからのお知らせ一覧。",
};

const newsList = [
  { date: "2026-06-20", title: "新サービス開始", body: "..." },
  { date: "2026-05-10", title: "本社移転", body: "..." },
  { date: "2026-04-01", title: "新年度の挨拶", body: "..." },
];

export default function NewsPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">お知らせ</h1>
      <ul className="mt-8 space-y-6">
        {newsList.map((n) => (
          <li key={n.date} className="border-b pb-4">
            <p className="text-sm text-slate-500">{n.date}</p>
            <h2 className="text-lg font-bold">{n.title}</h2>
            <p className="mt-2">{n.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

---

## Q8. ヘッダーに「お知らせ」追加 ★★

`components/Header.tsx` のナビ配列:
```tsx
const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/service", label: "サービス" },
  { href: "/news", label: "お知らせ" },  // ←追加
  { href: "/company", label: "会社情報" },
  { href: "/recruit", label: "採用情報" },
  { href: "/contact", label: "お問い合わせ" },
];
```

---

## Q9. ニュースデータを切り出す ★★

`lib/data/news.ts`（新規）:
```ts
export type NewsItem = {
  date: string;
  title: string;
  body: string;
};

export const newsList: NewsItem[] = [
  { date: "2026-06-20", title: "新サービス開始", body: "..." },
  // ...
];
```

`app/news/page.tsx`:
```tsx
import { newsList } from "@/lib/data/news";
// 以後は newsList をそのまま .map
```

---

## Q10. 送信ボタンにアイコン追加 ★★

絵文字版（インストール不要）:
```tsx
<button>
  <span aria-hidden>✉️</span> 送信する
</button>
```

`lucide-react` 版:
```tsx
import { Send } from "lucide-react";

<button className="inline-flex items-center gap-2">
  <Send className="h-4 w-4" /> 送信する
</button>
```

---

## Q11. マーキーの速度を半分に ★★

`app/globals.css`:
```css
.lp-marquee {
  animation: lp-marquee 64s linear infinite;  /* 32s → 64s */
}
```

---

## Q12. お問い合わせに件名追加 ★★

`components/ContactForm.tsx`:
```tsx
// state
const [data, setData] = useState({
  name: "",
  subject: "",  // ←追加
  email: "",
  message: "",
});

// 入力UI
<FieldRow label="件名" required>
  <input
    value={data.subject}
    onChange={(e) => setData({ ...data, subject: e.target.value })}
    className={inputClass()}
    required
  />
</FieldRow>

// 確認画面
<dt>件名</dt><dd>{data.subject}</dd>
```

バリデーション：空文字なら送信ボタン無効化 (`disabled={!data.subject}`)。

---

## Q13. 採用カードのレスポンシブ ★★

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {jobs.map(...)}
</div>
```

---

## Q14. Reveal に "zoom" variant 追加 ★★

`app/globals.css`:
```css
@keyframes lp-zoom {
  from { opacity: 0; transform: scale(1.2); }
  to   { opacity: 1; transform: scale(1); }
}
.reveal-in-zoom { animation: lp-zoom 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
```

`components/Reveal.tsx`:
```ts
const variantClass = {
  "fade-up": "reveal-in",
  "fade":    "reveal-in-fade",
  "scale":   "reveal-in-scale",
  "fade-up-strong": "reveal-in-strong",
  "slide-right": "reveal-in-slide-right",
  "slide-left":  "reveal-in-slide-left",
  "zoom": "reveal-in-zoom",  // ←追加
};
```

`type` 側の union にも `"zoom"` を追加。

---

## Q15. ダークモードもどき ★★

`app/globals.css`:
```css
:root {
  --color-background: #0f172a;
  --color-surface:    #1e293b;
  --color-primary:    #ebc528;
  --color-primary-foreground: #0f172a;
  --color-muted:      #1e293b;
  --color-muted-foreground: #94a3b8;
  --color-border:     #334155;
  --color-accent:     #ffffff;
}

body {
  @apply bg-background text-slate-100 antialiased;  /* slate-900 → slate-100 */
}
```

各ページの `text-slate-900` などの直書きクラスは個別に置換が必要（ここが大規模リファクタの練習）。

---

## Q16. サービス詳細を動的ルーティングで ★★★

`lib/data/services.ts`:
```ts
export type Service = {
  slug: "system" | "infra" | "helpdesk";
  title: string;
  description: string;
  scope: string[];
  pricing: string;
};

export const services: Service[] = [
  { slug: "system", title: "システム開発", description: "...", scope: ["要件定義", "設計", "開発"], pricing: "月額60万〜" },
  { slug: "infra", title: "インフラ構築", description: "...", scope: ["設計", "構築", "運用"], pricing: "月額50万〜" },
  { slug: "helpdesk", title: "ヘルプデスク", description: "...", scope: ["1次対応", "FAQ整備"], pricing: "月額30万〜" },
];
```

`app/service/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { services } from "@/lib/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">{service.title}</h1>
      <p className="mt-4">{service.description}</p>
      {/* 提供範囲、料金、CTAなど */}
    </section>
  );
}
```

---

## Q17. 文字数カウンタ ★★★

```tsx
const max = 1000;
const len = data.message.length;
const color =
  len > 800 ? "text-red-600" :
  len > 500 ? "text-amber-600" :
  "text-slate-500";

<p className={`mt-1 text-xs ${color}`}>
  現在 {len} / {max}
</p>
```

---

## Q18. PDFサムネプレビュー ★★★

```bash
npm install pdfjs-dist
```

```tsx
"use client";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

async function inspectPdf(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  return { pages: pdf.numPages };
}
```

ファイル選択時に `inspectPdf(file)` を呼び、`useState` の `pdfMeta` に保存→表示。

---

## Q19. インタビューの絞り込み ★★★

```tsx
"use client";
const [filter, setFilter] = useState<"all" | "system" | "infra" | "helpdesk">("all");
const visible = filter === "all" ? jobs : jobs.filter((j) => j.category === filter);

return (
  <>
    <div className="flex gap-2">
      {(["all", "system", "infra", "helpdesk"] as const).map((c) => (
        <button
          key={c}
          onClick={() => setFilter(c)}
          className={filter === c ? "bg-primary" : "bg-slate-200"}
        >
          {c}
        </button>
      ))}
    </div>
    {visible.map(...)}
  </>
);
```

`lib/data/jobs.ts` に `category` プロパティを追加するのを忘れずに。

---

## Q20. 最終更新日時 ★★★

`components/Footer.tsx`（サーバコンポーネント）:
```tsx
export function Footer() {
  const updatedAt = new Date().toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric",
  });
  return (
    <footer>
      {/* ... */}
      <p className="text-xs text-slate-400">最終更新：{updatedAt}</p>
    </footer>
  );
}
```

サーバコンポーネント内なので **ビルド時の値** が固定で埋め込まれます。
（クライアントコンポーネントだとアクセスごとに更新されるので注意）

---

おつかれさまでした。
次は **`05_DEBUG_DRILLS.md`** でバグ修正の腕試しへ。
