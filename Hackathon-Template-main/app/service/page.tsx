import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "サービス案内",
  description:
    "株式会社ライトパスのサービス案内。システムエンジニア・インフラエンジニア・ヘルプデスクサポートのアウトソーシングで、お客様の IT 課題の解決を支援します。",
  alternates: { canonical: "/service" },
  openGraph: {
    title: "サービス案内 | 株式会社ライトパス",
    description:
      "システム／インフラ／ヘルプデスクの各領域で、お客様の IT 課題に対応するアウトソーシングサービスをご提供します。",
    url: "/service",
  },
};

/**
 * サービス案内ページ
 * サービス内容は株式会社ライトパス公式サイトの案内に合わせています。
 */
export default function ServicePage() {
  return (
    <>
      <Hero
        title="システム／インフラ／ヘルプデスクで、IT 課題の解決を支援します。"
        description="スキルと実務経験の豊富なエンジニアが在籍し、お客様の現場に即したアウトソーシングサービスを提供しています。"
        primaryCta={{ href: "/contact", label: "お問い合わせへ" }}
        secondaryCta={{ href: "/company", label: "会社案内を見る" }}
      />

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
          <SectionTitle
            eyebrow="Overview"
            title="サービス案内"
            description="各サービスの概要です。詳細条件や事例は、ハッカソン中にチームで追記・差し替えしてください。"
          />
          <div className="mt-10 space-y-8">
            {services.map((service, index) => {
              const delay = ((index + 1) * 100) as 100 | 200 | 300;
              return (
                <Reveal key={service.id} delay={delay}>
                  <ServiceCard service={service} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
          <SectionTitle
            eyebrow="Strength"
            title="ライトパスの強み・特徴"
            description="第一線で活躍してきた精鋭スタッフが、課題解決を支援。未経験からのキャリア形成にも、研修と現場サポートで伴走します。"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Reveal delay={100}>
              <div className="lp-hover-lift rounded-lg border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-slate-900">現場に強いスペシャリスト</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  IT 業界の第一線で活躍してきたスタッフが、課題整理から実行まで伴走。お客様の現場に即した提案を行います。
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="lp-hover-lift rounded-lg border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-slate-900">未経験からの成長支援</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  研修資料・資格取得サポート・配属後のフォローまで一貫した育成体制で、未経験からの活躍を後押ししています。
                </p>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="lp-hover-lift rounded-lg border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-slate-900">幅広いアウトソーシング</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  システム開発・インフラ構築・社内 IT サポート／キッティングまで、ニーズに合わせたチーム編成が可能です。
                </p>
              </div>
            </Reveal>
          </div>

          {/* 採用への導線（公式採用ページの「カジュアル面談受付中」トーン） */}
          <Reveal variant="scale" className="mt-12 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
            <p className="text-sm font-semibold text-slate-900">
              一緒に会社を盛り上げてくれる仲間も募集しています。
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              ベンチャーならではのカジュアルな雰囲気で、和やかな面談を随時行っています。お気軽にお問い合わせください。
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/recruit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
              >
                採用情報を見る
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-primary hover:text-slate-900 hover:-translate-y-0.5"
              >
                お問い合わせへ
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
