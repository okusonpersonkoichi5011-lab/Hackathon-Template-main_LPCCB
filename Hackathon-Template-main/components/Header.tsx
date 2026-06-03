"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";

/**
 * 全ページ共通のヘッダー
 * ナビ項目は lib/siteConfig.ts の nav を編集してください。
 *
 * 現在のページのリンクには下線とプライマリカラーが付き、
 * どのページにいるかひと目で分かるようにしています。
 */
export function Header() {
  const pathname = usePathname();

  /**
   * 現在のページかどうかを判定するヘルパー
   * - "/" は完全一致のみ（前方一致だと全ページがマッチしてしまうため）
   * - その他のページは前方一致（例：/service と /service/foo の両方を active 扱い）
   * - href にハッシュ（例：/recruit#entry）が付いていてもパス部分のみで比較
   */
  const isActive = (href: string): boolean => {
    const path = href.split("#")[0];
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
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
            <span className="text-xs text-muted-foreground sm:text-sm">{siteConfig.siteNameEn}</span>
          </span>
        </Link>
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
        {/* スマホ用：シンプルな縦並びナビ（ハッカソン向けに実装を複雑にしすぎない方針） */}
        <details className="relative sm:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-2 text-sm font-medium text-slate-800">
            メニュー
          </summary>
          <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-surface p-2 shadow-lg">
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-md px-3 py-2 text-sm transition hover:bg-muted hover:text-slate-900 ${
                    active
                      ? "bg-muted font-semibold text-slate-900"
                      : "text-slate-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </details>
      </div>
    </header>
  );
}
