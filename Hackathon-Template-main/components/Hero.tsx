import Link from "next/link";

type HeroProps = {
  /** メイン見出し（例：トップページのキャッチコピー） */
  title: string;
  /** 見出し下の説明文 */
  description: string;
  /** メインの行動ボタン */
  primaryCta: { href: string; label: string };
  /** サブの行動ボタン（任意。不要なら undefined） */
  secondaryCta?: { href: string; label: string };
};

/**
 * ヒーローセクション（大きな見出し＋導線）
 * トップ以外のページでも再利用できます。
 */
export function Hero({ title, description, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h1 className="lp-animate-fade-up text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="lp-animate-fade-up lp-delay-100 mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
          <div className="lp-animate-fade-up lp-delay-200 mt-10 flex flex-wrap gap-3">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            >
              {primaryCta.label}
            </Link>
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-primary hover:text-slate-900 hover:-translate-y-0.5"
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
        {/*
          【画像を入れたいとき】
          この下あたりに <Image /> を置くと雰囲気が大きく変わります。
          まずはプレースホルダーで余白だけ確保しています（自由に装飾してください）。
        */}
        <div
          className="lp-animate-fade-in lp-delay-300 mt-12 aspect-[21/9] w-full max-w-3xl rounded-xl border border-dashed border-border bg-muted/60"
          aria-hidden
        />
      </div>
    </section>
  );
}
