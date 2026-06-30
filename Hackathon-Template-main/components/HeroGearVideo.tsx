"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** mp4 動画のパス */
  src: string;
  /** 動画ロード前 / 再生不可時に出す静止画パス */
  poster: string;
  /** 動画の最終的な不透明度（0.0〜1.0、既定 0.6 でテキスト可読性確保） */
  opacity?: number;
  /** フェードインに要する時間（ミリ秒、既定 1200ms） */
  fadeInMs?: number;
};

/**
 * TOP ページのヒーロー背景動画（歯車回転・1 回再生・終端停止）
 *
 * 再生方針：
 *  - ページ遷移時に動画を「ふわーっと」フェードインさせる（opacity: 0 → target）
 *  - HTML 標準の `autoPlay` 属性で 1 回だけ自動再生（`loop` は付けない）
 *  - 再生が終わったら最終フレームで自動停止（ブラウザ既定動作のまま）
 *  - 再 mount 時（別ページから戻って来た場合など）も先頭から 1 回だけ再生される
 *
 * その他の最適化：
 *  - prefers-reduced-motion ユーザには動画を出さず poster のみ
 *  - 透過 + 白系グラデで上のキャッチコピーの可読性を確保
 *  - preload="metadata" で初回ロードを軽く
 */
export function HeroGearVideo({
  src,
  poster,
  opacity = 0.6,
  fadeInMs = 1200,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  // 終端到達時に明示的に一時停止（loop なしなので通常はブラウザ任せでも OK だが、
  // 一部ブラウザで僅かに再生位置が巻き戻る挙動を防ぐ）
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onEnded = () => {
      try {
        v.pause();
        if (Number.isFinite(v.duration)) {
          v.currentTime = v.duration;
        }
      } catch {
        /* noop */
      }
    };
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, []);

  // フェードインは CSS アニメーション（@keyframes lp-hero-fade-in）に任せる：
  //   - SSR / CSR 双方で確実に発火
  //   - React 状態に依存しないのでハイドレーション遅延で消えない
  //   - prefers-reduced-motion 環境では CSS 側で animation を無効化 → 即・最終 opacity 表示
  const fadeStyle: React.CSSProperties = {
    opacity,
    animation: `lp-hero-fade-in ${fadeInMs}ms ease-out both`,
  };

  return (
    <>
      <video
        ref={ref}
        muted
        playsInline
        autoPlay
        preload="metadata"
        poster={poster}
        aria-hidden
        className="lp-hero-fade absolute inset-0 -z-10 h-full w-full object-cover"
        style={fadeStyle}
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* キャッチコピーの可読性向上：左 80% → 右 40% のグラデーション
          （左にキャッチコピーが乗るため左を濃く、右は動画が見えるよう薄めに） */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-white/80 to-white/40"
      />
    </>
  );
}
