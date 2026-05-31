export type ServiceItem = {
  id: string;
  title: string;
  summary: string;
  points: string[];
  image: { src: string; alt: string };
};

export const services: ServiceItem[] = [
  {
    id: "system-engineer",
    title: "システムエンジニアリングサービス",
    summary:
      "IT の各分野や開発言語などに対応し、スキルと実務経験の豊富なエンジニアがお客様の課題解決を支援します。",
    points: [
      "システム企画・開発",
      "アプリケーション開発・支援",
      "システムテスト",
      "その他企画・保守",
    ],
    image: { src: "/images/Service1.png", alt: "システム開発のイメージ" },
  },
  {
    id: "infrastructure-engineer",
    title: "インフラエンジニアリングサービス",
    summary:
      "サーバー、ネットワーク、データベース、セキュリティなど、IT インフラ領域の設計・構築・整備・保守を支援します。",
    points: [
      "ネットワーク設計・構築",
      "サーバー設計・構築・運用・管理",
      "データベース設計・構築",
      "サーバー・ネットワークの運用・保守",
    ],
    image: { src: "/images/Service2.png", alt: "ネットワーク・インフラのイメージ" },
  },
  {
    id: "helpdesk",
    title: "ヘルプデスク・サポート",
    summary:
      "情報システム部門の社内 IT サポート、キッティング、各種デスク業務などのアウトソーシングをご提供します。",
    points: [
      "問い合わせ対応・社内 IT サポート",
      "リモート支援・キッティング",
      "サーバー・ネットワークの運用保守",
    ],
    image: { src: "/images/Service3.png", alt: "ヘルプデスク対応のイメージ" },
  },
];
