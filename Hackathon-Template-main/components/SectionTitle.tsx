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
 * デザイン：
 *  - 英字ラベル（任意）
 *  - 黄色い縦棒 ▎ ＋ 日本語見出し（横並び。下線スタイルから変更）
 *  - 説明文（任意・1 行に収まりやすいよう max-w-4xl まで広げる）
 *
 * `prefers-reduced-motion` 有効環境では Reveal の動きが止まって即時表示されます。
 */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-4xl">
      {eyebrow ? (
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>
        </Reveal>
      ) : null}
      <Reveal delay={eyebrow ? 100 : undefined}>
        {/* 見出しの左横に黄色い縦棒（▎）。下線スタイルから変更（依頼 #13） */}
        <div className="mt-2 flex items-center gap-3">
          <span aria-hidden className="block h-7 w-1.5 rounded-sm bg-primary sm:h-8 sm:w-2" />
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
        </div>
      </Reveal>
      {description ? (
        <Reveal delay={200}>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
