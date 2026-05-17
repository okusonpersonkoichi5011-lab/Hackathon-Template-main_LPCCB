import { Reveal } from "@/components/Reveal";

type SectionTitleProps = {
  /** 英字の小さなラベル（任意） */
  eyebrow?: string;
  /** セクション見出し */
  title: string;
  /** 見出し下の説明（任意） */
  description?: string;
};

/**
 * 各セクションの見出しを統一して使い回すコンポーネント
 *
 * NSD 風の「英字ラベル → 日本語見出し → 説明」が
 * スクロールイン時に少し時間差で現れます。
 * `prefers-reduced-motion` が有効な環境では動かず即表示されます。
 */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>
        </Reveal>
      ) : null}
      <Reveal delay={eyebrow ? 100 : undefined}>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={200}>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
