# 企業ホームページ制作テンプレート（社内ハッカソン向け）

Next.js（App Router）+ TypeScript + Tailwind CSS で作った、**初心者でも触れやすい**企業サイトの土台です。  
完成品ではなく「育てる前提」のフレームワーク型テンプレートなので、**色・文言・画像・セクション追加**で各チームの個性が出しやすいよう、あえてシンプルにしています。

---

## このテンプレートの目的

- デフォルトの会社情報・文言は **[株式会社ライトパス](https://light-path.co.jp/)** の公開内容に合わせています（ハッカソン用の別会社にする場合は `lib/siteConfig.ts` などを書き換えてください）。
- ハッカソン参加者が、環境構築やフォルダ設計に時間を取られず**すぐデザイン・実装に入れる**
- ただし**テンプレ感の塊にならない**よう、改造しやすい余白とデータの切り出しを用意する
- **API / DB / 複雑な状態管理なし**の静的サイトとして、まず「見た目と情報設計」に集中できる

---

## 起動方法

### 必要なもの

- [Node.js](https://nodejs.org/)（LTS 推奨：例 20.x 以上）

### コマンド

プロジェクトのルート（`package.json` がある場所）で実行します。

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

### 本番ビルド（動作確認）

```bash
npm run build
npm start
```

---

## ディレクトリ構成（ざっくり）

```
app/                    … ページ（ルーティング）
  layout.tsx            … 全体のレイアウト（ヘッダー・フッター）
  page.tsx              … TOP
  globals.css           … 全体のスタイル + 配色（CSS 変数）
  company/page.tsx      … 会社案内（/company）
  service/page.tsx      … サービス案内
  contact/page.tsx      … お問い合わせ（採用サンプル + フォーム風 UI）

components/             … 部品（無理に増やしすぎない方針）
  Header.tsx
  Footer.tsx
  Hero.tsx
  SectionTitle.tsx
  FeatureCard.tsx
  ServiceCard.tsx

lib/
  siteConfig.ts         … サイト名・ナビ・連絡先など「サイト全体の設定」
  data/
    services.ts         … サービス一覧（サービスページの中身）
    homeFeatures.ts     … TOP の特徴カード
    jobs.ts             … 募集職種サンプル（お問い合わせページ）
```

---

## 各ファイルの役割

| 場所 | 役割 |
|------|------|
| `app/layout.tsx` | 全ページ共通の枠組み。メタデータ（タイトル等）と `Header` / `Footer` を配置。 |
| `app/globals.css` | Tailwind の読み込みと、**配色の CSS 変数**（`:root`）。全体のトーンを変える入口。 |
| `app/page.tsx` | TOP。ヒーロー、特徴、サービス・お問い合わせへの導線。 |
| `app/company/page.tsx` | 会社概要、代表挨拶、事業内容（ライトパス公式の公開情報ベース）。 |
| `app/service/page.tsx` | サービス案内（データ駆動）と強みセクション。 |
| `app/contact/page.tsx` | 採用サンプル、連絡先、フォーム風 UI（送信なし）。 |
| `components/Header.tsx` | ロゴ横の社名とナビ。ナビ内容は `siteConfig` 由来。 |
| `components/Footer.tsx` | フッターのリンクとコピーライト。 |
| `components/Hero.tsx` | 大きな見出しと CTA ボタン。複数ページで再利用。 |
| `components/SectionTitle.tsx` | セクション見出しの統一 UI。 |
| `components/FeatureCard.tsx` | TOP の特徴紹介などで使うカード。 |
| `components/ServiceCard.tsx` | サービス紹介のカード（`services.ts` の形に合わせる）。 |
| `lib/siteConfig.ts` | **サイト名・ナビ・連絡先**など、横断的な文字情報。 |
| `lib/data/services.ts` | **サービス一覧**。ここを編集・複製するとサービスが増える。 |
| `lib/data/homeFeatures.ts` | TOP の特徴カード用データ。 |
| `lib/data/jobs.ts` | 募集職種のサンプル。 |

---

## 初心者が最初に触るべき箇所（おすすめ順）

1. **`lib/siteConfig.ts`** … サイト名・ナビ・連絡先。ここを変えるだけで「別会社っぽく」なる。  
2. **`app/globals.css` の `:root`** … 主色（`--color-primary`）など。**配色の心臓部**。  
3. **`app/page.tsx` の `Hero` の props** … TOP のキャッチコピーと説明文。  
4. **`lib/data/services.ts`** … サービス紹介の中身。  
5. **`components/Hero.tsx` のプレースホルダー直下** … 画像やイラストを置くと一気にオリジナル化しやすい。

---

## カスタマイズしやすいポイント一覧

| やりたいこと | 主に触る場所 |
|--------------|----------------|
| サイト名・ナビ・電話・住所等 | `lib/siteConfig.ts` + `app/layout.tsx`（メタデータは siteName から生成） |
| 配色（ブランドカラー） | `app/globals.css` の CSS 変数、`tailwind.config.ts`（必要なら） |
| TOP のキャッチ・導線 | `app/page.tsx`、`components/Hero.tsx` |
| 特徴カードの文言 | `lib/data/homeFeatures.ts` |
| サービス一覧 | `lib/data/services.ts`（項目を複製して増やせる） |
| 募集職種サンプル | `lib/data/jobs.ts` |
| 会社紹介の文章 | `app/company/page.tsx` |
| 画像を足す | `public/` に画像を置き、`next/image` で読み込み（Hero のコメント付近など） |
| セクションを足す | 各 `app/**/page.tsx` で `<section>` をコピペして増やす |
| カードの見た目を変える | `FeatureCard.tsx` / `ServiceCard.tsx` |

---

## サイト名を変えたいとき

- **`lib/siteConfig.ts` の `siteName`・`siteNameEn`・`shortDescription`** を変更してください。  
- ヘッダー・フッター・ブラウザタブ（`layout.tsx` の `metadata`）に反映されます。

---

## 色を変えたいとき

- **`app/globals.css` の `:root` 内の CSS 変数**を編集するのが一番わかりやすいです。  
  - 特に **`--color-primary`**（ボタンやアクセント）  
  - **`--color-accent`**（小さな強調色）  
  - 背景や境界線は **`--color-background` / `--color-border`** など  
- Tailwind 側では `tailwind.config.ts` で `primary` などが CSS 変数に紐づいています。

---

## サービス一覧を変えたいとき

- **`lib/data/services.ts` の `services` 配列**を編集します。  
- 項目を**複製**して `id` / `title` / `summary` / `points` を書き換えると、サービスページにそのまま反映されます。  
- 見た目の調整は **`components/ServiceCard.tsx`** です。

---

## ページを追加する方法（基本）

1. `app/` 以下にフォルダを作り、`page.tsx` を置く（例：`app/recruit/page.tsx` → URL は `/recruit`）。  
2. **`lib/siteConfig.ts` の `nav`** にリンクを追加すると、ヘッダー・フッターから辿れるようになります。  
3. 新ページでも **`Hero` / `SectionTitle`** を使うと、既存ページとトーンが揃いやすいです。

---

## Vercel へデプロイする

1. このリポジトリを GitHub などに push する（任意ですが推奨）。  
2. [Vercel](https://vercel.com/) で New Project → リポジトリを選択。  
3. Framework Preset が **Next.js** と認識されることを確認し、Deploy。  

`next.config.ts` に特殊な設定は入れていません。**そのままデプロイしやすい構成**です。

---

## ハッカソン参加者向け：おすすめ改造ポイント

発表で「自分たちで作った感」が出やすい順に挙げます。

1. **配色とタイポグラフィ**（`globals.css` + フォント変更）  
2. **ヒーローにビジュアル**（写真・イラスト・チームロゴ）  
3. **事例セクションの追加**（実績がなくても「想定事例」で OK）  
4. **料金・プラン表**（デモ数字でよいので、サービスページの余白枠に配置）  
5. **お問い合わせの送信**（Server Actions や外部フォームサービスへ差し替え）  
6. **採用ページを独立**（`/recruit` を新設し、`contact` からリンク）

---

## 技術メモ（制約の確認）

- **追加ライブラリ最小**（このテンプレート単体では UI ライブラリなし）  
- **API / DB なし**・**状態管理ライブラリなし**  
- **フォーム送信なし**（デモ。ボタンは `type="button"`）  
- アニメーションは控えめ（メンテしやすさ優先）

---

## ライセンス・利用について

社内ハッカソン用途を想定しています。社外配布やライセンス方針は運営ルールに合わせて調整してください。

---

## 困ったとき

- `npm run build` が通るか確認（型エラーや import ミスが分かります）。  
- まず **`lib/siteConfig.ts` と `app/globals.css`** を戻すと、壊れても立て直しやすいです。
