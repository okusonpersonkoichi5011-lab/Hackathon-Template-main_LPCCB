import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

/**
 * 全ページ共通のフッター（レイアウト見本に準拠）
 * - 左：社名・住所・営業時間・電話
 * - 中央：Instagram アイコン（外部リンク）
 * - 右：サイトナビ（各項目に区切り線）
 * - 下部：コピーライト＋プライバシーポリシー
 */
export function Footer() {
  return (
    <footer className="bg-[#b6b8bb] text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.6fr_auto_1fr] md:items-start">
          {/* 会社名・連絡先 */}
          <div>
            <p className="text-lg font-bold text-slate-900">{siteConfig.siteName}</p>
            <div className="mt-4 space-y-1.5 text-sm leading-relaxed">
              <p>{siteConfig.contact.address}</p>
              <p>{siteConfig.contact.businessHours}</p>
              <p>
                <a
                  href={siteConfig.contact.phoneTel}
                  className="transition hover:text-slate-900 hover:underline"
                >
                  TEL：{siteConfig.contact.phone}
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
              aria-label="Instagram（外部サイトが開きます）"
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
          <nav className="text-sm" aria-label="フッターナビゲーション">
            <ul>
              {siteConfig.nav.map((item) => (
                <li key={item.label} className="border-b border-slate-500/40">
                  <Link
                    href={item.href}
                    className="block py-2 text-slate-800 transition hover:text-slate-900 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 text-xs text-slate-700 sm:flex-row sm:justify-center sm:gap-4">
          <Link href="/privacy" className="transition hover:text-slate-900 hover:underline">
            プライバシーポリシー
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
