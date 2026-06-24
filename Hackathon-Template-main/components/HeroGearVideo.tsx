"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** mp4 動画のパス */
  src: string;
  /** 動画ロード前 / 再生不可時に出す静止画パス */
  poster: string;
  /** 動画の不透明度（0.0〜1.0、既定 0.6 でテキスト可読性確保） */
  opacity?: number;
  /**
   * ループ開始位置（秒）。既定 0。
   * 動画の冒頭に "助走" のような不自然な数フレームがある場合に少し進めると馴染む。
   */
  loopStart?: number;
  /**
   * ループ終了位置（秒）。指定しなければ動画末尾でループ。
   * 末尾の数フレームが開始位置と合っていない場合、ここを早めに設定すると繋ぎ目が滑らかになる。
   * 例：duration が 5.5 秒なら 5.3 などにすると最後の 0.2 秒を飛ばしてループ。
   */
  loopEnd?: number;
};

/**
 * TOP ページのヒーロー背景動画（歯車回転・ループ）
 *
 * 再生方針：
 *  - HTML 標準の `autoPlay` + `loop` 属性で確実に再生・ループさせる（再生不能を防止）
 *  - JS は「loopEnd に達したら loopStart へジャンプ」する繋ぎ目調整のみ担当
 *    - loopEnd が duration より小さければ JS が先に発火 → 早めにループ
 *    - loopStart が 0 より大きければ初回ロード時に JS が currentTime を進める
 *  - loopStart=0 / loopEnd 未指定なら JS は何もせず、ブラウザ標準のループに任せる
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
  loopStart = 0,
  loopEnd,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // reduced-motion 設定検知
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ループ点ジャンプ制御（再生開始は autoPlay 属性に任せる）
  useEffect(() => {
    const v = ref.current;
    if (!v || reducedMotion) return;

    // 初回：loopStart が 0 より大きい場合のみ初期位置を進める
    const onLoadedMetadata = () => {
      if (loopStart > 0 && loopStart < v.duration) {
        v.currentTime = loopStart;
      }
    };
    v.addEventListener("loadedmetadata", onLoadedMetadata);

    // 再生中：loopEnd を超えたら loopStart へジャンプ
    // ★ timeupdate は約 250ms 間隔でしか発火しないので、loopEnd が動画末尾の
    //   ~0.2 秒以内だとネイティブ loop が先に発動して効かない問題があった。
    //   setInterval で 50ms 周期に polling して確実に検出する。
    let intervalId: number | undefined;
    if (loopEnd != null) {
      intervalId = window.setInterval(() => {
        if (v.currentTime >= loopEnd) {
          v.currentTime = loopStart;
        }
      }, 50);
    }

    return () => {
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [loopStart, loopEnd, reducedMotion]);

  // モーション縮減ユーザには動画を出さず poster で固定
  if (reducedMotion) {
    return (
      <img
        src={poster}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
    );
  }

  return (
    <>
      <video
        ref={ref}
        muted
        playsInline
        autoPlay
        loop
        preload="metadata"
        poster={poster}
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        style={{ opacity }}
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
