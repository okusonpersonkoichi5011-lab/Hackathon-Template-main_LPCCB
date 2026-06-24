#!/usr/bin/env node
/**
 * OneDrive 配下の Next.js プロジェクトを「とりあえず動く」状態に戻すスクリプト。
 *
 * 何をするか:
 *   1) 既存の .next（フォルダ／Junction どちらも）を完全に削除
 *   2) node_modules/.cache を削除
 *   3) public/images/ と app/icon.* を attrib +P -U で "常にローカル保持"
 *
 * 重要：
 *   - Junction 方式は Node.js のモジュール解決を壊すため廃止しました
 *   - 根本解決はプロジェクトを OneDrive 外へ移すことです
 *     詳細：  npm run migrate-out-of-onedrive   （migrate スクリプト参照）
 *   - OneDrive に置いたまま使う場合は、本スクリプトを「dev で問題が出るたび」に
 *     再実行することで対症療法できます
 *
 * 実行方法:
 *   npm run fix-onedrive
 */
import { promises as fs } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function log(msg) {
  process.stdout.write(msg + "\n");
}

const isWin = process.platform === "win32";

/** Junction 含めて安全に .next を削除（リンク先は巻き込まない） */
async function safeRemoveNext() {
  const target = path.join(ROOT, ".next");
  try {
    const st = await fs.lstat(target);
    if (st.isSymbolicLink()) {
      // Junction の場合：rmdir で junction だけ消す（リンク先は残す）
      if (isWin) {
        const r = spawnSync("cmd.exe", ["/c", "rmdir", target], {
          encoding: "utf8",
          windowsHide: true,
        });
        if (r.status === 0) {
          log("  [OK] removed junction: .next  (target preserved)");
        } else {
          log(`  [WARN] rmdir junction failed: ${r.stderr?.trim() || "(unknown)"}`);
        }
      } else {
        await fs.unlink(target);
        log("  [OK] removed symlink: .next");
      }
      return;
    }
    await fs.rm(target, { recursive: true, force: true });
    log("  [OK] removed directory: .next");
  } catch (e) {
    if (e?.code === "ENOENT") {
      log("  [SKIP] .next does not exist");
    } else {
      log(`  [WARN] .next removal: ${e?.message ?? e}`);
    }
  }
}

async function removeDir(rel) {
  const abs = path.join(ROOT, rel);
  try {
    await fs.rm(abs, { recursive: true, force: true });
    log(`  [OK] removed: ${rel}`);
  } catch (e) {
    if (e?.code !== "ENOENT") {
      log(`  [WARN] ${rel}: ${e?.message ?? e}`);
    } else {
      log(`  [SKIP] ${rel} does not exist`);
    }
  }
}

function pinFiles(rel) {
  if (!isWin) return;
  const abs = path.join(ROOT, rel);
  const r = spawnSync("attrib", ["+P", "-U", abs, "/S", "/D"], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (r.status === 0) {
    log(`  [OK] pinned: ${rel}`);
  } else {
    log(`  [WARN] attrib ${rel}: ${r.stderr?.trim() || "non-zero exit"}`);
  }
}

function pinSingle(rel) {
  if (!isWin) return;
  const abs = path.join(ROOT, rel);
  spawnSync("attrib", ["+P", "-U", abs], { encoding: "utf8", windowsHide: true });
}

async function main() {
  log("");
  log("=== fix-onedrive: clean up broken state ===");
  log(`  cwd: ${ROOT}`);
  log("");

  log("[1/3] Removing .next (junction or directory) ...");
  await safeRemoveNext();

  log("[2/3] Removing node_modules/.cache ...");
  await removeDir("node_modules/.cache");

  log("[3/3] Pinning user assets to always-keep-on-device ...");
  pinFiles("public\\images");
  pinSingle("app\\icon.png");
  pinSingle("app\\icon.svg");

  log("");
  log("Done.");
  log("");
  log("Next steps:");
  log("  npm run dev");
  log("");
  log("If the dev server breaks again with OneDrive errors, the long-term fix is to");
  log("move this project OUT OF OneDrive. See:");
  log("  npm run migrate-out-of-onedrive");
  log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
