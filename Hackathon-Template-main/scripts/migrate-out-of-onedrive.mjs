#!/usr/bin/env node
/**
 * プロジェクトを OneDrive 外へ移動するための準備スクリプト。
 *
 * 何をするか:
 *   1) プロジェクトが OneDrive 配下かを確認
 *   2) 移行先 (C:\dev\<プロジェクト名>) を提案
 *   3) コピー前に node_modules / .next など重いキャッシュを削除
 *   4) ロボコピーコマンドを表示するので、ユーザがそれをコピペ実行
 *
 * なぜスクリプトで自動コピーしないか:
 *   - 大量のファイル移動はネットワーク・権限・OneDrive 同期の影響を受けやすく、
 *     失敗時のリカバリが難しいため、コマンドを「印刷」して人間が実行する方が安全
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function log(msg) {
  process.stdout.write(msg + "\n");
}

const isWin = process.platform === "win32";
const isOneDrive = isWin && /[\\/]OneDrive([\\/]|$)/i.test(ROOT);

async function removeIfExists(rel) {
  const abs = path.join(ROOT, rel);
  try {
    await fs.rm(abs, { recursive: true, force: true });
    log(`  [OK] removed: ${rel}`);
  } catch {
    /* ignore */
  }
}

async function main() {
  log("");
  log("=== migrate-out-of-onedrive ===");
  log(`  cwd: ${ROOT}`);
  log("");

  if (!isOneDrive) {
    log("プロジェクトは OneDrive 配下にありません。移行は不要です。");
    return;
  }

  const projectName = path.basename(ROOT);
  const suggestedTarget = `C:\\dev\\${projectName}`;

  log("[1/3] OneDrive 配下を確認しました。");
  log("[2/3] 不要なキャッシュを削除します（コピー量を減らすため）...");
  await removeIfExists(".next");
  await removeIfExists("node_modules/.cache");
  await removeIfExists(".turbo");

  log("");
  log("[3/3] 以下のコマンドを「コマンドプロンプト（管理者でなくてOK）」で実行してください:");
  log("");
  log(`    REM 1) 移行先フォルダを作成`);
  log(`    mkdir "C:\\dev"`);
  log("");
  log(`    REM 2) robocopy でファイル一式をコピー（node_modules 除外）`);
  log(`    robocopy "${ROOT}" "${suggestedTarget}" /E /XD node_modules .next .turbo /XJ /R:1 /W:1`);
  log("");
  log(`    REM 3) 移行後、新しいパスで作業を続ける`);
  log(`    cd "${suggestedTarget}"`);
  log(`    npm install`);
  log(`    npm run dev`);
  log("");
  log("補足:");
  log("  - /XD は除外フォルダ。node_modules は npm install で再生成するためコピー不要");
  log("  - /XJ はジャンクション・シンボリックリンクを辿らない（安全のため）");
  log("  - 移行後、元のフォルダ（OneDrive 配下）は念のため数日残し、不具合がなければ削除");
  log("");
  log("移行後の利点:");
  log("  ✓ webpack キャッシュエラーが完全に消える");
  log("  ✓ Hot Module Replacement (HMR) が高速化");
  log("  ✓ 画像の lazy load 衝突が起きない");
  log("  ✓ OneDrive の同期容量を節約できる");
  log("");
  log("ソースコードのバックアップが心配な場合:");
  log("  → GitHub 等の Git リポジトリにプッシュすることを推奨");
  log("    （OneDrive バックアップより正確かつ履歴付き）");
  log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
