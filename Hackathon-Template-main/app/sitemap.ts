import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

/**
 * サイトマップ（/sitemap.xml を自動生成）
 * ------------------------------------------------------------
 * 検索エンジンに「このサイトにどんなページがあるか」を伝えます。
 * - URL は siteConfig.siteUrl（本番ドメイン）を基準に組み立てます。
 * - ページを追加したら、下の routes 配列に 1 行足すだけで反映されます。
 *
 * 動作確認：本番（または `npm run build` 後）に /sitemap.xml へアクセス。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const lastModified = new Date();

  // priority はトップを最上位（1.0）に、その他は 0.8 を目安にしています。
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    // サービス案内は会社案内に統合済み（旧 /service は退避中。復活時はここに { path: "/service", priority: 0.8 } を戻す）
    { path: "/company", priority: 0.8 },
    { path: "/recruit", priority: 0.8 },
    { path: "/contact", priority: 0.7 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
