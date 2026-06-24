"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { siteConfig } from "@/lib/siteConfig";

/**
 * 全ページ共通のフッター
 * - 左：社名・住所・営業時間・電話
 * - 中央：Instagram アイコン（外部リンク）
 * - 右：サイトナビ
 * - 下部：コピーライト＋プライバシーポリシー
 *
 * 言語切替（JP/EN）に応じて、ナビラベル・aria-label・住所表記・営業時間が切り替わります。
 */

// ナビ定義はモジュール定数（毎レンダーでの配列再生成を防止）
const FOOTER_NAV_ITEMS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/company", labelKey: "nav.company" },
  { href: "/recruit", labelKey: "nav.recruit" },
  { href: "/contact", labelKey: "nav.contact" },
] as const;

export function Footer() {
  const { t, lang } = useLanguage();

  const address = lang === "en" ? siteConfig.contactEn.address : siteConfig.contact.address;
  const businessHours =
    lang === "en" ? siteConfig.contactEn.businessHours : siteConfig.contact.businessHours;

  return (
    <footer className="bg-[#b6b8bb] text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.6fr_auto_1fr] md:items-start">
          {/* 会社名・連絡先 */}
          <div>
            <p className="text-xl font-bold text-slate-900">
              {lang === "en" ? siteConfig.siteNameEn : siteConfig.siteName}
            </p>
            <div className="mt-4 space-y-1.5 text-base leading-relaxed">
              <p>{address}</p>
              <p>{businessHours}</p>
              <p>
                <a
                  href={siteConfig.contact.phoneTel}
                  className="transition hover:text-slate-900 hover:underline"
                >
                  {t("footer.telLabel")}：{siteConfig.contact.phone}
                </a>
              </p>
            </div>
          </div>

          {/* Instagram */}
          <div className="flex md:justify-center">
            <a
              href={siteConfig.externalLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.instagramAria")}
              className="inline-flex transition hover:-translate-y-0.5 hover:opacity-80"
            >
              <Image
                src="/images/insta_icon.png"
                alt="Instagram"
                width={44}
                height={44}
                className="h-11 w-11"
              />
            </a>
          </div>

          {/* サイトナビ */}
          <nav className="text-base" aria-label={t("footer.navAria")}>
            <ul>
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.href} className="border-b border-slate-500/40">
                  <Link
                    href={item.href}
                    className="block py-2 text-slate-800 transition hover:text-slate-900 hover:underline"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 text-sm text-slate-700 sm:flex-row sm:justify-center sm:gap-4">
          <Link href="/privacy" className="transition hover:text-slate-900 hover:underline">
            {t("footer.privacy")}
          </Link>
          <span aria-hidden className="hidden sm:inline">
            |
          </span>
          <p>
            Copyright © {siteConfig.siteName}　{siteConfig.siteNameEn}　All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
