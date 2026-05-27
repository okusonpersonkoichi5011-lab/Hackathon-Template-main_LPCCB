# 公開（デプロイ）手順ガイド

このサイト（Next.js）をインターネットに公開するための手順をまとめています。
**結論から言うと、一番かんたんで無料なのは「GitHub に上げて Vercel と連携する」方法**です。

---

## 0. 公開の全体像（3ステップ）

```
1. ソースコードを GitHub に置く（リポジトリ作成）
        ↓
2. ホスティングサービス（Vercel など）と GitHub を連携 → 自動でビルド＆公開
        ↓
3. （任意）独自ドメインを設定し、Google Search Console に登録
```

一度連携すれば、以降は **GitHub に push するだけで自動的に再公開**されます。

---

## 1. 公開前チェックリスト（必須）

公開する前に、最低限ここだけは確認してください。

- [ ] **本番 URL を設定する（最重要）**
  `lib/siteConfig.ts` の `siteUrl` を、実際に公開するドメインに書き換えます。
  ここを直すと sitemap / robots / OGP / canonical（正規 URL）すべてに反映されます。
  ```ts
  // lib/siteConfig.ts
  siteUrl: "https://your-project.vercel.app", // ← 公開URLに変更
  ```
  > URL が確定するのはデプロイ後のことも多いです。その場合は「先にデプロイ → URL が決まったら siteUrl を直して再 push」でOK。

- [ ] **ビルドが通るか確認**（ローカルで）
  ```bash
  npm install
  npm run build
  ```
  エラーが出なければ公開可能な状態です。

- [ ] （任意）**OGP 画像**を入れたい場合は `app/opengraph-image.png`（推奨 1200×630）を置くだけで自動採用されます。
- [ ] （任意）**ファビコン**は `app/icon.svg` を用意済みです。差し替えたい場合は同じ場所のファイルを置き換えてください。

---

## 2. 方法A：Vercel（★推奨・無料・最速）

Next.js の開発元が運営しているサービスで、追加設定がほぼ不要です。

### 手順

1. **GitHub にコードを上げる**
   - GitHub アカウントを作成（未作成の場合）
   - 新しいリポジトリを作成（Private でも可）
   - このプロジェクトを push する：
     ```bash
     git init
     git add .
     git commit -m "initial commit"
     git branch -M main
     git remote add origin https://github.com/＜あなた＞/＜リポジトリ名＞.git
     git push -u origin main
     ```
     > すでに git 管理されている場合は `git add . && git commit && git push` だけでOK。

2. **Vercel に登録**
   - https://vercel.com にアクセスし、「Continue with GitHub」でサインアップ。

3. **プロジェクトをインポート**
   - 「Add New… → Project」→ 先ほどの GitHub リポジトリを選択。
   - フレームワークは自動で **Next.js** と認識されます。設定は基本そのままで「Deploy」。

4. **完了**
   - 1〜2分で `https://＜プロジェクト名＞.vercel.app` の形で公開されます。
   - 以降は GitHub に push するたびに自動で再デプロイされます。

5. **URL を反映**
   - 公開 URL が決まったら `lib/siteConfig.ts` の `siteUrl` をその URL に変更し、再度 push。

> 注：`next.config.ts` には Vercel 向けのセキュリティヘッダ等がすでに入っています。追加設定は不要です。

---

## 3. 方法B：Cloudflare Pages（無料枠が大きい / CDN が高速）

1. コードを GitHub に上げる（方法A の手順1と同じ）。
2. https://dash.cloudflare.com → 「Workers & Pages」→「Create」→「Pages」→「Connect to Git」。
3. リポジトリを選択し、ビルド設定を以下にします：
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output**: 自動（Next.js プリセットに従う）
4. 「Save and Deploy」で公開。`https://＜プロジェクト＞.pages.dev` が割り当てられます。

> Next.js の一部機能（画像最適化など）で追加アダプタが必要になる場合があります。シンプルな本サイトでは概ねそのまま動きますが、エラー時は Cloudflare の Next.js ガイドを参照してください。

---

## 4. 方法C：Netlify（GitHub 連携でかんたん）

1. コードを GitHub に上げる（方法A の手順1と同じ）。
2. https://app.netlify.com →「Add new site → Import an existing project」→ GitHub を選択。
3. ビルド設定：
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`（Netlify の Next.js プラグインが自動設定します）
4. 「Deploy site」で公開。`https://＜ランダム名＞.netlify.app` が割り当てられます。

---

## 5. 独自ドメインを使う場合（任意）

`◯◯◯.com` のような独自ドメインを使いたいとき：

1. ドメインを取得（お名前.com / Google Domains / Cloudflare Registrar など）。
2. ホスティング側の管理画面で「Custom Domain（カスタムドメイン）」を追加。
   - Vercel: Project → Settings → Domains → ドメインを入力。
3. 表示される **DNS レコード（A / CNAME）** を、ドメイン管理画面に設定。
4. 反映後、自動で HTTPS（SSL 証明書）が有効になります。
5. **`lib/siteConfig.ts` の `siteUrl` を独自ドメインに変更**して再 push。

---

## 6. 公開後にやる SEO 作業（重要）

公開して終わりではなく、検索エンジンに「登録」してもらう作業をします。

### 6-1. Google Search Console に登録
1. https://search.google.com/search-console にアクセス。
2. 「URL プレフィックス」で公開 URL を入力して所有権を確認
   （Vercel の場合は DNS かタグ設置で確認できます）。
3. 「サイトマップ」メニューで **`sitemap.xml`** を送信
   （このサイトは `https://＜あなたのURL＞/sitemap.xml` で自動生成済み）。

### 6-2. 動作確認（公開後にブラウザで開くだけ）
- `https://＜あなたのURL＞/sitemap.xml` … ページ一覧が出るか
- `https://＜あなたのURL＞/robots.txt` … `Sitemap:` 行が正しい URL か

### 6-3. （任意）Bing Webmaster Tools
- https://www.bing.com/webmasters でも同様にサイトマップを送信すると、Bing/Edge 経由の流入が増えます。

### 6-4. シェア表示の確認
- 公開 URL を X（旧 Twitter）や Slack に貼って、カード表示（タイトル・説明）が出るか確認。
- OGP 画像を入れる場合は `app/opengraph-image.png`（1200×630）を追加して再 push。

---

## 7. よくあるつまずき

| 症状 | 原因・対処 |
| --- | --- |
| OGP / sitemap の URL が `example.com` のまま | `lib/siteConfig.ts` の `siteUrl` を実際の URL に変更して再 push |
| 検索結果に出てこない | 公開直後は未登録。Search Console でサイトマップ送信 → 数日〜数週間で反映 |
| ビルドが失敗する | ローカルで `npm run build` を実行し、出たエラーを修正してから push |
| まだ検索に出したくない | `app/robots.ts` を `disallow: "/"`、`app/layout.tsx` の `robots.index` を `false` に一時変更 |

---

## まとめ（最短ルート）

1. `lib/siteConfig.ts` の `siteUrl` を確認（後で直してもOK）
2. GitHub に push
3. Vercel と連携 → 自動公開
4. 公開 URL を `siteUrl` に反映して再 push
5. Google Search Console で `sitemap.xml` を送信

これで「公開」＋「検索エンジンへの登録」まで完了します。
