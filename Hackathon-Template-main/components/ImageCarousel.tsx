"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type CarouselImage = {
  src: string;
  alt: string;
};

type ImageCarouselProps = {
  images: CarouselImage[];
  /** 自動切替の間隔（ms）。0 を指定すると自動切替なし */
  autoPlayMs?: number;
  /** 画像領域のアスペクト比（既定 4:3） */
  aspectRatio?: string;
  /** スクリーンリーダー用のリージョン名 */
  ariaLabel?: string;
  /** Prev / Next ボタンの aria-label（多言語対応） */
  labels?: {
    prev: string;
    next: string;
    goto: (index: number) => string;
    pause: string;
    play: string;
  };
};

/**
 * 画像カルーセル（採用情報「こんな人が集まっています！」用）
 *
 * 主な仕様:
 *  - 自動切替（既定 5 秒）。ホバー / フォーカス中は一時停止
 *  - 左右の矢印ボタンで手動操作
 *  - 下部のドットインジケータ（クリックで対象スライドへジャンプ）
 *  - キーボード操作（← / →）
 *  - スマホはスワイプ（タッチイベント）対応
 *  - 1 枚目以外は next/image の lazy load（パフォーマンス）
 *  - reduced-motion ユーザは自動切替を停止
 *  - aria-roledescription="carousel" 等で WAI-ARIA Authoring Practices に準拠
 */
export function ImageCarousel({
  images,
  autoPlayMs = 5000,
  aspectRatio = "4 / 3",
  ariaLabel = "画像カルーセル",
  labels = {
    prev: "前の画像へ",
    next: "次の画像へ",
    goto: (i) => `${i + 1} 枚目へ`,
    pause: "自動再生を停止",
    play: "自動再生を再開",
  },
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // OS の「動きを減らす」設定を検知（アクセシビリティ）
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const n = images.length;
      setIndex(((next % n) + n) % n);
    },
    [images.length],
  );
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  // 自動切替（ホバー中・reduced-motion・autoPlayMs=0 では停止）
  useEffect(() => {
    if (autoPlayMs <= 0 || isPaused || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, autoPlayMs);
    return () => window.clearInterval(timer);
  }, [autoPlayMs, isPaused, prefersReducedMotion, images.length]);

  // キーボード操作（左右矢印）
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  // スワイプ操作（モバイル）
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    const threshold = 40; // 40px 以上スワイプで切替
    if (delta > threshold) prev();
    else if (delta < -threshold) next();
    touchStartX.current = null;
  };

  if (images.length === 0) return null;

  // 1 枚しかない場合はコントロールを省いて表示
  const isSingle = images.length === 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="group relative w-full overflow-hidden rounded-xl border border-border bg-muted/40 focus:outline-2 focus:outline-offset-2 focus:outline-primary"
    >
      {/* 画像領域 */}
      <div className="relative w-full" style={{ aspectRatio }}>
        {images.map((img, i) => (
          <div
            key={img.src}
            aria-hidden={i !== index}
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${images.length}`}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {i === 0 ? (
              // 1 枚目は priority（LCP 改善）。priority と loading="lazy" は併用不可なので分岐
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            ) : (
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {!isSingle && (
        <>
          {/* 左ボタン */}
          <button
            type="button"
            onClick={prev}
            aria-label={labels.prev}
            className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/60 text-white shadow transition hover:bg-slate-900/80 focus:flex focus:outline-2 focus:outline-offset-2 focus:outline-primary group-hover:flex sm:flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5" aria-hidden>
              <polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {/* 右ボタン */}
          <button
            type="button"
            onClick={next}
            aria-label={labels.next}
            className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/60 text-white shadow transition hover:bg-slate-900/80 focus:flex focus:outline-2 focus:outline-offset-2 focus:outline-primary group-hover:flex sm:flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5" aria-hidden>
              <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* ドットインジケータ */}
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={labels.goto(i)}
                aria-current={i === index ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-primary"
                    : "w-2.5 bg-white/70 hover:bg-white"
                } shadow`}
              />
            ))}
          </div>

          {/* 再生 / 一時停止ボタン（右上） */}
          {autoPlayMs > 0 && !prefersReducedMotion && (
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? labels.play : labels.pause}
              className="absolute right-2 top-2 hidden h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white shadow transition hover:bg-slate-900/80 group-hover:flex sm:flex"
            >
              {isPaused ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              )}
            </button>
          )}

          {/* スライド番号（スクリーンリーダー用ライブリージョン） */}
          <p className="sr-only" aria-live="polite">
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </div>
  );
}
