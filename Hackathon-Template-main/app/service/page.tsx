import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
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

export default function ServicePage() {
  return (
    <>
      <PageHeader src="/images/Service_header.png" alt="サービス案内" width={1366} height={201} />

      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
          <SectionTitle
            eyebrow="Service"
            title="サービス案内"
            description="システム／インフラ／ヘルプデスクの各領域で、お客様の IT 課題に対応します。"
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

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
          <SectionTitle
            eyebrow="Track record"
            title="案件実績一覧"
            description="これまでにご支援した主な取引先です。"
          />
          <Reveal>
            <div className="lp-hover-lift mt-8 rounded-xl border border-border bg-surface p-6">
              <p className="text-sm leading-relaxed text-slate-800">楽天グループ株式会社　他</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
