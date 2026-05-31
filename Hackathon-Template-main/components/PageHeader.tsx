import Image from "next/image";

type PageHeaderProps = {
  /** ヘッダーバナー画像のパス（英字タイトル・日本語サブが焼き込み済み） */
  src: string;
  /** スクリーンリーダー／SEO 用の代替テキスト（例：「サービス案内」） */
  alt: string;
  /** 画像の実寸（レイアウトシフト防止・アスペクト比維持に使用） */
  width?: number;
  height?: number;
};

/**
 * 各下層ページ共通のヘッダーバナー。
 * - public/images の *_header.png（"Service" などの英字タイトルが焼き込み済み）を
 *   ブラウザ幅いっぱいに表示します。
 * - サイト全体のヘッダー（Header.tsx）のすぐ下に置く想定です。
 */
export function PageHeader({ src, alt, width = 1366, height = 200 }: PageHeaderProps) {
  return (
    <div className="w-full overflow-hidden border-b border-border bg-surface">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        sizes="100vw"
        className="h-auto w-full"
      />
    </div>
  );
}
