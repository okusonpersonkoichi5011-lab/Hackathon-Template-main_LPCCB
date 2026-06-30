type FeatureCardProps = {
  title: string;
  body: string;
};

/** 特徴紹介などで使うシンプルなカード（h-full で親グリッドの行高に揃う） */
export function FeatureCard({ title, body }: FeatureCardProps) {
  return (
    <article className="lp-hover-lift flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{body}</p>
    </article>
  );
}
