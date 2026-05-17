import type { ServiceItem } from "@/lib/data/services";

type ServiceCardProps = {
  service: ServiceItem;
};

/**
 * サービス紹介用カード
 * データは lib/data/services.ts の配列を編集・複製してください。
 */
export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article
      id={service.id}
      className="lp-hover-lift scroll-mt-28 rounded-xl border border-border bg-surface p-6 sm:p-8"
    >
      <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {service.summary}
      </p>
      <ul className="mt-5 space-y-2 text-sm text-slate-800">
        {service.points.map((point, index) => (
          <li key={`${service.id}-${index}`} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
