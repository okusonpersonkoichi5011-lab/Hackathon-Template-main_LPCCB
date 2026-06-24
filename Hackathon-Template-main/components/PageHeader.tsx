import Image from "next/image";

type PageHeaderProps = {
  /** ヘッダーバナー画像のパス（英字タイトル・日本語サブが焼き込み済み） */
  src: string;
  /** スクリーンリーダー／SEO 用の代替テキスト（例：「サービス案内」） */
  alt: string;
};

/**
 * 各下層ページ共通のヘッダーバナー。
 *
 * 仕様：
 *  - すべてのバナーを「同じ高さ」で表示するため、アスペクト比を固定（1366 × 186）
 *  - 画像の比率が固定値と微妙に違っても、object-cover で自然にトリミング
 *  - これで会社案内・採用情報・お問い合わせ・プライバシーの 4 ページが
 *    完全に同じ高さでヘッダーバナーを表示できる
 *
 * - 焼き込みテキストは画像中央付近にあるため、上下数 px のトリミングがあっても
 *   重要な文字は欠けない設計です
 * - サイト全体のヘッダー（Header.tsx）のすぐ下に置く想定です
 */
export function PageHeader({ src, alt }: PageHeaderProps) {
  return (
    <div className="w-full overflow-hidden border-b border-border bg-surface">
      {/* アスペクト比 1366:186 を固定。画像差分は object-cover で吸収 */}
      <div className="relative w-full" style={{ aspectRatio: "1366 / 186" }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
