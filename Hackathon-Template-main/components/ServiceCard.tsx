"use client";

import Image from "next/image";
import type { ServiceItem } from "@/lib/data/services";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type ServiceCardProps = {
  service: ServiceItem;
};

/**
 * サービス案内カード（日英対応）
 * Localized<string> の各フィールドを pick() で現在の言語に変換して表示します。
 */
export function ServiceCard({ service }: ServiceCardProps) {
  const { pick } = useLanguage();
  const points = pick(service.points);

  return (
    <article
      id={service.id}
      className="lp-hover-lift scroll-mt-28 overflow-hidden rounded-xl border border-border bg-surface"
    >
      <div className="grid md:grid-cols-[minmax(0,16rem)_1fr]">
        <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-full">
          <Image
            src={service.image.src}
            alt={pick(service.image.alt)}
            fill
            sizes="(max-width: 768px) 100vw, 16rem"
            className="object-cover"
          />
        </div>
        <div className="p-6 sm:p-8">
          <h3 className="text-2xl font-semibold text-slate-900">{pick(service.title)}</h3>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {pick(service.summary)}
          </p>
          <ul className="mt-5 space-y-2 text-base text-slate-800">
            {points.map((point, index) => (
              <li key={`${service.id}-${index}`} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
