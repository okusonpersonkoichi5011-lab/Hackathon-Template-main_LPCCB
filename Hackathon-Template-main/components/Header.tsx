"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { siteConfig } from "@/lib/siteConfig";

/**
 * 全ページ共通のヘッダー
 * - PC：ナビを横並びで表示 + 右端に JP/EN 言語切替ボタン
 * - スマホ：ハンバーガーボタン → 右からスライドインするドロワー＋背面オーバーレイ
 *
 * 言語切替（JP/EN）はサイト全体に即座に反映されます（useLanguage 経由）。
 * ナビ項目のラベルは lib/i18n/translations.ts の "nav.*" を参照。
 */

// ナビ定義はモジュール定数（毎レンダーでの配列再生成を防止）
const NAV_ITEMS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/company", labelKey: "nav.company" },
  { href: "/recruit", labelKey: "nav.recruit" },
  { href: "/contact", labelKey: "nav.contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

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
      {/* スクロール時の GPU 負荷を避けるため backdrop-blur を外し、不透明背景に変更 */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* ロゴ＋社名 */}
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/images/lightpath-logo.png"
              alt=""
              width={72}
              height={72}
              priority
              className="h-14 w-14 shrink-0 sm:h-16 sm:w-16"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-xl font-semibold text-slate-900 transition group-hover:opacity-70 sm:text-2xl">
                {siteConfig.siteName}
              </span>
              <span className="text-base text-muted-foreground sm:text-lg">
                {siteConfig.siteNameEn}
              </span>
            </span>
          </Link>

          {/* PC：横並びナビ + 右端に JP/EN 切替 */}
          <div className="hidden items-center gap-3 sm:flex">
            <nav
              className="flex flex-wrap items-center justify-end gap-0.5 sm:max-w-[32rem] md:max-w-none lg:gap-1"
              aria-label={t("header.siteNameAria")}
            >
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-md px-2 py-2 text-base transition hover:bg-muted hover:text-slate-900 md:px-3 md:text-lg ${
                      active
                        ? "font-semibold text-slate-900 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-primary md:after:left-3 md:after:right-3"
                        : "text-slate-700"
                    }`}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
            {/* JP / EN 言語切替（PC用） */}
            <LanguageSwitcher />
          </div>

          {/* スマホ：JP/EN + ハンバーガーボタン */}
          <div className="flex items-center gap-2 sm:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={t("header.openMenu")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-slate-800 transition hover:bg-muted"
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
        </div>
      </header>

      {/* スマホ用：背面オーバーレイ */}
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
        aria-label={t("header.menuTitle")}
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out sm:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-base font-semibold text-slate-900">{t("header.menuTitle")}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("header.closeMenu")}
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

        <nav className="flex-1 overflow-y-auto p-3" aria-label={t("header.mobileNavAria")}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-3 text-lg transition hover:bg-muted hover:text-slate-900 ${
                  active ? "bg-muted font-semibold text-slate-900" : "text-slate-700"
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
