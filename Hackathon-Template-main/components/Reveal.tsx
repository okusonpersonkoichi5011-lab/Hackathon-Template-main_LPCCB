"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  /** 中に入れる任意の React 要素 */
  children: React.ReactNode;
  /** アニメーションの種類（既定：fade-up） */
  variant?: "fade-up" | "fade-up-strong" | "fade" | "scale" | "slide-right" | "slide-left";
  /**
   * 出現を少し遅らせたいとき（ミリ秒、5 段階：100/200/300/400/500）
   */
  delay?: 100 | 200 | 300 | 400 | 500;
  /** ラッパーに追加で当てたい Tailwind クラス */
  className?: string;
  /**
   * ビューポートに入る前にトリガーするマージン（px）
   * 既定 -10% で「画面に少し見え始めた」タイミングで動かす
   */
  rootMargin?: string;
};

/**
 * スクロールで要素をフェードインさせるラッパー（NSD 風・最適化版）
 *
 * パフォーマンス最適化：
 * - **共有 IntersectionObserver**：従来は Reveal ごとに 1 つの Observer を作成していたが、
 *   モジュール内で 1 つの Observer に複数要素を observe させる方式に変更。
 *   1ページに 20 個 Reveal があっても Observer は 1 個で済み、メモリ・CPU を節約。
 * - **安全網タイマー短縮**：3 秒 → 1.5 秒。表示までの最大待ちを半減。
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

// ---- モジュールスコープで Observer を共有 ----
// 同じ rootMargin であれば 1 つの Observer を再利用。要素ごとに on-intersect コールバックを保持。
const callbacks = new WeakMap<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;
let sharedObserverRootMargin = "";

function getSharedObserver(rootMargin: string): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  // rootMargin が異なる場合は別 Observer に分岐するが、ほぼ全 Reveal が同じ既定値を使う想定
  if (sharedObserver && sharedObserverRootMargin === rootMargin) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const cb = callbacks.get(entry.target);
          if (cb) cb();
          sharedObserver?.unobserve(entry.target);
          callbacks.delete(entry.target);
        }
      }
    },
    { threshold: 0.05, rootMargin },
  );
  sharedObserverRootMargin = rootMargin;
  return sharedObserver;
}

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
    const node = ref.current;
    if (!node) return;

    // ① マウント時にすでにビューポート内なら即時表示（最重要の取りこぼし防止）
    //   - 「リロード時に上に来てしまった要素が消える」「上の方の要素が出ない」を防ぐ
    //   - rootMargin はここでは無視して、純粋な可視判定で OK
    const rect = node.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const viewportW = window.innerWidth || document.documentElement.clientWidth;
    const alreadyVisible =
      rect.top < viewportH && rect.bottom > 0 && rect.left < viewportW && rect.right > 0;
    if (alreadyVisible) {
      setInView(true);
      return; // Observer 不要、安全網タイマー不要
    }

    const observer = getSharedObserver(rootMargin);
    if (!observer) {
      // 非対応環境では即時表示
      setInView(true);
      return;
    }

    // ② 安全網タイマー：8 秒（Observer 完全停止時の最終保険）
    //    ★ 短くしすぎると「下の方のコンテンツがスクロール前に勝手にフェード完了 →
    //       到達時に既表示でアニメが効かない」現象を生むため、8 秒と長めに設定。
    //    上の方の要素は ①（同期可視判定）で即時表示されるので、ここに到達する
    //    のは「下の方の Reveal がスクロールを待っている」状態だけ。
    const safetyTimer = window.setTimeout(() => {
      setInView(true);
      observer.unobserve(node);
      callbacks.delete(node);
    }, 8000);

    callbacks.set(node, () => {
      setInView(true);
      window.clearTimeout(safetyTimer);
    });
    observer.observe(node);

    return () => {
      observer.unobserve(node);
      callbacks.delete(node);
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
