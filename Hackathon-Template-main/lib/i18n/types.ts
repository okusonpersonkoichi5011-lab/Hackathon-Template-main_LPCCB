/**
 * ========================================
 * i18n (国際化) の型定義
 * ----------------------------------------
 * 本サイトは「ヘッダーの JP / EN トグル」で日本語と英語を切替できます。
 * 全テキストは TypeScript の定数として持ち、現在の言語に応じて選びます。
 * ========================================
 */

/** サイトでサポートする言語 */
export type Lang = "ja" | "en";

/** 日本語と英語の両方を持つ汎用ローカライズ型 */
export type Localized<T> = {
  ja: T;
  en: T;
};

/** Localized<string> から現在の言語の値を取り出すヘルパー */
export function pick<T>(localized: Localized<T>, lang: Lang): T {
  return localized[lang];
}
