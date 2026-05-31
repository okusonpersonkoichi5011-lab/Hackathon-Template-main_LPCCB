import Image from "next/image";
import type { ServiceItem } from "@/lib/data/services";

type ServiceCardProps = {
  service: ServiceItem;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article
      id={service.id}
      className="lp-hover-lift scroll-mt-28 overflow-hidden rounded-xl border border-border bg-surface"
    >
      <div className="grid md:grid-cols-[minmax(0,16rem)_1fr]">
        <div className="relative aspect-[4/3] w-full md:aspect-auto md:min-h-full">
          <Image
            src={service.image.src}
            alt={service.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 16rem"
            className="object-cover"
          />
        </div>
        <div className="p-6 sm:p-8">
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
        </div>
      </div>
    </article>
  );
}
