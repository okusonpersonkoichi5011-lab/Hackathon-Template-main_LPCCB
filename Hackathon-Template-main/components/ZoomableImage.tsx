"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ZoomableImageProps = {
  src: string;
  alt: string;
  /** サムネイル領域のクラス（aspect-ratio や border など） */
  wrapperClassName?: string;
  /** サムネイル時の sizes 属性 */
  thumbSizes?: string;
  /** 拡大時の画像の最大幅・最大高（CSS）。既定はビューポートいっぱい弱 */
  zoomMaxWidth?: string;
  zoomMaxHeight?: string;
};

/**
 * クリックで拡大表示できる画像。
 * - サムネイル：クリック可能なボタンとしてレンダリングし、押下で全画面オーバーレイを開く
 * - 拡大時：背景を暗くしてフォーカスを集める。背景クリック・ESC・×ボタンで閉じる
 * - 開いている間は body のスクロールを止める
 */
export function ZoomableImage({
  src,
  alt,
  wrapperClassName,
  thumbSizes,
  zoomMaxWidth = "min(96vw, 1280px)",
  zoomMaxHeight = "92vh",
}: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  // 開いている間は body のスクロールを停止
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC キーで閉じる
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt}を拡大表示`}
        className={`group relative block w-full overflow-hidden transition hover:opacity-90 focus:outline-2 focus:outline-offset-2 focus:outline-primary ${
          wrapperClassName ?? ""
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={thumbSizes ?? "(max-width: 768px) 100vw, 300px"}
          className="object-cover transition group-hover:scale-105"
        />
        {/* 拡大できることを示すヒント */}
        <span
          aria-hidden
          className="absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition group-hover:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </span>
      </button>

      {/* 拡大表示（全画面オーバーレイ） */}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm"
        >
          {/* 画像本体（クリックは伝播させて閉じる：背景と同じ挙動でOK） */}
          <div
            className="relative"
            style={{ maxWidth: zoomMaxWidth, maxHeight: zoomMaxHeight }}
          >
            {/* 大きく見せたいので width/height は省略し、img タグの自然描画にする */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="block max-h-[92vh] max-w-[96vw] rounded-lg shadow-2xl"
            />
          </div>

          {/* 閉じるボタン（右上） */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            aria-label="拡大表示を閉じる"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 transition hover:bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : null}
    </>
  );
}
