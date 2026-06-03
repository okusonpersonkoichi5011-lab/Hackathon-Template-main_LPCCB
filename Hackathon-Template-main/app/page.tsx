import Image from "next/image";
import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { homeFeatures } from "@/lib/data/homeFeatures";

/**
 * TOP ページ
 * キャッチや導線の文言は、株式会社ライトパス公式サイトのトップに掲載のメッセージに沿っています。
 * https://light-path.co.jp/
 *
 * レイアウトはお客様提供の見本に準拠：
 * - ヒーロー＋ライトパスの特徴（歯車背景 PageTop_bg.png を共通の背景として敷く）
 * - サービス案内への導線
 * - 採用情報・お問い合わせ（ボタン3つ）
 * - 写真バンド（employee1〜3.png）
 */
export default function HomePage() {
  const bandPhotos = [
    { src: "/images/employee1.png", alt: "打ち合わせの様子" },
    { src: "/images/employee2.png", alt: "社員が移動する様子" },
    { src: "/images/employee3.png", alt: "作業に取り組む様子" },
  ];
  // マーキー用：同じ並びを2回つなげて1セットとし、さらに2回描画して -50% 移動で途切れずループ
  const marqueePhotos = [...bandPhotos, ...bandPhotos];

  return (
    <>
      {/* ヒーロー＋特徴（歯車背景を共通で敷く） */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <Image
          src="/images/PageTop_bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* 文字・カードを読みやすくするための淡いオーバーレイ */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-white/70 via-white/55 to-white/75"
        />

        {/* キャッチコピー */}
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-28">
          <div className="max-w-2xl">
            <h1 className="lp-animate-slide-in-right text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              専門スキルを持ったエンジニアが、お客様の課題解決を支援します。
            </h1>
            <p className="lp-animate-slide-in-right lp-delay-500 mt-5 text-base leading-relaxed text-slate-700 sm:text-lg">
              システムエンジニア、インフラエンジニア、ヘルプデスクサポートなどのアウトソーシングサービスをご提供しています。第一線で活躍してきたスペシャリストが、未経験からのキャリア形成も含めて伴走します。
            </p>
            <div className="lp-animate-fade-up lp-delay-200 mt-10 flex flex-wrap gap-3">
              <Link
                href="/service"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
              >
                サービス案内を見る
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-primary hover:text-slate-900"
              >
                お問い合わせへ
              </Link>
            </div>
          </div>
        </div>

        {/* ライトパスの特徴（歯車背景の上に重ねる） */}
        <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-20">
          <SectionTitle
            eyebrow="Why us"
            title="ライトパスの特徴"
            description="第一線で活躍してきたスペシャリストが、専門性の高いサービスでお客様の IT 課題に伴走します。"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homeFeatures.map((feature, index) => {
              const delay = ((index + 1) * 100) as 100 | 200 | 300;
              return (
                <Reveal key={feature.title} variant="fade-up-strong" delay={delay}>
                  <FeatureCard title={feature.title} body={feature.body} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* サービス案内への導線 */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow="Services"
              title="サービス案内"
              description="システム／インフラ／ヘルプデスクの各領域で、お客様の IT 課題に対応します。"
            />
            <Link
              href="/service"
              className="inline-flex w-fit items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
            >
              サービス一覧を見る
            </Link>
          </div>
          <Reveal>
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              IT システムやインフラに関する課題解決はお任せください。まずはお気軽にご相談いただけます。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 採用情報・お問い合わせ（見本に合わせて1セクションに統合） */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionTitle
            eyebrow="Recruit & Contact"
            title="採用情報・お問い合わせ"
            description="会社を一緒に盛り上げてくれる仲間を募集しています。サービスや協業のご相談もお気軽にどうぞ。"
          />
          <Reveal delay={100}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/recruit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md"
              >
                採用情報を見る
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-primary hover:text-slate-900"
              >
                お問い合わせ
              </Link>
              <Link
                href="/company"
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-primary hover:text-slate-900"
              >
                会社案内
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 写真バンド（背景 picture_bg.png ＋ 右から左へ流れるマーキー） */}
      <section aria-label="社内・現場の様子" className="relative isolate overflow-hidden">
        {/* 背景画像 */}
        <Image
          src="/images/picture_bg.png"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="py-12 sm:py-16">
          {/* marqueePhotos（2周分）をさらに2回描画し、-50% 移動で途切れずループ */}
          <div className="lp-marquee flex w-max items-stretch gap-6 px-3">
            {[...marqueePhotos, ...marqueePhotos].map((photo, index) => (
              <div
                key={index}
                className="relative aspect-[16/10] w-[72vw] shrink-0 overflow-hidden rounded-xl border border-white/60 shadow-md sm:w-[44vw] lg:w-[31vw]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 72vw, (max-width: 1024px) 44vw, 31vw"
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
