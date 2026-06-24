"use client";

import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { ServiceCard } from "@/components/ServiceCard";
import { ZoomableImage } from "@/components/ZoomableImage";
import { services } from "@/lib/data/services";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { siteConfig } from "@/lib/siteConfig";

/**
 * 会社案内ページの本体（クライアント側）
 *
 * 言語切替（JP/EN）に応じて、会社概要テーブル・代表挨拶・サービス案内・
 * アクセス情報のすべてのテキストが切り替わります。
 *
 * 構成：COMPANY バナー → 集合写真 → 会社概要 → 代表挨拶
 *      → サービス案内 → 案件実績 → アクセスマップ → アクセス情報
 */
export function CompanyPageBody() {
  const { t, lang, pick } = useLanguage();

  // 言語別の連絡先・アクセス情報
  const contactAddress = lang === "en" ? siteConfig.contactEn.address : siteConfig.contact.address;
  const contactHours =
    lang === "en" ? siteConfig.contactEn.businessHours : siteConfig.contact.businessHours;
  const trainLines = lang === "en" ? siteConfig.accessEn.train : siteConfig.access.train;
  const carLines = lang === "en" ? siteConfig.accessEn.car : siteConfig.access.car;
  const landmark = lang === "en" ? siteConfig.accessEn.landmark : siteConfig.access.landmark;
  const companyDisplayName = lang === "en" ? siteConfig.siteNameEn : siteConfig.siteName;

  // 会社概要テーブル（i18n 辞書からラベルと値を取得）
  const companyProfile: { label: string; value: string }[] = [
    { label: t("company.profileRows.companyName"), value: siteConfig.siteName },
    { label: t("company.profileRows.companyNameEn"), value: siteConfig.siteNameEn },
    { label: t("company.profileRows.ceo"), value: t("company.profileRows.ceoName") },
    { label: t("company.profileRows.capital"), value: t("company.profileRows.capitalValue") },
    {
      label: t("company.profileRows.employees"),
      value: t("company.profileRows.employeesValue"),
    },
    { label: t("company.profileRows.business"), value: t("company.profileRows.businessValue") },
    { label: t("company.profileRows.license"), value: t("company.profileRows.licenseValue") },
  ];

  return (
    <>
      <PageHeader
        src="/images/Company_header.png"
        alt={t("company.pageAlt")}
        width={1366}
        height={188}
      />

      <div className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14">
          {/* 集合写真 */}
          <Reveal>
            <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl border border-border">
              <Image
                src="/images/Group_photo.jpg"
                alt={t("company.groupPhotoAlt")}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* 会社概要 */}
          <section className="mt-14">
            <SectionTitle
              eyebrow={t("company.profileEyebrow")}
              title={t("company.profileTitle")}
            />
            <Reveal>
              <div className="lp-hover-lift mt-6 overflow-hidden rounded-xl border border-border bg-surface">
                <dl className="divide-y divide-border text-sm">
                  {companyProfile.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5"
                    >
                      <dt className="font-medium text-muted-foreground">{row.label}</dt>
                      <dd className="text-slate-900">{row.value}</dd>
                    </div>
                  ))}
                  <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5">
                    <dt className="font-medium text-muted-foreground">
                      {t("company.profileRows.address")}
                    </dt>
                    <dd className="text-slate-900">{contactAddress}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5">
                    <dt className="font-medium text-muted-foreground">
                      {t("company.profileRows.tel")}
                    </dt>
                    <dd className="text-slate-900">{siteConfig.contact.phone}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4 sm:p-5">
                    <dt className="font-medium text-muted-foreground">
                      {t("company.profileRows.hours")}
                    </dt>
                    <dd className="text-slate-900">{contactHours}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </section>

          {/* 代表挨拶 */}
          <section className="mt-16">
            <SectionTitle
              eyebrow={t("company.messageEyebrow")}
              title={t("company.messageTitle")}
            />
            <Reveal variant="slide-right">
              <div className="mt-6 overflow-hidden rounded-xl border border-border bg-muted/40">
                <div className="relative aspect-[1004/400] w-full">
                  <Image
                    src="/images/UnleashYP.png"
                    alt={t("company.messageCeoAlt")}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-sm leading-relaxed text-slate-800">{t("company.messageP1")}</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-800">
                    {t("company.messageP2")}
                  </p>
                  <p className="mt-6 text-sm font-medium text-slate-900">
                    {t("company.messageSignature")}
                  </p>
                </div>
              </div>
            </Reveal>
          </section>

          {/* サービス案内 */}
          <section id="service" className="mt-16 scroll-mt-28">
            <SectionTitle
              eyebrow={t("company.serviceEyebrow")}
              title={t("company.serviceTitle")}
              description={t("company.serviceDesc")}
            />
            <div className="mt-10 space-y-8">
              {services.map((service, index) => {
                const delay = ((index + 1) * 100) as 100 | 200 | 300;
                return (
                  <Reveal key={service.id} variant="slide-right" delay={delay}>
                    <ServiceCard service={service} />
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* 案件実績 */}
          <section className="mt-16">
            <SectionTitle
              eyebrow={t("company.trackEyebrow")}
              title={t("company.trackTitle")}
              description={t("company.trackDesc")}
            />
            <Reveal variant="fade-up-strong">
              <div className="lp-hover-lift mt-8 rounded-xl border border-border bg-surface p-6">
                <p className="text-sm leading-relaxed text-slate-800">
                  {t("company.trackBody")}
                </p>
              </div>
            </Reveal>
          </section>

          {/* アクセスマップ */}
          <section id="access" className="mt-16 scroll-mt-28">
            <SectionTitle
              eyebrow={t("company.accessEyebrow")}
              title={t("company.accessTitle")}
              description={t("company.accessDesc")}
            />
            <Reveal variant="slide-right">
              <div className="mt-6 overflow-hidden rounded-xl border border-border">
                <iframe
                  title={t("company.accessMapTitle")}
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
                  <h3 className="text-sm font-semibold text-slate-900">
                    {t("company.accessAddrTitle")}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {contactAddress}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {contactHours}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <div className="lp-hover-lift h-full rounded-xl border border-border bg-surface p-6">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {t("company.accessTrainTitle")}
                  </h3>
                  <ul className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
                    {trainLines.map((line) => (
                      <li key={line}>・{line}</li>
                    ))}
                    {carLines.map((line) => (
                      <li key={line}>・{line}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </section>

          {/* アクセス情報（目印） */}
          <section className="mt-16">
            <SectionTitle
              eyebrow={t("company.landmarkEyebrow")}
              title={t("company.landmarkTitle")}
            />
            <Reveal>
              <div className="mt-6 grid gap-6 rounded-xl border border-border bg-surface p-6 md:grid-cols-[300px_1fr] md:items-center">
                <ZoomableImage
                  src="/images/SHINANOYA.png"
                  alt={t("company.landmarkPhotoAlt")}
                  wrapperClassName="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border"
                  thumbSizes="(max-width: 768px) 100vw, 300px"
                />
                <div>
                  <p className="text-sm leading-relaxed text-slate-800">{landmark}</p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {t("company.landmarkNote")}
                  </p>
                </div>
              </div>
            </Reveal>
          </section>

          {/* 「会社案内」フッター用：社名（言語別） */}
          <p className="sr-only">{companyDisplayName}</p>
        </div>
      </div>
    </>
  );
}
