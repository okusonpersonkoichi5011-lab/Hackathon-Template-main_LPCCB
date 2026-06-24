/**
 * ========================================
 * サイト全体の「文言・ナビ・フッター」まとめ
 * ----------------------------------------
 * 公開情報は株式会社ライトパス公式サイトに基づいています。
 * https://light-path.co.jp/company/
 *
 * 言語別の文言は lib/i18n/translations.ts と
 * 本ファイルの contactEn / accessEn などのフィールドで管理しています。
 * ========================================
 */

export const siteConfig = {
  /**
   * 公開先の本番 URL（末尾スラッシュなし）。
   * sitemap.xml / robots.txt / OGP / canonical（正規 URL）すべてに自動反映されます。
   */
  siteUrl: "https://example.com",

  /** ブラウザのタブや SEO に使われるサイト名（日本語） */
  siteName: "株式会社ライトパス",

  /** 英文表記（ヘッダー補助 / 英語表示時のサイト名） */
  siteNameEn: "Light Path Inc." as const,

  /** メタデータ用の短い説明 */
  shortDescription:
    "東京都渋谷区道玄坂に本社を置くシステムエンジニアサービス企業。システム／インフラ／ヘルプデスクのアウトソーシングを提供しています。",

  /** 英語版の短い説明（英語ページ用） */
  shortDescriptionEn:
    "Light Path Inc. is a system engineering services company headquartered in Dogenzaka, Shibuya, Tokyo. We provide outsourcing for systems, infrastructure and help-desk teams.",

  /**
   * ナビ（参照のみ／実際のラベルは i18n の "nav.*" を使用）
   * URL の構造を変えるときはここを編集してください。
   */
  nav: [
    { href: "/", labelKey: "nav.home" },
    { href: "/company", labelKey: "nav.company" },
    { href: "/recruit", labelKey: "nav.recruit" },
    { href: "/contact", labelKey: "nav.contact" },
  ],

  /** フッター下部のコピーライト横に表示する年 */
  footerYear: 2026,

  /** 連絡先（日本語） */
  contact: {
    phone: "03-6277-5897",
    phoneTel: "tel:0362775897",
    address: "〒150-0043 東京都渋谷区道玄坂1-19-11 寿道玄坂ビル8F",
    businessHours: "平日10:00～18:00（定休日：土・日・祝日）",
  },

  /** 連絡先（英語） */
  contactEn: {
    address:
      "8F Kotobuki Dogenzaka Bldg, 1-19-11 Dogenzaka, Shibuya-ku, Tokyo 150-0043, Japan",
    businessHours: "Weekdays 10:00 to 18:00 (closed Sat, Sun and national holidays)",
  },

  /** 公式サイト・SNS など外部リンク */
  externalLinks: {
    officialSite: "https://light-path.co.jp/",
    instagram: "https://www.instagram.com/lightpath.official/",
  },

  /** アクセス情報（日本語） */
  access: {
    train: [
      "JR・私鉄各線　渋谷駅から徒歩 5〜10 分程",
      "京王井の頭線　神泉駅から徒歩 5 分程",
    ],
    car: [
      "首都高速 3 号渋谷線（上下線）渋谷出入口（渋谷料金所）付近",
      "道玄坂上・南平台交差点よりすぐ",
    ],
    landmark:
      "「道玄坂上交番前」交差点から道玄坂を少し上った左手の「寿道玄坂ビル」。1 階に赤い酒屋「SHINANOYA（信濃屋）」が入っているビルです。",
  },

  /** アクセス情報（英語） */
  accessEn: {
    train: [
      "About a 5 to 10 minute walk from Shibuya Station (JR and private railway lines)",
      "About 5 minutes on foot from Shinsen Station (Keio Inokashira Line)",
    ],
    car: [
      "Near the Shibuya exit / toll gate on Metropolitan Expressway Route 3 (Shibuya Line, both directions)",
      "A short walk from the Dogenzaka-ue / Nampeidai intersection",
    ],
    landmark:
      "From the Dogenzaka-ue Koban-mae intersection, walk a little way up Dogenzaka. The Kotobuki Dogenzaka Building is on your left, the same building that houses the red-fronted SHINANOYA liquor shop on the first floor.",
  },
} as const;
