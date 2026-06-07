"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

/**
 * 全ページ共通のヘッダー
 * - PC：ナビを横並びで表示
 * - スマホ：ハンバーガーボタン → 右からスライドインするドロワー＋背面オーバーレイ
 *
 * ナビ項目は lib/siteConfig.ts の nav を編集してください。
 *
 * モバイルメニューの挙動：
 *  - ボタン押下で open=true、ドロワーが右からスライドイン
 *  - 背景は半透明＋ブラーで暗くなり、ドロワー外をクリックで閉じる
 *  - ESC キーでも閉じる
 *  - ページ遷移したら自動で閉じる
 *  - 開いている間は body のスクロールを止める
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /**
   * 現在のページかどうかを判定するヘルパー
   * - "/" は完全一致のみ（前方一致だと全ページがマッチしてしまうため）
   * - その他のページは前方一致（例：/recruit と /recruit/foo の両方を active 扱い）
   * - href にハッシュ（例：/recruit#entry）が付いていてもパス部分のみで比較
   */
  const isActive = (href: string): boolean => {
    const path = href.split("#")[0];
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  // ページ遷移したらメニューを自動で閉じる
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // メニューが開いている間は body のスクロールを停止
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC キーで閉じる
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* ロゴ＋社名 */}
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/images/lightpath-logo.png"
              alt=""
              width={56}
              height={56}
              priority
              className="h-11 w-11 shrink-0 sm:h-12 sm:w-12"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-base font-semibold text-slate-900 transition group-hover:opacity-70 sm:text-lg">
                {siteConfig.siteName}
              </span>
              <span className="text-xs text-muted-foreground sm:text-sm">
                {siteConfig.siteNameEn}
              </span>
            </span>
          </Link>

          {/* PC：横並びナビ */}
          <nav
            className="hidden flex-wrap items-center justify-end gap-0.5 sm:flex sm:max-w-[28rem] md:max-w-none lg:gap-1"
            aria-label="メインナビゲーション"
          >
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-md px-2 py-2 text-sm transition hover:bg-muted hover:text-slate-900 md:px-3 md:text-base ${
                    active
                      ? "font-semibold text-slate-900 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-primary md:after:left-3 md:after:right-3"
                      : "text-slate-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* スマホ：ハンバーガーボタン（押すとドロワーが開く） */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="メニューを開く"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-slate-800 transition hover:bg-muted sm:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* スマホ用：背面オーバーレイ（暗くする・クリックで閉じる）。PCでは非表示。 */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* スマホ用：右からスライドインするドロワー */}
      <aside
        id="mobile-menu"
        aria-label="モバイルメニュー"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out sm:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ドロワーのヘッダー：ラベル＋閉じるボタン */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-slate-900">メニュー</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="メニューを閉じる"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-slate-800 transition hover:bg-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ドロワー本体のナビ */}
        <nav className="flex-1 overflow-y-auto p-3" aria-label="モバイルナビゲーション">
          {siteConfig.nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-3 text-base transition hover:bg-muted hover:text-slate-900 ${
                  active
                    ? "bg-muted font-semibold text-slate-900"
                    : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
