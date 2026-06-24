"use client";

import Image from "next/image";
import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { HeroGearVideo } from "@/components/HeroGearVideo";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { homeFeatures } from "@/lib/data/homeFeatures";
import { useLanguage } from "@/lib/i18n/LanguageContext";

/**
 * TOP ページ（日英対応）
 * - 文言は lib/i18n/translations.ts の "home.*" から取得
 * - homeFeatures の各カードも Localized<string> なので pick() で言語別に取り出す
 *
 * レイアウトは見本に準拠：
 * - ヒーロー＋ライトパスの特徴
 * - 採用情報・お問い合わせへの導線
 * - 写真バンド（マーキー）
 */
export default function HomePage() {
  const { t, pick } = useLanguage();

  // alt テキストも辞書から取得（日英で適切な説明文に切替）
  const bandPhotos = [
    { src: "/images/employee1.jpg", alt: t("home.bandAlt.meeting") },
    { src: "/images/employee2.jpg", alt: t("home.bandAlt.moving") },
    { src: "/images/employee3.jpg", alt: t("home.bandAlt.working") },
  ];
  // マーキー用：1 セット（3 枚）を 2 回つなげて 6 枚にし、-50% 移動で途切れずループ。
  // ※ パフォーマンス対策で従来の 12 枚描画から 6 枚に削減（半分のメモリ・GPU 使用量）
  const marqueePhotos = [...bandPhotos, ...bandPhotos];

  return (
    <>
      {/* ヒーロー＋特徴（歯車動画を背景に敷く）
          - HeroGearVideo はループ再生（歯車は常時動くメタファー）
          - opacity 0.6 と白系グラデーションでテキストの可読性を確保
          - reduced-motion ユーザには静止画 PageTop_bg.png にフォールバック
          - loopStart / loopEnd で繋ぎ目を調整可能：
              繋ぎ目が気になる場合は loopEnd の秒数を 0.1 ずつ早めて試すと馴染みやすい */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <HeroGearVideo
          src="/images/top_gear.mp4"
          poster="/images/PageTop_bg.png"
          opacity={0.6}
          loopStart={0}
          loopEnd={3.35}
        />

        {/* キャッチコピー */}
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-28">
          <div className="max-w-2xl">
            <h1 className="lp-animate-slide-in-right text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t("home.heroTitle")}
            </h1>
            <p className="lp-animate-slide-in-right lp-delay-500 mt-5 text-lg leading-relaxed text-slate-700 sm:text-xl">
              {t("home.heroBody")}
            </p>
          </div>
        </div>

        {/* ライトパスの特徴 */}
        <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20">
          <SectionTitle
            eyebrow={t("home.whyUsEyebrow")}
            title={t("home.whyUsTitle")}
            description={t("home.whyUsDesc")}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homeFeatures.map((feature, index) => {
              const delay = ((index + 1) * 100) as 100 | 200 | 300;
              const localizedTitle = pick(feature.title);
              return (
                <Reveal key={localizedTitle} variant="fade-up-strong" delay={delay}>
                  <FeatureCard title={localizedTitle} body={pick(feature.body)} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 採用情報・お問い合わせ */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionTitle
            eyebrow={t("home.ctaEyebrow")}
            title={t("home.ctaTitle")}
            description={t("home.ctaDesc")}
          />
          <Reveal delay={100}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/recruit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-base font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
              >
                {t("home.ctaRecruit")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-base font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-primary hover:text-slate-900"
              >
                {t("home.ctaContact")}
              </Link>
              <Link
                href="/company"
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-base font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-primary hover:text-slate-900"
              >
                {t("home.ctaCompany")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 写真バンド（マーキー）
          - lp-marquee-section クラスで content-visibility: auto を適用し、
            画面外では描画計算を完全にスキップ（スクロール負荷の主因対策）
          - 描画回数を [...marqueePhotos, ...marqueePhotos]（12 枚）から
            marqueePhotos そのまま（6 枚）に削減 */}
      <section
        aria-label={t("home.bandAria")}
        className="lp-marquee-section relative isolate overflow-hidden"
      >
        <Image
          src="/images/picture_bg.png"
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          className="-z-10 object-cover"
        />
        <div className="py-12 sm:py-16">
          <div className="lp-marquee flex w-max items-stretch gap-6 px-3">
            {marqueePhotos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-[16/10] w-[72vw] shrink-0 overflow-hidden rounded-xl border border-white/60 shadow-md sm:w-[44vw] lg:w-[31vw]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 72vw, (max-width: 1024px) 44vw, 31vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
