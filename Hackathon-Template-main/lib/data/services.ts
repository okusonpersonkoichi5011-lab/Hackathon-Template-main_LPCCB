/**
 * サービスカードのデータ（日英対応）
 * 各テキストフィールドは Localized<string>。表示時に pick() で言語別を取り出します。
 * 画像 alt も言語切替に追従するよう Localized<string> にしています。
 */

import type { Localized } from "@/lib/i18n/types";

export type ServiceItem = {
  id: string;
  title: Localized<string>;
  summary: Localized<string>;
  points: Localized<string[]>;
  image: { src: string; alt: Localized<string> };
};

export const services: ServiceItem[] = [
  {
    id: "system-engineer",
    title: {
      ja: "システムエンジニアリングサービス",
      en: "System Engineering Services",
    },
    summary: {
      ja: "IT の各分野や開発言語などに対応し、スキルと実務経験の豊富なエンジニアがお客様の課題解決を支援します。",
      en: "Engineers with strong skills and hands-on experience across IT fields and programming languages help solve your business challenges.",
    },
    points: {
      ja: [
        "システム企画・開発",
        "アプリケーション開発・支援",
        "システムテスト",
        "その他企画・保守",
      ],
      en: [
        "System planning and development",
        "Application development and support",
        "System testing",
        "Other planning and maintenance",
      ],
    },
    image: {
      src: "/images/Service1.png",
      alt: {
        ja: "システム開発のイメージ",
        en: "Illustration of system development",
      },
    },
  },
  {
    id: "infrastructure-engineer",
    title: {
      ja: "インフラエンジニアリングサービス",
      en: "Infrastructure Engineering Services",
    },
    summary: {
      ja: "サーバー、ネットワーク、データベース、セキュリティなど、IT インフラ領域の設計・構築・整備・保守を支援します。",
      en: "We support every stage of IT infrastructure, including servers, networks, databases and security, from design and build through deployment and ongoing maintenance.",
    },
    points: {
      ja: [
        "ネットワーク設計・構築",
        "サーバー設計・構築・運用・管理",
        "データベース設計・構築",
        "サーバー・ネットワークの運用・保守",
      ],
      en: [
        "Network design and build",
        "Server design, build, operation and administration",
        "Database design and build",
        "Server and network operations and maintenance",
      ],
    },
    image: {
      src: "/images/Service2.png",
      alt: {
        ja: "ネットワーク・インフラのイメージ",
        en: "Illustration of network infrastructure",
      },
    },
  },
  {
    id: "helpdesk",
    title: {
      ja: "ヘルプデスク・サポート",
      en: "Help Desk Support",
    },
    summary: {
      ja: "情報システム部門の社内 IT サポート、キッティング、各種デスク業務などのアウトソーシングをご提供します。",
      en: "We provide outsourcing for in-house IT support, device kitting and a range of desk-side support services for IT departments.",
    },
    points: {
      ja: [
        "問い合わせ対応・社内 IT サポート",
        "リモート支援・キッティング",
        "サーバー・ネットワークの運用保守",
      ],
      en: [
        "Inquiry handling and in-house IT support",
        "Remote support and device kitting",
        "Server and network operations and maintenance",
      ],
    },
    image: {
      src: "/images/Service3.png",
      alt: {
        ja: "ヘルプデスク対応のイメージ",
        en: "Illustration of help-desk support",
      },
    },
  },
];
