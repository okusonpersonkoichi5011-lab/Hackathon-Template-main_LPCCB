/**
 * 株式会社ライトパス コーポレートサイト 解説スライド生成スクリプト
 *
 * 使い方:
 *   1) このフォルダで `npm install pptxgenjs` を一度だけ実行
 *   2) `node generate-slides.js` を実行
 *   3) 同フォルダに `サイト解説資料.pptx` が生成されます
 */

const pptxgen = require("pptxgenjs");

// ===== カラーパレット（ライトパスのブランドカラー） =====
const C = {
  brand: "EBC528",       // 黄色（ブランド基調色）
  brandDark: "B8941F",   // 黄色の濃いめ
  dark: "0F172A",        // slate-900 タイトル
  body: "334155",        // slate-700 本文
  muted: "64748B",       // slate-500 補助
  border: "E2E8F0",      // slate-200
  surface: "F8FAFC",     // slate-50 背景
  white: "FFFFFF",
  red: "EF4444",
  green: "10B981",
};

const FONT_TITLE = "Yu Gothic UI";
const FONT_BODY = "Yu Gothic UI";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3" × 7.5"
pres.title = "株式会社ライトパス コーポレートサイト 解説資料";
pres.author = "Light Path Inc.";

const SLIDE_W = 13.3;
const SLIDE_H = 7.5;

/** ページ番号とフッターを差し込むヘルパ */
function addFooter(slide, pageNum, totalPages) {
  // 細い黄色の下線
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: SLIDE_H - 0.45, w: 1.4, h: 0.04,
    fill: { color: C.brand }, line: { color: C.brand },
  });
  slide.addText("LIGHT PATH", {
    x: 0.5, y: SLIDE_H - 0.4, w: 3, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: C.muted, charSpacing: 4,
  });
  slide.addText(`${pageNum} / ${totalPages}`, {
    x: SLIDE_W - 1.2, y: SLIDE_H - 0.4, w: 0.7, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: C.muted, align: "right",
  });
}

/** タイトル＋イエローアクセント */
function addTitle(slide, title, subtitle) {
  // 左に黄色いバー（アクセント）
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.55, w: 0.12, h: 0.8,
    fill: { color: C.brand }, line: { color: C.brand },
  });
  slide.addText(title, {
    x: 0.8, y: 0.5, w: SLIDE_W - 1.3, h: 0.6,
    fontSize: 28, fontFace: FONT_TITLE, bold: true, color: C.dark,
    margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8, y: 1.05, w: SLIDE_W - 1.3, h: 0.35,
      fontSize: 13, fontFace: FONT_BODY, color: C.muted,
      margin: 0,
    });
  }
}

// =============================================================
// Slide 1: タイトル
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  // 大きな黄色いブロック（左下）
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: SLIDE_H - 1.6, w: 4.5, h: 1.6,
    fill: { color: C.brand }, line: { color: C.brand },
  });
  // 黄色いバー（右上）
  s.addShape(pres.shapes.RECTANGLE, {
    x: SLIDE_W - 2.5, y: 0.5, w: 2, h: 0.1,
    fill: { color: C.brand }, line: { color: C.brand },
  });

  s.addText("LIGHT PATH INC.", {
    x: 1, y: 1.5, w: 10, h: 0.4,
    fontSize: 14, fontFace: FONT_BODY, color: C.brand, charSpacing: 6,
    margin: 0,
  });
  s.addText("株式会社ライトパス\nコーポレートサイト 解説資料", {
    x: 1, y: 2.2, w: 11, h: 2.2,
    fontSize: 48, fontFace: FONT_TITLE, bold: true, color: C.white,
    margin: 0, lineSpacingMultiple: 1.1,
  });
  s.addText("見た目編 ＋ コード編", {
    x: 1, y: 4.4, w: 11, h: 0.5,
    fontSize: 18, fontFace: FONT_BODY, color: C.white,
    margin: 0,
  });

  s.addText("Next.js 15 × React 19 × TypeScript × Tailwind CSS", {
    x: 4.7, y: SLIDE_H - 1.05, w: 8, h: 0.4,
    fontSize: 12, fontFace: FONT_BODY, color: C.dark, bold: true,
    margin: 0,
  });
}

// =============================================================
// Slide 2: 目次
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "目次 / Agenda", "資料は2部構成になっています");

  // 左：見た目編
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.8, w: 5.7, h: 5,
    fill: { color: C.surface }, line: { color: C.border, width: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.8, w: 0.15, h: 5,
    fill: { color: C.brand }, line: { color: C.brand },
  });
  s.addText("Part 1", {
    x: 1.1, y: 2, w: 5, h: 0.4,
    fontSize: 12, fontFace: FONT_BODY, color: C.brandDark, bold: true, charSpacing: 4,
    margin: 0,
  });
  s.addText("見た目編", {
    x: 1.1, y: 2.4, w: 5, h: 0.7,
    fontSize: 30, fontFace: FONT_TITLE, bold: true, color: C.dark,
    margin: 0,
  });
  s.addText("デザイン方針・各ページの構成・UX・アニメーション", {
    x: 1.1, y: 3.1, w: 5.1, h: 0.5,
    fontSize: 12, fontFace: FONT_BODY, color: C.muted,
    margin: 0,
  });
  s.addText([
    { text: "サイト全体の方針（色・フォント・レスポンシブ）", options: { bullet: true, breakLine: true } },
    { text: "共通ヘッダー / フッター", options: { bullet: true, breakLine: true } },
    { text: "TOPページの構成", options: { bullet: true, breakLine: true } },
    { text: "会社案内 / 採用情報 / お問い合わせ", options: { bullet: true, breakLine: true } },
    { text: "フォーム3段階フロー", options: { bullet: true, breakLine: true } },
    { text: "アニメーション一覧", options: { bullet: true } },
  ], {
    x: 1.1, y: 3.7, w: 5.2, h: 2.8,
    fontSize: 13, fontFace: FONT_BODY, color: C.body,
    paraSpaceAfter: 4,
  });

  // 右：コード編
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.8, y: 1.8, w: 5.7, h: 5,
    fill: { color: C.surface }, line: { color: C.border, width: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.8, y: 1.8, w: 0.15, h: 5,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  s.addText("Part 2", {
    x: 7.1, y: 2, w: 5, h: 0.4,
    fontSize: 12, fontFace: FONT_BODY, color: C.dark, bold: true, charSpacing: 4,
    margin: 0,
  });
  s.addText("コード編", {
    x: 7.1, y: 2.4, w: 5, h: 0.7,
    fontSize: 30, fontFace: FONT_TITLE, bold: true, color: C.dark,
    margin: 0,
  });
  s.addText("技術スタック・ディレクトリ・主要ロジック・セキュリティ", {
    x: 7.1, y: 3.1, w: 5.1, h: 0.5,
    fontSize: 12, fontFace: FONT_BODY, color: C.muted,
    margin: 0,
  });
  s.addText([
    { text: "技術スタック（Next.js 15 + React 19）", options: { bullet: true, breakLine: true } },
    { text: "ディレクトリ構成", options: { bullet: true, breakLine: true } },
    { text: "コンポーネント設計", options: { bullet: true, breakLine: true } },
    { text: "フォーム実装ロジック", options: { bullet: true, breakLine: true } },
    { text: "セキュリティ対策", options: { bullet: true, breakLine: true } },
    { text: "SEO・デプロイ", options: { bullet: true } },
  ], {
    x: 7.1, y: 3.7, w: 5.2, h: 2.8,
    fontSize: 13, fontFace: FONT_BODY, color: C.body,
    paraSpaceAfter: 4,
  });

  addFooter(s, 2, 16);
}

// =============================================================
// Slide 3: 見た目編セクションタイトル
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  // 大きな黄色いブロック背景
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 3.2, w: 4.5, h: 1.1,
    fill: { color: C.brand }, line: { color: C.brand },
  });
  s.addText("PART 1", {
    x: 1, y: 2, w: 11, h: 0.6,
    fontSize: 18, fontFace: FONT_BODY, color: C.brand, bold: true, charSpacing: 8,
    margin: 0,
  });
  s.addText("見た目編", {
    x: 1, y: 2.7, w: 11, h: 1.2,
    fontSize: 64, fontFace: FONT_TITLE, bold: true, color: C.white,
    margin: 0,
  });
  s.addText("デザイン方針 / 各ページ構成 / UX / アニメーション", {
    x: 1, y: 4.5, w: 11, h: 0.5,
    fontSize: 18, fontFace: FONT_BODY, color: C.white,
    margin: 0,
  });
}

// =============================================================
// Slide 4: デザイン方針＋共通パーツ
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "デザイン方針 / 共通パーツ", "色・タイポグラフィ・ヘッダー・フッター");

  // 1段目：3カラム
  const colY = 1.7, colH = 2.5, colW = 3.9;
  const cols = [
    {
      title: "ブランドカラー",
      icon: "★",
      lines: ["#EBC528（黄色）が基調", "黄色は面 (ボタン背景・下線・ドット)", "文字には濃紺 #0F172A を使用", "必須=赤 #EF4444 / 任意=緑 #10B981"],
    },
    {
      title: "タイポグラフィ",
      icon: "A",
      lines: ["Inter（next/font 経由）", "日本語はシステムフォントへ自動 fallback", "タイトル：lg / xl / 4xl", "本文：text-base が基準"],
    },
    {
      title: "レスポンシブ",
      icon: "▤",
      lines: ["モバイルファースト", "sm: 640px〜（タブレット）", "md: 768px〜（タブ横）", "lg: 1024px〜（PC）"],
    },
  ];
  cols.forEach((c, i) => {
    const x = 0.5 + i * (colW + 0.3);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: colW, h: colH,
      fill: { color: C.surface }, line: { color: C.border, width: 1 },
    });
    // 黄色いアクセント（左上）
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: colW, h: 0.08,
      fill: { color: C.brand }, line: { color: C.brand },
    });
    s.addText(c.icon, {
      x: x + 0.25, y: colY + 0.25, w: 0.5, h: 0.5,
      fontSize: 22, fontFace: FONT_TITLE, bold: true, color: C.brandDark, margin: 0,
    });
    s.addText(c.title, {
      x: x + 0.8, y: colY + 0.28, w: colW - 1, h: 0.45,
      fontSize: 16, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
    });
    s.addText(c.lines.map((t, idx) => ({
      text: t,
      options: { bullet: true, breakLine: idx < c.lines.length - 1 },
    })), {
      x: x + 0.25, y: colY + 0.9, w: colW - 0.5, h: colH - 1,
      fontSize: 11.5, fontFace: FONT_BODY, color: C.body,
      paraSpaceAfter: 3,
    });
  });

  // 2段目：共通パーツ
  const baseY = 4.5;
  // ヘッダー
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: baseY, w: 6.05, h: 2.4,
    fill: { color: C.white }, line: { color: C.border, width: 1 },
  });
  s.addText("共通ヘッダー", {
    x: 0.7, y: baseY + 0.15, w: 5, h: 0.4,
    fontSize: 14, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
  });
  s.addText([
    { text: "Sticky表示。スマホは右からのドロワー", options: { bullet: true, breakLine: true } },
    { text: "ロゴ＋会社名／英文名", options: { bullet: true, breakLine: true } },
    { text: "ハンバーガー押下で背景を暗くしてドロワー", options: { bullet: true, breakLine: true } },
    { text: "ESC・背景タップ・ページ遷移で自動クローズ", options: { bullet: true } },
  ], {
    x: 0.7, y: baseY + 0.6, w: 5.7, h: 1.7,
    fontSize: 11, fontFace: FONT_BODY, color: C.body,
    paraSpaceAfter: 2,
  });

  // フッター
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.75, y: baseY, w: 6.05, h: 2.4,
    fill: { color: C.white }, line: { color: C.border, width: 1 },
  });
  s.addText("共通フッター", {
    x: 6.95, y: baseY + 0.15, w: 5, h: 0.4,
    fontSize: 14, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
  });
  s.addText([
    { text: "グレー背景のシンプルな構成", options: { bullet: true, breakLine: true } },
    { text: "左：社名・住所・営業時間・電話", options: { bullet: true, breakLine: true } },
    { text: "中央：Instagram アイコン（外部リンク）", options: { bullet: true, breakLine: true } },
    { text: "右：サイトナビ＋プライバシーポリシー", options: { bullet: true } },
  ], {
    x: 6.95, y: baseY + 0.6, w: 5.7, h: 1.7,
    fontSize: 11, fontFace: FONT_BODY, color: C.body,
    paraSpaceAfter: 2,
  });

  addFooter(s, 4, 16);
}

// =============================================================
// Slide 5: TOPページ
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "TOPページ", "歯車背景のヒーロー → 特徴3カード → 写真バンド");

  // 縦のフローブロック
  const blocks = [
    { title: "ヒーロー（歯車背景）", desc: "キャッチコピーは画面右から1秒でスライド。説明文は0.5秒遅延" },
    { title: "ライトパスの特徴 3カード", desc: "下から0.5秒でフェードアップ。100/200/300msスタッガー" },
    { title: "採用情報・お問い合わせ", desc: "3つのボタン：採用情報 / お問い合わせ / 会社案内" },
    { title: "写真バンド（マーキー）", desc: "背景画像 + employee1〜3 を右→左に常時マーキー、ホバーで一時停止" },
  ];
  blocks.forEach((b, i) => {
    const y = 1.8 + i * 1.2;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y, w: 7.5, h: 0.95,
      fill: { color: C.surface }, line: { color: C.border, width: 1 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: 1, y: y + 0.2, w: 0.55, h: 0.55,
      fill: { color: C.brand }, line: { color: C.brand },
    });
    s.addText(String(i + 1), {
      x: 1, y: y + 0.2, w: 0.55, h: 0.55,
      fontSize: 18, fontFace: FONT_TITLE, bold: true, color: C.dark,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(b.title, {
      x: 1.7, y: y + 0.12, w: 6.4, h: 0.4,
      fontSize: 14, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
    });
    s.addText(b.desc, {
      x: 1.7, y: y + 0.5, w: 6.4, h: 0.4,
      fontSize: 11, fontFace: FONT_BODY, color: C.muted, margin: 0,
    });
  });

  // 右側：ポイントボックス
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.7, y: 1.8, w: 4, h: 4.9,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  s.addText("POINT", {
    x: 8.95, y: 2, w: 3.5, h: 0.4,
    fontSize: 13, fontFace: FONT_BODY, color: C.brand, bold: true, charSpacing: 4, margin: 0,
  });
  s.addText("ヒーローCTAは1本に整理", {
    x: 8.95, y: 2.45, w: 3.5, h: 0.5,
    fontSize: 16, fontFace: FONT_TITLE, bold: true, color: C.white, margin: 0,
  });
  s.addText([
    { text: "もともと複数ボタンを置いていたが、見せたい情報を絞るためヒーローのCTAは削除。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "代わりに中段の「採用・問い合わせ」セクションを動線として強調。", options: {} },
  ], {
    x: 8.95, y: 3.1, w: 3.5, h: 3.4,
    fontSize: 11, fontFace: FONT_BODY, color: C.white,
    paraSpaceAfter: 4,
  });

  addFooter(s, 5, 16);
}

// =============================================================
// Slide 6: 会社案内ページ
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "会社案内ページ", "総合案内：会社情報＋サービス＋アクセスを1ページに統合");

  // フロー（2列）
  const flow = [
    "COMPANY バナー",
    "集合写真",
    "会社概要（表）",
    "代表挨拶（横長写真＋本文）",
    "サービス案内（旧 /service を統合）",
    "案件実績一覧",
    "アクセスマップ（Googleマップ）",
    "アクセス情報（クリックで拡大）",
  ];

  flow.forEach((label, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i % 4;
    const x = 0.8 + col * 4.5;
    const y = 1.8 + row * 1.2;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4, h: 0.9,
      fill: { color: C.surface }, line: { color: C.border, width: 1 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.08, h: 0.9,
      fill: { color: C.brand }, line: { color: C.brand },
    });
    s.addText(`${String(i + 1).padStart(2, "0")}`, {
      x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.5,
      fontSize: 18, fontFace: FONT_TITLE, bold: true, color: C.brandDark,
      margin: 0,
    });
    s.addText(label, {
      x: x + 0.85, y: y + 0.25, w: 3, h: 0.45,
      fontSize: 13, fontFace: FONT_TITLE, bold: true, color: C.dark,
      valign: "middle", margin: 0,
    });
  });

  // 右側：ハイライト
  s.addShape(pres.shapes.RECTANGLE, {
    x: 9.7, y: 1.8, w: 3.1, h: 4.9,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  s.addText("HIGHLIGHT", {
    x: 9.9, y: 2, w: 2.7, h: 0.4,
    fontSize: 12, fontFace: FONT_BODY, color: C.brand, bold: true, charSpacing: 4, margin: 0,
  });
  s.addText("サービス案内ページを統合", {
    x: 9.9, y: 2.5, w: 2.7, h: 0.9,
    fontSize: 15, fontFace: FONT_TITLE, bold: true, color: C.white,
    margin: 0,
  });
  s.addText([
    { text: "ナビをスリムに保つため、サービス案内ページは退避（page.tsx.bak）", options: { bullet: true, breakLine: true } },
    { text: "/contact への動線は引き続き機能", options: { bullet: true, breakLine: true } },
    { text: "再公開も拡張子を戻すだけで簡単", options: { bullet: true } },
  ], {
    x: 9.9, y: 3.7, w: 2.7, h: 3,
    fontSize: 10.5, fontFace: FONT_BODY, color: C.white,
    paraSpaceAfter: 4,
  });

  addFooter(s, 6, 16);
}

// =============================================================
// Slide 7: 採用情報ページ
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "採用情報ページ", "リード → 募集職種 → メンバー → 流れ → エントリーフォーム");

  // 縦フロー
  const items = [
    { num: "1", title: "Recruit バナー＋リード文", desc: "右からスライドインで登場" },
    { num: "2", title: "募集職種カード（3つ）", desc: "ホバーで scale(1.04) でわずかに拡大" },
    { num: "3", title: "こんな人が集まっています！", desc: "左から写真／右から紹介文＋リストが順に出現" },
    { num: "4", title: "社員インタビュー（開閉式）", desc: "ボタン押下で4枚カードが順番に下から登場。高さ統一" },
    { num: "5", title: "応募の流れ（縦タイムライン）", desc: "黄色いドット同士を黄色い縦線でつなぐ5ステップ" },
    { num: "6", title: "エントリーフォーム", desc: "3段階フロー＋PDF専用検証＋雇用形態の条件分岐" },
  ];
  items.forEach((it, i) => {
    const y = 1.8 + i * 0.78;
    s.addShape(pres.shapes.OVAL, {
      x: 0.7, y: y + 0.15, w: 0.45, h: 0.45,
      fill: { color: C.brand }, line: { color: C.brand },
    });
    s.addText(it.num, {
      x: 0.7, y: y + 0.15, w: 0.45, h: 0.45,
      fontSize: 15, fontFace: FONT_TITLE, bold: true, color: C.dark,
      align: "center", valign: "middle", margin: 0,
    });
    if (i < items.length - 1) {
      s.addShape(pres.shapes.LINE, {
        x: 0.925, y: y + 0.6, w: 0, h: 0.18,
        line: { color: C.brand, width: 2 },
      });
    }
    s.addText(it.title, {
      x: 1.4, y: y + 0.1, w: 9, h: 0.4,
      fontSize: 14, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
    });
    s.addText(it.desc, {
      x: 1.4, y: y + 0.45, w: 9, h: 0.35,
      fontSize: 10.5, fontFace: FONT_BODY, color: C.muted, margin: 0,
    });
  });

  // 右側：フォーム特徴
  s.addShape(pres.shapes.RECTANGLE, {
    x: 10.7, y: 1.8, w: 2.1, h: 4.95,
    fill: { color: C.surface }, line: { color: C.border, width: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 10.7, y: 1.8, w: 2.1, h: 0.08,
    fill: { color: C.brand }, line: { color: C.brand },
  });
  s.addText("Form features", {
    x: 10.85, y: 1.95, w: 1.9, h: 0.3,
    fontSize: 10, fontFace: FONT_BODY, color: C.brandDark, bold: true, charSpacing: 3, margin: 0,
  });
  s.addText([
    { text: "姓名・ふりがな分割", options: { bullet: true, breakLine: true } },
    { text: "郵便番号→住所自動入力", options: { bullet: true, breakLine: true } },
    { text: "履歴書はPDF必須", options: { bullet: true, breakLine: true } },
    { text: "新卒は職務経歴ナシ", options: { bullet: true, breakLine: true } },
    { text: "キャリア・パートはテキスト/ファイル切替", options: { bullet: true, breakLine: true } },
    { text: "クライアント＋サーバ両方でPDF検証", options: { bullet: true } },
  ], {
    x: 10.85, y: 2.4, w: 1.9, h: 4.3,
    fontSize: 10, fontFace: FONT_BODY, color: C.body,
    paraSpaceAfter: 4,
  });

  addFooter(s, 7, 16);
}

// =============================================================
// Slide 8: お問い合わせ＋プライバシー＋フォームフロー
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "お問い合わせ・プライバシー ／ フォーム3段階フロー", "両フォーム共通の入力 → 確認 → 完了");

  // 上半分：2列
  const topY = 1.7, topH = 2;

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: topY, w: 6.05, h: topH,
    fill: { color: C.surface }, line: { color: C.border, width: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: topY, w: 0.12, h: topH,
    fill: { color: C.brand }, line: { color: C.brand },
  });
  s.addText("お問い合わせページ /contact", {
    x: 0.75, y: topY + 0.15, w: 5.5, h: 0.4,
    fontSize: 14, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
  });
  s.addText([
    { text: "Contact バナー＋案内文", options: { bullet: true, breakLine: true } },
    { text: "案内文には個人情報保護方針リンク", options: { bullet: true, breakLine: true } },
    { text: "フォームは採用と同じバッジ＋3カラム行", options: { bullet: true, breakLine: true } },
    { text: "送信ボタンも黄色基調に統一", options: { bullet: true } },
  ], {
    x: 0.75, y: topY + 0.6, w: 5.7, h: 1.4,
    fontSize: 11, fontFace: FONT_BODY, color: C.body,
    paraSpaceAfter: 2,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.75, y: topY, w: 6.05, h: topH,
    fill: { color: C.surface }, line: { color: C.border, width: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.75, y: topY, w: 0.12, h: topH,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  s.addText("プライバシーポリシー /privacy", {
    x: 7, y: topY + 0.15, w: 5.5, h: 0.4,
    fontSize: 14, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
  });
  s.addText([
    { text: "Privacy Policy バナー", options: { bullet: true, breakLine: true } },
    { text: "個人情報の取得・利用目的・第三者提供", options: { bullet: true, breakLine: true } },
    { text: "安全管理・開示・法令遵守", options: { bullet: true, breakLine: true } },
    { text: "お問い合わせ窓口", options: { bullet: true } },
  ], {
    x: 7, y: topY + 0.6, w: 5.7, h: 1.4,
    fontSize: 11, fontFace: FONT_BODY, color: C.body,
    paraSpaceAfter: 2,
  });

  // 下半分：3段階フロー
  s.addText("両フォーム共通：3段階フロー", {
    x: 0.5, y: 4.05, w: 12, h: 0.4,
    fontSize: 14, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
  });

  const stages = [
    { label: "入力", desc: "必須項目チェック\n赤字エラー＋赤枠" },
    { label: "確認", desc: "全項目を表示\n「修正する」で戻れる" },
    { label: "完了", desc: "サンクスメッセージ\n（本番ではAPI送信）" },
  ];
  stages.forEach((st, i) => {
    const x = 0.8 + i * 4.2;
    const y = 4.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 3.6, h: 2,
      fill: { color: i === 0 ? C.brand : C.surface }, line: { color: C.border, width: 1 },
    });
    s.addText(`STEP ${String(i + 1).padStart(2, "0")}`, {
      x: x + 0.2, y: y + 0.2, w: 3.3, h: 0.3,
      fontSize: 11, fontFace: FONT_BODY, color: i === 0 ? C.dark : C.brandDark, bold: true, charSpacing: 4,
      margin: 0,
    });
    s.addText(st.label, {
      x: x + 0.2, y: y + 0.55, w: 3.3, h: 0.5,
      fontSize: 22, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
    });
    s.addText(st.desc, {
      x: x + 0.2, y: y + 1.1, w: 3.3, h: 0.9,
      fontSize: 11, fontFace: FONT_BODY, color: i === 0 ? C.dark : C.body,
      margin: 0,
    });
    if (i < 2) {
      // 矢印代わりの三角形
      s.addShape(pres.shapes.RIGHT_TRIANGLE, {
        x: x + 3.7, y: y + 0.8, w: 0.4, h: 0.4,
        fill: { color: C.brand }, line: { color: C.brand },
        rotate: 30,
      });
    }
  });

  addFooter(s, 8, 16);
}

// =============================================================
// Slide 9: コード編セクションタイトル
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 3.2, w: 4.5, h: 1.1,
    fill: { color: C.brand }, line: { color: C.brand },
  });
  s.addText("PART 2", {
    x: 1, y: 2, w: 11, h: 0.6,
    fontSize: 18, fontFace: FONT_BODY, color: C.brand, bold: true, charSpacing: 8,
    margin: 0,
  });
  s.addText("コード編", {
    x: 1, y: 2.7, w: 11, h: 1.2,
    fontSize: 64, fontFace: FONT_TITLE, bold: true, color: C.white,
    margin: 0,
  });
  s.addText("技術スタック / ディレクトリ / 主要ロジック / セキュリティ", {
    x: 1, y: 4.5, w: 11, h: 0.5,
    fontSize: 18, fontFace: FONT_BODY, color: C.white,
    margin: 0,
  });
}

// =============================================================
// Slide 10: 技術スタック
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "技術スタック", "厳選した最小構成。フォームライブラリ等の追加依存はゼロ");

  const techs = [
    { name: "Next.js 15", desc: "App Router\nサーバ/クライアント\nコンポーネント分離", icon: "▲" },
    { name: "React 19", desc: "最新の関数型コンポーネント\nuseState / useEffect / useRef", icon: "⚛" },
    { name: "TypeScript 5", desc: "strict: true\n型による設計の堅牢化", icon: "TS" },
    { name: "Tailwind CSS 3.4", desc: "CSS変数連携\nレスポンシブ・テーマ切替容易", icon: "≡" },
  ];

  techs.forEach((t, i) => {
    const x = 0.5 + i * 3.2;
    const y = 1.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 3, h: 3,
      fill: { color: C.surface }, line: { color: C.border, width: 1 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 1.1, y: y + 0.3, w: 0.8, h: 0.8,
      fill: { color: C.brand }, line: { color: C.brand },
    });
    s.addText(t.icon, {
      x: x + 1.1, y: y + 0.3, w: 0.8, h: 0.8,
      fontSize: 24, fontFace: FONT_TITLE, bold: true, color: C.dark,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(t.name, {
      x: x + 0.1, y: y + 1.3, w: 2.8, h: 0.5,
      fontSize: 17, fontFace: FONT_TITLE, bold: true, color: C.dark,
      align: "center", margin: 0,
    });
    s.addText(t.desc, {
      x: x + 0.2, y: y + 1.85, w: 2.6, h: 1.1,
      fontSize: 11, fontFace: FONT_BODY, color: C.body,
      align: "center", margin: 0,
    });
  });

  // 下：補助情報
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5, w: 12.3, h: 1.7,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  s.addText("PHILOSOPHY", {
    x: 0.8, y: 5.15, w: 11, h: 0.3,
    fontSize: 11, fontFace: FONT_BODY, color: C.brand, bold: true, charSpacing: 4, margin: 0,
  });
  s.addText("追加のサードパーティ依存を意図的に入れない最小構成", {
    x: 0.8, y: 5.5, w: 11.7, h: 0.45,
    fontSize: 16, fontFace: FONT_TITLE, bold: true, color: C.white, margin: 0,
  });
  s.addText("フォームライブラリ・UIキットなどに頼らず、React + Tailwind の素のままで実装。将来の脆弱性影響と移行コストを最小化。next/image・next/font などの公式機能で速度と SEO も担保。", {
    x: 0.8, y: 5.95, w: 11.7, h: 0.7,
    fontSize: 11, fontFace: FONT_BODY, color: C.white, margin: 0,
  });

  addFooter(s, 10, 16);
}

// =============================================================
// Slide 11: ディレクトリ構成
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "ディレクトリ構成", "App Router 標準に沿った見通しの良い配置");

  // 左：ツリー
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 7.5, h: 5.2,
    fill: { color: "1E293B" }, line: { color: "1E293B" },
  });
  const tree = [
    "Hackathon-Template-main/",
    "├── app/",
    "│   ├── layout.tsx          SEO・JSON-LD",
    "│   ├── page.tsx            TOP",
    "│   ├── globals.css         全体スタイル",
    "│   ├── company/page.tsx    会社案内",
    "│   ├── recruit/page.tsx    採用情報",
    "│   ├── contact/page.tsx    お問い合わせ",
    "│   ├── privacy/page.tsx    プライバシーポリシー",
    "│   └── api/",
    "│       └── upload-resume/  PDF検証 API",
    "├── components/             再利用UI",
    "├── lib/",
    "│   ├── siteConfig.ts       サイト設定",
    "│   └── data/               コンテンツ定義",
    "├── public/images/          画像アセット",
    "├── middleware.ts           パストラバーサル対策",
    "└── next.config.ts          セキュリティヘッダ",
  ];
  s.addText(tree.map((line, idx) => ({
    text: line,
    options: { breakLine: idx < tree.length - 1 },
  })), {
    x: 0.75, y: 1.85, w: 7, h: 5,
    fontSize: 10.5, fontFace: "Consolas", color: C.brand,
  });

  // 右：補足
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.3, y: 1.7, w: 4.5, h: 5.2,
    fill: { color: C.surface }, line: { color: C.border, width: 1 },
  });
  s.addText("3層構造", {
    x: 8.5, y: 1.85, w: 4.2, h: 0.4,
    fontSize: 16, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
  });
  s.addText([
    { text: "app/", options: { bold: true, color: C.brandDark, breakLine: true } },
    { text: "ルーティングとページ。各ページは独立。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "components/", options: { bold: true, color: C.brandDark, breakLine: true } },
    { text: "再利用UI部品。Header / Footer / Reveal / ContactForm / RecruitForm 他", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "lib/", options: { bold: true, color: C.brandDark, breakLine: true } },
    { text: "データと定数。コンテンツ変更はここを触るだけ。", options: {} },
  ], {
    x: 8.5, y: 2.4, w: 4.2, h: 4.5,
    fontSize: 11, fontFace: FONT_BODY, color: C.body,
    paraSpaceAfter: 2,
  });

  addFooter(s, 11, 16);
}

// =============================================================
// Slide 12: コンポーネント設計
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "コンポーネント設計", "責務でカテゴリ分け。再利用と単一責任を両立");

  const groups = [
    {
      title: "レイアウト系",
      color: C.brand,
      items: ["Header（スティッキー＋ドロワー）", "Footer", "PageHeader（バナー）", "SectionTitle（黄色下線）"],
    },
    {
      title: "プレゼンテーション系",
      color: C.dark,
      items: ["FeatureCard", "ServiceCard", "ZoomableImage", "Reveal（IntersectionObserver）"],
    },
    {
      title: "対話的（クライアント）",
      color: C.red,
      items: ["EmployeeInterviews（開閉式）", "ContactForm（3段階）", "RecruitForm（3段階＋分岐）"],
    },
    {
      title: "共通ユーティリティ",
      color: C.green,
      items: ["form-utils（Badge / FieldRow / FieldError）", "validatePdfFile（3段階検証）", "fetchAddressFromPostalCode"],
    },
  ];

  groups.forEach((g, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 6.3;
    const y = 1.7 + row * 2.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 6, h: 2.4,
      fill: { color: C.white }, line: { color: C.border, width: 1 },
    });
    // 色帯（左）
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.15, h: 2.4,
      fill: { color: g.color }, line: { color: g.color },
    });
    s.addText(g.title, {
      x: x + 0.35, y: y + 0.2, w: 5.4, h: 0.5,
      fontSize: 16, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
    });
    s.addText(g.items.map((it, idx) => ({
      text: it,
      options: { bullet: true, breakLine: idx < g.items.length - 1 },
    })), {
      x: x + 0.35, y: y + 0.8, w: 5.5, h: 1.5,
      fontSize: 11.5, fontFace: FONT_BODY, color: C.body,
      paraSpaceAfter: 2,
    });
  });

  addFooter(s, 12, 16);
}

// =============================================================
// Slide 13: フォーム実装ロジック
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "フォーム実装ロジック", "3段階フロー＋郵便番号自動入力＋PDF多重防御");

  // 左：3段階フロー
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 6, h: 5.2,
    fill: { color: C.surface }, line: { color: C.border, width: 1 },
  });
  s.addText("3段階フローの内部", {
    x: 0.7, y: 1.85, w: 5.5, h: 0.4,
    fontSize: 16, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
  });
  s.addText([
    { text: "useState で step を管理", options: { bullet: true, breakLine: true } },
    { text: "  → \"input\" / \"confirm\" / \"done\"", options: { breakLine: true } },
    { text: "<form noValidate> でブラウザ標準を抑止", options: { bullet: true, breakLine: true } },
    { text: "自前 validate(data) が errors オブジェクトを返す", options: { bullet: true, breakLine: true } },
    { text: "  → 赤字エラー＋赤い枠線", options: { breakLine: true } },
    { text: "  → set()でエラー自動クリア", options: { breakLine: true } },
    { text: "containerRef で scrollIntoView", options: { bullet: true, breakLine: true } },
    { text: "  → フォーム上端へスムーズに戻る", options: { breakLine: true } },
    { text: "「修正する」は state を保持して戻る", options: { bullet: true } },
  ], {
    x: 0.7, y: 2.35, w: 5.7, h: 4.4,
    fontSize: 11, fontFace: FONT_BODY, color: C.body,
    paraSpaceAfter: 2,
  });

  // 右：郵便番号API + PDF検証
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.8, y: 1.7, w: 6, h: 2.5,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  s.addText("郵便番号 → 住所自動入力", {
    x: 7, y: 1.85, w: 5.5, h: 0.4,
    fontSize: 14, fontFace: FONT_TITLE, bold: true, color: C.brand, margin: 0,
  });
  s.addText([
    { text: "7桁入力で zipcloud API へfetch", options: { bullet: true, breakLine: true } },
    { text: "都道府県＋市区町村を自動入力", options: { bullet: true, breakLine: true } },
    { text: "APIキー不要・CORS対応", options: { bullet: true, breakLine: true } },
    { text: "失敗時は手入力に fallback", options: { bullet: true } },
  ], {
    x: 7, y: 2.3, w: 5.7, h: 1.8,
    fontSize: 11, fontFace: FONT_BODY, color: C.white,
    paraSpaceAfter: 2,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.8, y: 4.4, w: 6, h: 2.5,
    fill: { color: C.brand }, line: { color: C.brand },
  });
  s.addText("PDF 3段階防御", {
    x: 7, y: 4.55, w: 5.5, h: 0.4,
    fontSize: 14, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
  });
  s.addText([
    { text: "① 拡張子: .pdf のみ", options: { bullet: true, breakLine: true } },
    { text: "② MIME: application/pdf のみ", options: { bullet: true, breakLine: true } },
    { text: "③ 先頭5バイト: %PDF- マジックナンバー", options: { bullet: true, breakLine: true } },
    { text: "違反は /api/upload-resume が 400 Bad Request", options: { bullet: true } },
  ], {
    x: 7, y: 5, w: 5.7, h: 1.8,
    fontSize: 11, fontFace: FONT_BODY, color: C.dark,
    paraSpaceAfter: 2,
  });

  addFooter(s, 13, 16);
}

// =============================================================
// Slide 14: セキュリティ対策
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "セキュリティ対策", "多層防御：ヘッダ・ミドルウェア・フォーム検証・バージョン秘匿");

  const secs = [
    {
      title: "セキュリティヘッダ",
      icon: "🛡",
      items: ["X-Frame-Options: DENY", "X-Content-Type-Options", "Strict-Transport-Security", "Referrer-Policy / Permissions-Policy"],
    },
    {
      title: "パストラバーサル防御",
      icon: "🚫",
      items: ["middleware.ts で全リクエスト検査", ".. / %2e / %5c / %00 を 400 拒否", "生 URL とデコード後を両方確認"],
    },
    {
      title: "バージョン情報秘匿",
      icon: "🔒",
      items: ["X-Powered-By を削除", "本番ソースマップ無効", "本番 console.* を削除（error除く）"],
    },
    {
      title: "フォーム入力の防御",
      icon: "📝",
      items: ["maxLength で DoS 入力抑制", "型・形式・必須を自前検証", "ファイルは PDF 多重検証＋400"],
    },
  ];

  secs.forEach((sc, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 6.3;
    const y = 1.7 + row * 2.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 6, h: 2.45,
      fill: { color: C.surface }, line: { color: C.border, width: 1 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55,
      fill: { color: C.brand }, line: { color: C.brand },
    });
    s.addText(sc.icon, {
      x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55,
      fontSize: 18, fontFace: FONT_TITLE, color: C.dark,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(sc.title, {
      x: x + 0.95, y: y + 0.28, w: 4.9, h: 0.45,
      fontSize: 15, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
    });
    s.addText(sc.items.map((it, idx) => ({
      text: it,
      options: { bullet: true, breakLine: idx < sc.items.length - 1 },
    })), {
      x: x + 0.35, y: y + 0.9, w: 5.5, h: 1.5,
      fontSize: 11, fontFace: FONT_BODY, color: C.body,
      paraSpaceAfter: 2,
    });
  });

  addFooter(s, 14, 16);
}

// =============================================================
// Slide 15: SEO・デプロイ
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.white };
  addTitle(s, "SEO ＋ デプロイ", "Vercel前提・1行で公開URL切替できる構造");

  // SEO
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 6, h: 5.2,
    fill: { color: C.surface }, line: { color: C.border, width: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.7, w: 6, h: 0.08,
    fill: { color: C.brand }, line: { color: C.brand },
  });
  s.addText("SEO / OGP / 構造化データ", {
    x: 0.7, y: 1.95, w: 5.5, h: 0.5,
    fontSize: 17, fontFace: FONT_TITLE, bold: true, color: C.dark, margin: 0,
  });
  s.addText([
    { text: "app/layout.tsx の Metadata API", options: { bullet: true, breakLine: true } },
    { text: "metadataBase・canonical・OGP・Twitter", options: { bullet: true, breakLine: true } },
    { text: "各ページで title / description / canonical を個別に", options: { bullet: true, breakLine: true } },
    { text: "schema.org Organization の JSON-LD", options: { bullet: true, breakLine: true } },
    { text: "app/sitemap.ts → /sitemap.xml 自動生成", options: { bullet: true, breakLine: true } },
    { text: "app/robots.ts → /robots.txt 自動生成", options: { bullet: true, breakLine: true } },
    { text: "app/icon.png 設置で favicon 自動配信", options: { bullet: true } },
  ], {
    x: 0.7, y: 2.55, w: 5.7, h: 4.2,
    fontSize: 12, fontFace: FONT_BODY, color: C.body,
    paraSpaceAfter: 3,
  });

  // デプロイ
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.8, y: 1.7, w: 6, h: 5.2,
    fill: { color: C.dark }, line: { color: C.dark },
  });
  s.addText("DEPLOY TO VERCEL", {
    x: 7, y: 1.95, w: 5.5, h: 0.4,
    fontSize: 12, fontFace: FONT_BODY, color: C.brand, bold: true, charSpacing: 4, margin: 0,
  });
  s.addText("最短ルート", {
    x: 7, y: 2.35, w: 5.5, h: 0.5,
    fontSize: 18, fontFace: FONT_TITLE, bold: true, color: C.white, margin: 0,
  });
  s.addText([
    { text: "1. GitHub に push", options: { breakLine: true, bold: true, color: C.brand } },
    { text: "2. Vercel と連携 → 自動デプロイ", options: { breakLine: true, bold: true, color: C.brand } },
    { text: "3. lib/siteConfig.ts の siteUrl を本番URLに書き換えて再 push", options: { breakLine: true, bold: true, color: C.brand } },
    { text: "4. Google Search Console に sitemap 送信", options: { bold: true, color: C.brand } },
  ], {
    x: 7, y: 3, w: 5.7, h: 2.3,
    fontSize: 12, fontFace: FONT_BODY, color: C.white,
    paraSpaceAfter: 8,
  });
  s.addText("siteUrl を1か所変えるだけで sitemap / canonical / OGP の全てに反映される構造。", {
    x: 7, y: 5.7, w: 5.7, h: 1.1,
    fontSize: 11, fontFace: FONT_BODY, color: C.white,
    margin: 0,
  });

  addFooter(s, 15, 16);
}

// =============================================================
// Slide 16: まとめ
// =============================================================
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  // 黄色いブロック背景（右下）
  s.addShape(pres.shapes.RECTANGLE, {
    x: SLIDE_W - 4, y: SLIDE_H - 1.5, w: 4, h: 1.5,
    fill: { color: C.brand }, line: { color: C.brand },
  });

  s.addText("SUMMARY", {
    x: 1, y: 0.8, w: 11, h: 0.5,
    fontSize: 14, fontFace: FONT_BODY, color: C.brand, bold: true, charSpacing: 6,
    margin: 0,
  });
  s.addText("見た目 × コード で\n一貫したクオリティ", {
    x: 1, y: 1.4, w: 11, h: 1.8,
    fontSize: 40, fontFace: FONT_TITLE, bold: true, color: C.white,
    margin: 0, lineSpacingMultiple: 1.1,
  });

  // 3つのキーポイント
  const pts = [
    { num: "01", label: "ブランド統一", desc: "黄色基調を CSS 変数で集中管理" },
    { num: "02", label: "見やすいUX", desc: "アニメ・縦タイムライン・拡大画像" },
    { num: "03", label: "堅牢なフォーム", desc: "3段階＋PDF多重検証＋400応答" },
  ];
  pts.forEach((pt, i) => {
    const x = 1 + i * 3.8;
    const y = 4.4;
    s.addText(pt.num, {
      x, y, w: 3.5, h: 0.5,
      fontSize: 32, fontFace: FONT_TITLE, bold: true, color: C.brand,
      margin: 0,
    });
    s.addText(pt.label, {
      x, y: y + 0.6, w: 3.5, h: 0.4,
      fontSize: 16, fontFace: FONT_TITLE, bold: true, color: C.white,
      margin: 0,
    });
    s.addText(pt.desc, {
      x, y: y + 1.1, w: 3.5, h: 0.7,
      fontSize: 11, fontFace: FONT_BODY, color: C.white,
      margin: 0,
    });
  });

  s.addText("株式会社ライトパス　Light Path Inc.", {
    x: 0.5, y: SLIDE_H - 1.05, w: 6, h: 0.4,
    fontSize: 11, fontFace: FONT_BODY, color: C.brand, charSpacing: 4,
    margin: 0,
  });
}

// =============================================================
// 出力
// =============================================================
pres.writeFile({ fileName: "サイト解説資料.pptx" })
  .then((fileName) => {
    console.log("✅ 生成完了:", fileName);
    console.log("→ 同じフォルダに " + fileName + " が作成されました。");
  })
  .catch((err) => {
    console.error("❌ 生成に失敗しました:", err);
    process.exit(1);
  });
