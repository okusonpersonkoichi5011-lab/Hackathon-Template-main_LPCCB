import type { Metadata } from "next";
import { RecruitPageBody } from "./RecruitPageBody";

/**
 * 採用情報ページ
 * - metadata はサーバ側で固定（SEO 用・日本語）
 * - 本体は RecruitPageBody（クライアント）で日英切替に対応
 */
export const metadata: Metadata = {
  title: "採用情報",
  description:
    "株式会社ライトパスの採用情報。システム／インフラ／ヘルプデスクの募集職種、求める人物像、応募の流れをご案内。未経験からのキャリアアップも研修とサポートで後押しします。",
  alternates: { canonical: "/recruit" },
  openGraph: {
    title: "採用情報 | 株式会社ライトパス",
    description:
      "一緒に会社を盛り上げてくれる仲間を募集中。未経験からのキャリアアップも研修とサポートで後押しします。",
    url: "/recruit",
  },
};

export default function RecruitPage() {
  return <RecruitPageBody />;
}
