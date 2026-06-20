# デバッグ編 — バグを直す7問

「動かない／表示が変／警告が出る」を**自分で原因特定して直す**ための演習。
"症状" を読んでから、自分で仮説を立て、最後の **解答** を見て答え合わせしてください。

---

## 環境トラブル一覧（演習に入る前に）

| 症状 | 原因と対処 |
|---|---|
| `npm run dev` で `command not found: npm` | Node.js 未インストール → `nodejs.org` から LTS をインストール |
| `Error: Cannot find module '@/components/...'` | パスエイリアス `@/` が効いていない → `tsconfig.json` の `paths` 確認 |
| ブラウザに表示されない（白画面）| 開発者ツールのコンソールにエラーがあるはず → そこから読む |
| `Hydration mismatch` | サーバとクライアントで HTML が違う → 原因の section を特定 |
| 画像が表示されない | `/public/images/xxx.jpg` が実在するか確認 |
| Tailwind が効かない | `tailwind.config.ts` の `content` に対象ファイルが含まれているか |

---

## Drill 1：トップページが真っ白 ★

### 症状
`npm run dev` 後、`http://localhost:3000` を開くとブラウザが真っ白。
コンソールにこんなエラー:

```
Unexpected token 'export'
```

### 仕掛けたバグ
`app/page.tsx` の冒頭が:

```tsx
import { Reveal } from "@/components/Reveal"
import { FeatureCard } from "@/components/FeatureCard"

export default function HomePage(
  return <main>...</main>;
}
```

### あなたの推理
- どこか1か所、TypeScript/JSXの **構文** が壊れているはず…

<details>
<summary>解答を見る</summary>

`export default function HomePage(` の **閉じ括弧 `)`** が抜けています。正しくは:
```tsx
export default function HomePage() {
  return <main>...</main>;
}
```

教訓：「ブラウザが真っ白」「サーバが起動しない」系は、まずコンソールの **構文エラー** を疑う。
</details>

---

## Drill 2：ボタンを押しても何も起きない ★★

### 症状
カウンタコンポーネント:
```tsx
"use client";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={setCount(count + 1)}>
      カウント：{count}
    </button>
  );
}
```

押しても増えず、開いた瞬間「Too many re-renders」エラー。

### あなたの推理
- onClick に渡しているのが…

<details>
<summary>解答を見る</summary>

`onClick={setCount(count + 1)}` は **その場で setCount を実行** してしまい、レンダ→state変化→再レンダ→...の無限ループに。

正解は **関数を渡す**:
```tsx
<button onClick={() => setCount(count + 1)}>
```

教訓：`onClick` には「関数そのもの」を渡す（実行結果ではない）。
</details>

---

## Drill 3：Hydration mismatch エラー ★★

### 症状
コンソールに:
```
Hydration failed because the server rendered HTML didn't match the client.
```

該当箇所:
```tsx
export function Now() {
  return <p>現在時刻：{new Date().toISOString()}</p>;
}
```

### あなたの推理
- サーバとブラウザで `new Date()` の結果は…

<details>
<summary>解答を見る</summary>

サーバ側レンダ時刻とクライアントhydrate時刻が違うため、HTML差分が出る。

修正：クライアントだけで描画する:
```tsx
"use client";
import { useEffect, useState } from "react";

export function Now() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    setT(new Date().toISOString());
  }, []);
  return <p>現在時刻：{t ?? "..."}</p>;
}
```

教訓：「実行のたびに値が変わるもの（時刻・ランダム・ブラウザAPI）」を SSR で出すと必ずズレる。
</details>

---

## Drill 4：Tailwindクラスが効かない ★★

### 症状
新しく作った `<button className="bg-emerald-500">送信</button>` が無色のまま。
他のページの `bg-primary` などは効いている。

### あなたの推理
- そもそも Tailwind がそのファイルを **スキャン対象** にしているか…

<details>
<summary>解答を見る</summary>

`tailwind.config.ts` の `content` に新しいフォルダ（例：`src/legacy/`）が含まれていなかった、または **タイポ**（`bg-emrald-500`）。

確認手順:
1. クラス名のスペルが正しいか
2. `tailwind.config.ts` の `content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", ...]` に対象パスが含まれているか
3. 開発サーバを再起動（content 設定変更後は必須）

教訓：Tailwind は「使われているクラスだけ」をビルドに含める仕組み（JIT）。スキャン外のファイルは無視される。
</details>

---

## Drill 5：next/image で 画像が出ない ★★

### 症状
```tsx
<Image src="/images/team.jpg" alt="" />
```

ビルドエラー:
```
Image is missing required "width" property
```

### あなたの推理
- `<Image>` の必須プロパティは…

<details>
<summary>解答を見る</summary>

`next/image` は **`width`/`height`** または **`fill`** が必須。

```tsx
<Image src="/images/team.jpg" alt="" width={1200} height={800} />
```

または親要素の `position: relative` と一緒に:
```tsx
<div className="relative aspect-video">
  <Image src="/images/team.jpg" alt="" fill className="object-cover" />
</div>
```

教訓：`<img>` と違って `<Image>` は寸法が必要（レイアウトシフト防止のため）。
</details>

---

## Drill 6：フォームが送信できない ★★★

### 症状
入力フォームの送信ボタンを押しても、何も起きずに画面が **ページの先頭にスクロールするだけ**。

```tsx
<form>
  <input value={name} onChange={(e) => setName(e.target.value)} />
  <button onClick={() => alert("送信！")}>送信</button>
</form>
```

### あなたの推理
- `<button>` のデフォルト挙動は…
- `<form>` のデフォルト挙動は…

<details>
<summary>解答を見る</summary>

`<button>` のデフォルト `type` は **`submit`**。`<form>` 内で押すとフォーム送信 → ページ遷移（リロード）が起きる。

修正:
```tsx
<button type="button" onClick={() => alert("送信！")}>送信</button>
```

または `<form>` 側で送信を受ける:
```tsx
<form onSubmit={(e) => { e.preventDefault(); alert("送信！"); }}>
  ...
  <button type="submit">送信</button>
</form>
```

教訓：`<form>` 内に裸の `<button>` を書くと submit 扱い。意図的でなければ `type="button"`。
</details>

---

## Drill 7：本番ビルドで表示崩れ ★★★

### 症状
- ローカル `npm run dev` では完璧に見える
- `npm run build && npm start` で本番ビルドすると、特定のカードだけ Tailwind が効かない

開発:
```tsx
const colorClass = `bg-${color}-500`;  // color = "emerald"
<div className={colorClass}>
```

### あなたの推理
- Tailwind は「使われているクラス」を **どのタイミングで** スキャン…

<details>
<summary>解答を見る</summary>

Tailwind は **静的な文字列** しかスキャンできない。`bg-${color}-500` のような動的な文字列は **本番ビルドのpurgeで削除** されてしまう。

修正：可能なクラスを **すべて静的に書いておく**:
```tsx
const colorClassMap = {
  emerald: "bg-emerald-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
} as const;

<div className={colorClassMap[color]}>
```

または `safelist` 設定で強制保護:
```ts
// tailwind.config.ts
safelist: ["bg-emerald-500", "bg-red-500", "bg-blue-500"],
```

教訓：「dev では動くのに本番で消える」系は Tailwind の purge を最初に疑う。
</details>

---

## 7問クリアしたら

おめでとうございます。あなたは **画面が壊れたとき** に「コンソールを読む」「仕掛けを推理する」「直す」の流れを身につけた状態です。

これは現場で最も差がつくスキルです。

次は **`06_WORKSHOP_GUIDE.md`** で、他の人に教える側に回るためのガイドへ。
