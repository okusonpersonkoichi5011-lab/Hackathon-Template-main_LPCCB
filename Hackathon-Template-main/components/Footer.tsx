import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

/** 全ページ共通のフッター */
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* 会社名・概要 */}
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold text-slate-900">{siteConfig.siteName}</p>
            <p className="text-xs text-muted-foreground">{siteConfig.siteNameEn}</p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              {siteConfig.shortDescription}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={siteConfig.externalLinks.officialSite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                公式サイト
              </a>
              <a
                href={siteConfig.externalLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* ナビ */}
          <nav className="flex flex-col gap-2 text-sm" aria-label="フッターナビゲーション">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              サイトメニュー
            </p>
            {siteConfig.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 連絡先 */}
          <div className="text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              お問い合わせ
            </p>
            <p className="mt-2 text-muted-foreground">
              <a
                href={siteConfig.contact.phoneTel}
                className="hover:text-primary"
              >
                TEL：{siteConfig.contact.phone}
              </a>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {siteConfig.contact.address}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {siteConfig.contact.businessHours}
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          © {siteConfig.footerYear} {siteConfig.siteName}
        </p>
      </div>
    </footer>
  );
}
