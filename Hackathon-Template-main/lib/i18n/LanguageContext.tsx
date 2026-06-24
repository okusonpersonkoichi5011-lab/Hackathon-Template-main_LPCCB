"use client";

/**
 * ========================================
 * 言語切替の状態を全コンポーネントへ届ける Provider
 * ----------------------------------------
 * - Context で現在の言語（"ja" / "en"）を保持
 * - localStorage に保存し、次回訪問時も維持
 * - useLanguage() フックで簡単にアクセス
 *   const { lang, setLang, t, pick } = useLanguage();
 * ========================================
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getText } from "./translations";
import type { Lang, Localized } from "./types";

const STORAGE_KEY = "lp-lang";

type LanguageContextValue = {
  /** 現在の言語 */
  lang: Lang;
  /** 言語を切り替える */
  setLang: (lang: Lang) => void;
  /** 言語をトグル（ja ↔ en） */
  toggleLang: () => void;
  /** 翻訳辞書からテキストを取得（"home.heroTitle" のようなドット記法） */
  t: (key: string) => string;
  /** Localized<T> から現在の言語の値を取り出す */
  pick: <T>(localized: Localized<T>) => T;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Provider。app/layout.tsx の最上位で使う。
 *
 * 初期値は localStorage、なければブラウザの navigator.language を見て決定。
 * SSR 時は "ja" を返し、マウント後に再評価される。
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ja");

  // 初回マウント時に localStorage / navigator から復元
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "ja" || saved === "en") {
        setLangState(saved);
        return;
      }
      // 保存が無ければ、navigator.language が "en" 系なら英語をデフォルトに
      if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("en")) {
        setLangState("en");
      }
    } catch {
      // localStorage が使えない環境では何もしない
    }
  }, []);

  // <html lang="..."> を実際の言語に同期させる
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "ja" ? "en" : "ja");
  }, [lang, setLang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: (key: string) => getText(key, lang),
      pick: <T,>(localized: Localized<T>) => localized[lang],
    }),
    [lang, setLang, toggleLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * 翻訳・言語切替を使うためのフック。
 * Provider の中でしか呼べません（呼ばれた場合は ja のフォールバック動作）。
 */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx;
  // Provider 外で呼ばれた場合のフォールバック（テストやサーバ側用）
  return {
    lang: "ja",
    setLang: () => {},
    toggleLang: () => {},
    t: (key: string) => getText(key, "ja"),
    pick: <T,>(localized: Localized<T>) => localized.ja,
  };
}
