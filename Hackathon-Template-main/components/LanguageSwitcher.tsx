"use client";

/**
 * 日本語 / 英語 を切り替えるトグルボタン
 * ----------------------------------------
 * - ヘッダー右端に配置する想定
 * - 2つのボタンを並べ、現在の言語をハイライト（黄色背景）
 * - クリックで `useLanguage()` の状態を更新 → サイト全体に反映
 */

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={lang === "ja" ? "言語切替" : "Language"}
      className={`inline-flex items-center overflow-hidden rounded-md border border-border bg-surface text-xs font-semibold ${className}`}
    >
      <button
        type="button"
        onClick={() => setLang("ja")}
        aria-pressed={lang === "ja"}
        aria-label={t("header.switchToJa")}
        className={`px-2.5 py-1.5 transition focus:outline-none ${
          lang === "ja"
            ? "bg-primary text-primary-foreground"
            : "text-slate-700 hover:bg-muted hover:text-slate-900"
        }`}
      >
        JP
      </button>
      <span className="h-4 w-px bg-border" aria-hidden />
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        aria-label={t("header.switchToEn")}
        className={`px-2.5 py-1.5 transition focus:outline-none ${
          lang === "en"
            ? "bg-primary text-primary-foreground"
            : "text-slate-700 hover:bg-muted hover:text-slate-900"
        }`}
      >
        EN
      </button>
    </div>
  );
}
