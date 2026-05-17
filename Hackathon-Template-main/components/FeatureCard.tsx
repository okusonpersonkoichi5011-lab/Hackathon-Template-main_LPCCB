type FeatureCardProps = {
  title: string;
  body: string;
};

/** 特徴紹介などで使うシンプルなカード */
export function FeatureCard({ title, body }: FeatureCardProps) {
  return (
    <article className="lp-hover-lift rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}
