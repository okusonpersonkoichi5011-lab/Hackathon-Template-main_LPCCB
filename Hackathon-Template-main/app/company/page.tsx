import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/data/services";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "会社案内",
  description:
    "株式会社ライトパスの会社案内。会社概要、代表挨拶、事業内容、アクセス（東京都渋谷区道玄坂）をご紹介します。",
  alternates: { canonical: "/company" },
  openGraph: {
    title: "会社案内 | 株式会社ライトパス",
    description:
      "会社概要・代表挨拶・事業内容・アクセスをご紹介します。本社は東京都渋谷区道玄坂。",
    url: "/company",
  },
};

/** 会社概要テーブルの項目（公式サイトの表と同一） */
const companyProfile: { label: string; value: string }[] = [
  { label: "会社名", value: "株式会社ライトパス" },
  { label: "英文社名", value: "Light Path Inc." },
  { label: "代表取締役", value: "野坂 星司" },
  { label: "資本金", value: "4,000 万円" },
  { label: "従業員数", value: "正社員 121 名（2026 年 1 月現在）" },
  {
    label: "事業内容",
    value:
      "システムエンジニアリングサービス、インフラエンジニアリングサービス、ヘルプデスク・サポートデスク アウトソーシング",
  },
  { label: "許認可・資格", value: "労働者派遣事業（許可番号：派13-317835）" },
];

/**
 * 会社案内ページ（レイアウト見本に準拠）
 * 会社概要・代表挨拶・事業内容は、株式会社ライトパス公式サイトの公開情報に基づきます。
 * https://light-path.co.jp/company/
 *
 * 構成：COMPANY バナー → 集合写真 → 会社概要 → 代表挨拶
 *      → サービス案内 → 案件実績一覧 → アクセスマップ → アクセス情報
 *      （※「サービス案内」「案件実績」はサービス案内ページから統合）
 */
export default function CompanyPage() {
  return (
    <>
      <PageHeader src="/images/Company_header.png" alt="会社案内" width={1366} height={188} />

      <div className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14">
          {/* 集合写真 */}
          <Reveal>
            <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl border border-border">
              <Image
                src="/images/Group_photo.jpg"
                alt="株式会社ライトパスの集合写真"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* 会社概要 */}
          <section className="mt-14">
            <SectionTitle eyebrow="Profile" title="会社概要" />
            <Reveal>
              <div className="lp-hover-lift mt-6 overflow-hidden rounded-xl border border-border bg-surface">
                <dl className="divide-y divide-border text-sm">
                  {companyProfile.map((row) => (
                    <div key={row.label} className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5">
                      <dt className="font-medium text-muted-foreground">{row.label}</dt>
                      <dd className="text-slate-900">{row.value}</dd>
                    </div>
                  ))}
                  <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5">
                    <dt className="font-medium text-muted-foreground">所在地</dt>
                    <dd className="text-slate-900">{siteConfig.contact.address}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5">
                    <dt className="font-medium text-muted-foreground">TEL</dt>
                    <dd className="text-slate-900">{siteConfig.contact.phone}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5">
                    <dt className="font-medium text-muted-foreground">営業時間</dt>
                    <dd className="text-slate-900">{siteConfig.contact.businessHours}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </section>

          {/* 代表挨拶 */}
          <section className="mt-16">
            <SectionTitle eyebrow="Message" title="代表挨拶" />
            <Reveal>
              <div className="mt-6 overflow-hidden rounded-xl border border-dashed border-border bg-muted/40">
                <div className="relative aspect-[1004/400] w-full">
                  <Image
                    src="/images/UnleashYP.png"
                    alt="代表取締役 野坂 星司"
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-sm leading-relaxed text-slate-800">
                    「Unleash your potential（潜在能力を解放する）」私達は誰もが皆、本人も気が付かない程の無限の可能性を持っています。株式会社ライトパスは、個々人が自身のスキルや才能を最大限に活かし、成長し続けるための道しるべの様な存在でありたいと願っています。
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-800">
                    昨今の企業活動では、どの様な組織においても「DX 推進」や「リスキリング」の必要性が叫ばれております。一方で、IT
                    エンジニア不足が深刻化しており、人材の確保・育成がますます重要となっております。私達は、個々人の可能性に光をあて、1
                    人でも多くの IT エンジニアを育成・輩出し、企業の DX 化を通して世の中に貢献していきます。
                  </p>
                  <p className="mt-6 text-sm font-medium text-slate-900">
                    株式会社ライトパス　代表取締役　野坂 星司
                  </p>
                </div>
              </div>
            </Reveal>
          </section>

          {/* サービス案内（旧サービス案内ページから統合） */}
          <section id="service" className="mt-16 scroll-mt-28">
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
          </section>

          {/* 案件実績一覧（旧サービス案内ページから統合） */}
          <section className="mt-16">
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
          </section>

          {/* アクセスマップ */}
          <section id="access" className="mt-16 scroll-mt-28">
            <SectionTitle
              eyebrow="Access"
              title="アクセスマップ"
              description="各線の渋谷駅から徒歩 5〜10 分ほど。「道玄坂上交番前」交差点から道玄坂を少し上った左手のビルです。"
            />
            <Reveal>
              <div className="mt-6 overflow-hidden rounded-xl border border-border">
                <iframe
                  title="株式会社ライトパス 所在地の地図"
                  src="https://maps.google.com/maps?q=%E6%9D%B1%E4%BA%AC%E9%83%BD%E6%B8%8B%E8%B0%B7%E5%8C%BA%E9%81%93%E7%8E%84%E5%9D%821-19-11&z=16&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[320px] w-full sm:h-[400px]"
                />
              </div>
            </Reveal>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Reveal delay={100}>
                <div className="lp-hover-lift h-full rounded-xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold text-slate-900">所在地・営業時間</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {siteConfig.contact.address}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {siteConfig.contact.businessHours}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <div className="lp-hover-lift h-full rounded-xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold text-slate-900">電車・お車でお越しの場合</h3>
                  <ul className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
                    {siteConfig.access.train.map((line) => (
                      <li key={line}>・{line}</li>
                    ))}
                    {siteConfig.access.car.map((line) => (
                      <li key={line}>・{line}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </section>

          {/* アクセス情報（目印） */}
          <section className="mt-16">
            <SectionTitle eyebrow="Landmark" title="アクセス情報" />
            <Reveal>
              <div className="mt-6 grid gap-6 rounded-xl border border-border bg-surface p-6 md:grid-cols-[300px_1fr] md:items-center">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border">
                  <Image
                    src="/images/SHINANOYA.png"
                    alt="ビル1階の信濃屋（SHINANOYA）の外観"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-slate-800">{siteConfig.access.landmark}</p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    ※ ビル入口は「SHINANOYA（信濃屋）」さんの左脇です。入ってすぐエレベーターがありますので 8 階へお越しください。
                  </p>
                </div>
              </div>
            </Reveal>
          </section>
        </div>
      </div>
    </>
  );
}
