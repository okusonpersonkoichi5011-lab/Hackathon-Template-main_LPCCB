/**
 * ========================================
 * サイト全体の「文言・ナビ・フッター」まとめ
 * ----------------------------------------
 * 公開情報は株式会社ライトパス公式サイトに基づいています。
 * https://light-path.co.jp/company/
 * ========================================
 */

export const siteConfig = {
  /**
   * 公開先の本番 URL（末尾スラッシュなし）。
   * ★重要：公開ドメインが決まったら "ここだけ" 書き換えてください。
   *   sitemap.xml / robots.txt / OGP / canonical（正規 URL）すべてに自動反映されます。
   *   例：独自ドメイン "https://light-path.example.jp"
   *       Vercel 無料 URL  "https://your-project.vercel.app"
   */
  siteUrl: "https://example.com",

  /** ブラウザのタブや SEO に使われるサイト名（layout.tsx から参照） */
  siteName: "株式会社ライトパス",

  /** 英文表記（ヘッダー補助など） */
  siteNameEn: "Light Path Inc." as const,

  /** メタデータ用の短い説明（layout.tsx の description） */
  shortDescription:
    "東京都渋谷区道玄坂に本社を置くシステムエンジニアサービス企業。システム／インフラ／ヘルプデスクのアウトソーシングを提供しています。",

  /**
   * ヘッダー・フッターのナビゲーション（公式サイトのラベルに準拠）
   * - 採用情報（/recruit）とお問い合わせ（/contact）はそれぞれ専用ページに分離しています。
   */
  nav: [
    { href: "/", label: "ホーム" },
    { href: "/service", label: "サービス案内" },
    { href: "/company", label: "会社案内" },
    { href: "/recruit", label: "採用情報" },
    { href: "/contact", label: "お問い合わせ" },
  ],

  /** フッター下部のコピーライト横に表示する年 */
  footerYear: 2026,

  /** お問い合わせページなどに載せる連絡先（公式サイト記載と同一） */
  contact: {
    phone: "03-6277-5897",
    /** tel: リンク用（ハイフンなし） */
    phoneTel: "tel:0362775897",
    address: "〒150-0043 東京都渋谷区道玄坂1-19-11 寿道玄坂ビル8F",
    businessHours: "平日10:00～18:00（定休日：土・日・祝日）",
  },

  /** 公式サイト・SNS など外部リンク（フッター等で利用） */
  externalLinks: {
    officialSite: "https://light-path.co.jp/",
    instagram: "https://www.instagram.com/lightpath.official/",
  },

  /**
   * 会社案内のアクセス情報（公式サイトの「アクセスマップ」項目に準拠）
   * 各 .lines は箇条書き表示用に分割しています。
   */
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
} as const;
