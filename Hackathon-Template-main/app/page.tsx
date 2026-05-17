import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { homeFeatures } from "@/lib/data/homeFeatures";

/**
 * TOP ページ
 * キャッチや導線の文言は、株式会社ライトパス公式サイトのトップに掲載のメッセージに沿っています。
 * https://light-path.co.jp/
 */
export default function HomePage() {
  return (
    <>
      <Hero
        title="専門スキルを持ったエンジニアが、お客様の課題解決を支援します。"
        description="システムエンジニア、インフラエンジニア、ヘルプデスクサポートなどのアウトソーシングサービスをご提供しています。第一線で活躍してきたスペシャリストが、未経験からのキャリア形成も含めて伴走します。"
        primaryCta={{ href: "/service", label: "サービス案内へ" }}
        secondaryCta={{ href: "/contact", label: "お問い合わせ" }}
      />

      {/* 会社の特徴 */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionTitle
            eyebrow="Why us"
            title="ライトパスの特徴"
            description="公式サイトで訴求している価値を、テンプレート用にカード形式で整理しています。"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homeFeatures.map((feature, index) => {
              // 100/200/300ms とずらすことで、カードが順番に現れる "スタッガー" 効果
              const delay = ((index + 1) * 100) as 100 | 200 | 300;
              return (
                <Reveal key={feature.title} delay={delay}>
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
              className="inline-flex w-fit items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
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

      {/* 採用 / 問い合わせへの導線 */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionTitle
            eyebrow="Contact"
            title="採用情報・お問い合わせ"
            description="会社を一緒に盛り上げてくれる仲間を募集しています。未経験からのキャリアアップも、研修とサポートで後押しします。"
          />
          <Reveal delay={100}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact#jobs"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
              >
                採用情報を見る
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-primary hover:text-primary hover:-translate-y-0.5"
              >
                お問い合わせ
              </Link>
              <Link
                href="/company"
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-primary hover:text-primary hover:-translate-y-0.5"
              >
                会社案内
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
