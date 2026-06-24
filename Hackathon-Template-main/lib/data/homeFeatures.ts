/**
 * 【トップページの「会社の特徴」カードを変えたいときはここ】
 * 株式会社ライトパス公式サイトのトップメッセージに沿った内容です。
 *
 * 各項目に英語版（en）を持たせ、サイトの言語切替（JP/EN）に対応します。
 * 利用側では useLanguage() の pick() で取り出します：
 *   const { pick } = useLanguage();
 *   pick(feature.title);
 */

import type { Localized } from "@/lib/i18n/types";

export type HomeFeature = {
  title: Localized<string>;
  body: Localized<string>;
};

export const homeFeatures: HomeFeature[] = [
  {
    title: {
      ja: "専門スキルを持ったエンジニア",
      en: "Engineers with deep expertise",
    },
    body: {
      ja: "システムエンジニア、インフラエンジニア、ヘルプデスクサポートなど、専門性の高いアウトソーシングサービスをご提供します。",
      en: "We provide highly specialized outsourcing across system engineering, infrastructure engineering and help-desk support.",
    },
  },
  {
    title: {
      ja: "IT 業界で活躍してきたスペシャリスト",
      en: "Specialists from the IT front lines",
    },
    body: {
      ja: "第一線で活躍してきた精鋭スタッフが、お客様の課題解決にお力添えします。",
      en: "Top-tier staff with front-line experience help solve your business challenges.",
    },
  },
  {
    title: {
      ja: "未経験からのエンジニアキャリア支援",
      en: "Career support, even from zero experience",
    },
    body: {
      ja: "エンジニアのスキルアップと資格取得をサポートし、業界未経験から多くの方が活躍できる環境づくりに取り組んでいます。",
      en: "We help engineers grow their skills and earn certifications, building an environment where even newcomers to the industry can thrive.",
    },
  },
];
