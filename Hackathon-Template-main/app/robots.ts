import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

/**
 * robots.txt を自動生成（/robots.txt）
 * ------------------------------------------------------------
 * 検索エンジンのクローラに「クロール可否」と「サイトマップの場所」を伝えます。
 * - 全ページのクロールを許可（allow: "/"）。
 * - サイトマップの場所を明示し、インデックスを促進します。
 *
 * ★ 公開前にまだ検索結果へ出したくない場合は、一時的に
 *   rules を { userAgent: "*", disallow: "/" } に変更してください
 *   （その際は layout.tsx の robots.index も false 推奨）。
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.siteUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
