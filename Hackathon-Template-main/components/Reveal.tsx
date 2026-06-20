"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  /** 中に入れる任意の React 要素 */
  children: React.ReactNode;
  /** アニメーションの種類（既定：fade-up） */
  variant?: "fade-up" | "fade-up-strong" | "fade" | "scale" | "slide-right" | "slide-left";
  /**
   * 出現を少し遅らせたいとき（ミリ秒、5 段階：100/200/300/400/500）
   * - スタッガー（カードを順番に出すなど）に便利
   */
  delay?: 100 | 200 | 300 | 400 | 500;
  /** ラッパーに追加で当てたい Tailwind クラス（レイアウト調整用） */
  className?: string;
  /**
   * ビューポートに入る前にトリガーするマージン（px）
   * 既定 -10% で「画面に少し見え始めた」タイミングで動かす
   */
  rootMargin?: string;
};

/**
 * スクロールで要素をフェードインさせるラッパー（NSD 風）
 *
 * 使い方：
 *   <Reveal>
 *     <SectionTitle ... />
 *   </Reveal>
 *
 * - サーバ側では中身を非表示の初期状態でレンダーし、
 *   ブラウザで IntersectionObserver により in-view になったら
 *   CSS アニメーションで出現させます。
 * - `prefers-reduced-motion` が有効な環境では globals.css 側で
 *   アニメーションが無効化され、最初から表示されます。
 */
export function Reveal({
  children,
  variant = "fade-up",
  delay,
  className,
  rootMargin = "0px 0px -10% 0px",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // SSR 時は実行されない。クライアントでマウントされたあとに監視を開始。
    const node = ref.current;
    if (!node) return;

    // IntersectionObserver 非対応の古いブラウザでは即表示する（フォールバック）
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    // 安全網：何らかの理由で IntersectionObserver が発火しない場合でも
    // 3秒経過したら必ず表示する（画像が「読み込まれない」ように見える事象の防止）
    const safetyTimer = window.setTimeout(() => {
      setInView(true);
    }, 3000);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect(); // 一度出したら以降は監視しない
            window.clearTimeout(safetyTimer);
            break;
          }
        }
      },
      { threshold: 0.05, rootMargin },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(safetyTimer);
    };
  }, [rootMargin]);

  // バリアントごとに in-view 時に当てるクラスを切り替え
  const animClass =
    variant === "fade"
      ? "reveal-in-fade"
      : variant === "scale"
        ? "reveal-in-scale"
        : variant === "fade-up-strong"
          ? "reveal-in-strong"
          : variant === "slide-right"
            ? "reveal-in-slide-right"
            : variant === "slide-left"
              ? "reveal-in-slide-left"
              : "reveal-in";

  const delayClass =
    delay === 100
      ? "lp-delay-100"
      : delay === 200
        ? "lp-delay-200"
        : delay === 300
          ? "lp-delay-300"
          : delay === 400
            ? "lp-delay-400"
            : delay === 500
              ? "lp-delay-500"
              : "";

  const stateClass = inView ? `${animClass} ${delayClass}`.trim() : "reveal-init";

  return (
    <div ref={ref} className={`${stateClass}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
