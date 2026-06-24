#!/usr/bin/env node
/**
 * 画像最適化スクリプト（ローカル PC で実行する用）
 * ===============================================
 *
 * public/images 配下の画像を web 配信用に圧縮します。
 *  - JPEG: 長辺 1600px・quality 82・progressive
 *  - PNG: 長辺 1600px（バナー）/ 256px（アイコン）
 *  - 元ファイルは public/images/.bak_orig/ に退避してから上書き
 *
 * 使い方：
 *   1) npm i -D sharp        （初回のみ）
 *   2) node scripts/optimize-images.mjs
 *
 * ★ なぜ必要か：
 *   原寸 7MB の集合写真など、ソース画像が巨大なまま Vercel にアップロードすると
 *   - 初回リクエストで Image Optimization 関数が重くなる
 *   - サーバが OOM（メモリ不足）になりやすい
 *   - 開発時の HMR が遅くなる
 *   ソースを 200-400KB 程度まで圧縮しておくことで、Next.js の Image 最適化が
 *   そこから更に AVIF/WebP を生成し、最終的に数 10KB 配信になります。
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(__dirname, "..", "public", "images");
const BACKUP_DIR = path.join(IMAGES_DIR, ".bak_orig");

// 既定の対象とサイズ
const RULES = [
  { match: /^Group_photo\.jpg$/i, format: "jpeg", maxLongEdge: 1600, quality: 82 },
  { match: /^employee\d+\.jpg$/i, format: "jpeg", maxLongEdge: 1600, quality: 82 },
  { match: /^recruit-carousel-\d+\.jpe?g$/i, format: "jpeg", maxLongEdge: 1600, quality: 82 },
  { match: /^PageTop_bg\.png$/i, format: "png", maxLongEdge: 1920 },
  { match: /^picture_bg\.png$/i, format: "png", maxLongEdge: 1920 },
  { match: /^UnleashYP\.png$/i, format: "png", maxLongEdge: 1600 },
  { match: /^Service\d+\.png$/i, format: "png", maxLongEdge: 800 },
  { match: /^Recruit\d+\.png$/i, format: "png", maxLongEdge: 256 },
  { match: /^.+_header\.png$/i, format: "png", maxLongEdge: 1600 },
  { match: /^SHINANOYA\.png$/i, format: "png", maxLongEdge: 800 },
];

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("\n[エラー] sharp が見つかりません。次のコマンドでインストールしてください：");
    console.error("        npm i -D sharp\n");
    process.exit(1);
  }

  await fs.mkdir(BACKUP_DIR, { recursive: true });

  const entries = await fs.readdir(IMAGES_DIR, { withFileTypes: true });
  let totalBefore = 0;
  let totalAfter = 0;
  let touched = 0;

  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const rule = RULES.find((r) => r.match.test(ent.name));
    if (!rule) continue;

    const src = path.join(IMAGES_DIR, ent.name);
    const stat = await fs.stat(src);
    const before = stat.size;
    if (before < 200 * 1024) continue; // 200KB 未満は対象外

    // バックアップ
    const bak = path.join(BACKUP_DIR, ent.name);
    try {
      await fs.access(bak);
    } catch {
      await fs.copyFile(src, bak);
    }

    try {
      const img = sharp(src, { failOn: "none" }).rotate(); // EXIF 回転を反映
      const meta = await img.metadata();
      const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0);
      let pipeline = img;
      if (longEdge > rule.maxLongEdge) {
        pipeline = pipeline.resize({
          width: meta.width >= meta.height ? rule.maxLongEdge : undefined,
          height: meta.height > meta.width ? rule.maxLongEdge : undefined,
          fit: "inside",
        });
      }
      if (rule.format === "jpeg") {
        pipeline = pipeline.jpeg({ quality: rule.quality, progressive: true, mozjpeg: true });
      } else {
        pipeline = pipeline.png({ compressionLevel: 9, palette: true });
      }
      const buf = await pipeline.toBuffer();
      if (buf.byteLength < before) {
        await fs.writeFile(src, buf);
      } else {
        // 圧縮で逆に大きくなる場合は元に戻す
        await fs.copyFile(bak, src);
      }
      const after = (await fs.stat(src)).size;
      totalBefore += before;
      totalAfter += after;
      touched++;
      const sign = after < before ? "-" : "=";
      console.log(
        `  ${ent.name.padEnd(28)}  ${(before / 1024).toFixed(0).padStart(6)} KB ${sign}> ${(after / 1024).toFixed(0).padStart(6)} KB`,
      );
    } catch (e) {
      console.error(`  ! ${ent.name}: ${e?.message ?? e}`);
    }
  }

  console.log(
    `\n対象 ${touched} ファイル：${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB ` +
      `(削減 ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB)\n`,
  );
  console.log(`バックアップ：${path.relative(process.cwd(), BACKUP_DIR)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
