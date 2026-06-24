/**
 * ========================================
 * 共通 UI 文言の翻訳辞書（日本語 / 英語）
 * ----------------------------------------
 * - ナビゲーション、ボタン、見出しなど "コンポーネントに直書きしていた文言" を
 *   ここに集約し、useTranslation() フックから呼び出せるようにしています。
 * - ページ固有の長文（インタビューの全文、代表挨拶、プライバシーポリシー等）は
 *   分量が多いため、各データファイル／ページに `Localized<string>` として持たせます。
 * ========================================
 */

import type { Lang } from "./types";

export const translations = {
  /* ==================== ヘッダー / 共通ナビ ==================== */
  nav: {
    home: { ja: "ホーム", en: "Home" },
    company: { ja: "会社案内", en: "Company" },
    recruit: { ja: "採用情報", en: "Careers" },
    contact: { ja: "お問い合わせ", en: "Contact" },
  },
  header: {
    siteNameAria: { ja: "メインナビゲーション", en: "Main navigation" },
    openMenu: { ja: "メニューを開く", en: "Open menu" },
    closeMenu: { ja: "メニューを閉じる", en: "Close menu" },
    menuTitle: { ja: "メニュー", en: "Menu" },
    mobileNavAria: { ja: "モバイルナビゲーション", en: "Mobile navigation" },
    switchToJa: { ja: "日本語に切り替え", en: "Switch to Japanese" },
    switchToEn: { ja: "英語に切り替え", en: "Switch to English" },
  },
  footer: {
    navAria: { ja: "フッターナビゲーション", en: "Footer navigation" },
    instagramAria: {
      ja: "Instagram（外部サイトが開きます）",
      en: "Instagram (opens in a new window)",
    },
    privacy: { ja: "プライバシーポリシー", en: "Privacy Policy" },
    telLabel: { ja: "TEL", en: "Phone" },
  },

  /* ==================== トップページ ==================== */
  home: {
    heroTitle: {
      ja: "専門スキルを持ったエンジニアが、お客様の課題解決を支援します。",
      en: "Specialist engineers, ready to solve your business challenges.",
    },
    heroBody: {
      ja: "システムエンジニア、インフラエンジニア、ヘルプデスクサポートなどのアウトソーシングサービスをご提供しています。第一線で活躍してきたスペシャリストが、未経験からのキャリア形成も含めて伴走します。",
      en: "We offer outsourcing services across system engineering, infrastructure engineering and help-desk support. Our seasoned specialists work alongside you, and we also help shape careers for people brand new to the industry.",
    },
    whyUsEyebrow: { ja: "Why us", en: "Why us" },
    whyUsTitle: { ja: "ライトパスの特徴", en: "What sets Light Path apart" },
    whyUsDesc: {
      ja: "第一線で活躍してきたスペシャリストが、専門性の高いサービスでお客様の IT 課題に伴走します。",
      en: "Our seasoned specialists tackle your IT challenges with deeply specialised services.",
    },
    ctaEyebrow: { ja: "Recruit & Contact", en: "Recruit & Contact" },
    ctaTitle: { ja: "採用情報・お問い合わせ", en: "Careers & Inquiries" },
    ctaDesc: {
      ja: "会社を一緒に盛り上げてくれる仲間を募集しています。サービスや協業のご相談もお気軽にどうぞ。",
      en: "We're hiring people to build the company with us. Feel free to reach out about our services or partnerships, too.",
    },
    ctaRecruit: { ja: "採用情報を見る", en: "View Careers" },
    ctaContact: { ja: "お問い合わせ", en: "Contact Us" },
    ctaCompany: { ja: "会社案内", en: "About Us" },
    bandAria: { ja: "社内・現場の様子", en: "Inside Light Path" },
    bandAlt: {
      meeting: { ja: "打ち合わせの様子", en: "Team meeting" },
      moving: { ja: "社員が移動する様子", en: "Staff on the move" },
      working: { ja: "作業に取り組む様子", en: "Engineer at work" },
    },
  },

  /* ==================== 会社案内 ==================== */
  company: {
    pageAlt: { ja: "会社案内", en: "Company" },
    groupPhotoAlt: {
      ja: "株式会社ライトパスの集合写真",
      en: "Group photo of Light Path team",
    },
    profileEyebrow: { ja: "Profile", en: "Profile" },
    profileTitle: { ja: "会社概要", en: "Company Profile" },
    profileRows: {
      companyName: { ja: "会社名", en: "Company Name" },
      companyNameEn: { ja: "英文社名", en: "English Name" },
      ceo: { ja: "代表取締役", en: "CEO" },
      ceoName: { ja: "野坂 星司", en: "Seiji Nosaka" },
      capital: { ja: "資本金", en: "Capital" },
      capitalValue: { ja: "4,000 万円", en: "40 million JPY" },
      employees: { ja: "従業員数", en: "Employees" },
      employeesValue: {
        ja: "正社員 121 名（2026 年 1 月現在）",
        en: "121 full-time employees (as of January 2026)",
      },
      business: { ja: "事業内容", en: "Business" },
      businessValue: {
        ja: "システムエンジニアリングサービス、インフラエンジニアリングサービス、ヘルプデスク・サポートデスク アウトソーシング",
        en: "System engineering, infrastructure engineering, and help-desk / support-desk outsourcing services",
      },
      license: { ja: "許認可・資格", en: "License" },
      licenseValue: {
        ja: "労働者派遣事業（許可番号：派13-317835）",
        en: "Worker Dispatch Business (License No. Ha 13-317835)",
      },
      address: { ja: "所在地", en: "Address" },
      tel: { ja: "TEL", en: "Phone" },
      hours: { ja: "営業時間", en: "Business Hours" },
    },
    messageEyebrow: { ja: "Message", en: "Message" },
    messageTitle: { ja: "代表挨拶", en: "Message from the CEO" },
    messageCeoAlt: {
      ja: "代表取締役 野坂 星司",
      en: "CEO Seiji Nosaka",
    },
    messageP1: {
      ja: "「Unleash your potential（潜在能力を解放する）」私達は誰もが皆、本人も気が付かない程の無限の可能性を持っています。株式会社ライトパスは、個々人が自身のスキルや才能を最大限に活かし、成長し続けるための道しるべの様な存在でありたいと願っています。",
      en: "\"Unleash your potential.\" Every one of us holds limitless possibilities, often more than we realize ourselves. At Light Path, we aim to be a guiding light that helps each person bring out their skills and talents to the fullest and keep on growing.",
    },
    messageP2: {
      ja: "昨今の企業活動では、どの様な組織においても「DX 推進」や「リスキリング」の必要性が叫ばれております。一方で、IT エンジニア不足が深刻化しており、人材の確保・育成がますます重要となっております。私達は、個々人の可能性に光をあて、1 人でも多くの IT エンジニアを育成・輩出し、企業の DX 化を通して世の中に貢献していきます。",
      en: "Across every kind of organization, \"DX (digital transformation) initiatives\" and \"reskilling\" have become essential. At the same time, the shortage of IT engineers is growing more serious, making hiring and training ever more important. By shining a light on each person's potential, we train and send out as many IT engineers as we can, and contribute to society by powering the digital transformation of the companies we serve.",
    },
    messageSignature: {
      ja: "株式会社ライトパス　代表取締役　野坂 星司",
      en: "Seiji Nosaka, CEO, Light Path Inc.",
    },
    serviceEyebrow: { ja: "Service", en: "Service" },
    serviceTitle: { ja: "サービス案内", en: "Our Services" },
    serviceDesc: {
      ja: "システム／インフラ／ヘルプデスクの各領域で、お客様の IT 課題に対応します。",
      en: "We address your IT challenges across system, infrastructure and help-desk areas.",
    },
    trackEyebrow: { ja: "Track record", en: "Track Record" },
    trackTitle: { ja: "案件実績一覧", en: "Project Track Record" },
    trackDesc: {
      ja: "これまでにご支援した主な取引先です。",
      en: "A selection of clients we have supported to date.",
    },
    trackBody: {
      ja: "楽天グループ株式会社　他",
      en: "Rakuten Group, Inc., and others",
    },
    accessEyebrow: { ja: "Access", en: "Access" },
    accessTitle: { ja: "アクセスマップ", en: "Access Map" },
    accessDesc: {
      ja: "各線の渋谷駅から徒歩 5〜10 分ほど。「道玄坂上交番前」交差点から道玄坂を少し上った、左手の建物にあります。",
      en: "About 5 to 10 minutes on foot from Shibuya Station. From the Dogenzaka-ue Koban-mae intersection, walk a little way up Dogenzaka and look for the building on your left.",
    },
    accessMapTitle: {
      ja: "株式会社ライトパス 所在地の地図",
      en: "Map of Light Path Inc.'s location",
    },
    accessAddrTitle: { ja: "所在地・営業時間", en: "Address & Business Hours" },
    accessTrainTitle: {
      ja: "電車・お車でお越しの場合",
      en: "By train or car",
    },
    landmarkEyebrow: { ja: "Landmark", en: "Landmark" },
    landmarkTitle: { ja: "アクセス情報", en: "Landmark" },
    landmarkPhotoAlt: {
      ja: "ビル1階の信濃屋（SHINANOYA）の外観",
      en: "Storefront of SHINANOYA on the building's first floor",
    },
    landmarkNote: {
      ja: "※ ビル入口は「SHINANOYA（信濃屋）」さんの左脇です。入ってすぐエレベーターがありますので 8 階へお越しください。",
      en: "* The building entrance is just to the left of SHINANOYA. The elevator is right inside, please come up to the 8th floor.",
    },
  },

  /* ==================== 採用情報 ==================== */
  recruit: {
    pageAlt: { ja: "採用情報", en: "Careers" },
    leadHeading: {
      ja: "エンジニア候補募集",
      en: "We're hiring future engineers",
    },
    leadParas: {
      p1: {
        ja: "株式会社ライトパスでは、一緒に会社を盛り上げてくれる仲間をまだまだ募集しています。",
        en: "Light Path Inc. is still actively looking for people to help build the company alongside us.",
      },
      p2: {
        ja: "IT エンジニアの業界は、今後数十年でさらなる人材不足が予想されており、まだまだ多くの活躍のチャンスが見込める状態です。",
        en: "The IT engineering industry is expected to face an even larger talent shortage in the coming decades, which means plenty of opportunities to make an impact.",
      },
      p3: {
        ja: "IT 業界未経験からのスタートでも多くの方に活躍していただける様に、研修や環境を準備してお待ちしています。さらに、経験豊富なスタッフが 1 からサポートさせていただきますので、あなたの理想のキャリアを一緒に相談しながら作っていく事が可能です。",
        en: "We have training programs and an environment ready for people starting with no industry experience. Our experienced staff support you from day one, so we can shape your ideal career together.",
      },
      p4: {
        ja: "ベンチャーならではのカジュアルな雰囲気で、和やかな面談を随時行っております。これからの会社を共に創ってくださる皆さまからのお問い合わせをお待ちしております。",
        en: "We hold relaxed, friendly interviews on a rolling basis, the kind only a startup atmosphere allows. We'd love to hear from anyone who wants to help shape this company with us.",
      },
    },
    openingsEyebrow: { ja: "Openings", en: "Openings" },
    openingsTitle: { ja: "募集職種", en: "Open Positions" },
    idealEyebrow: { ja: "Ideal candidate", en: "Ideal candidate" },
    idealTitle: {
      ja: "こんな人が集まっています！",
      en: "The kind of people who join us",
    },
    flowEyebrow: { ja: "Flow", en: "Flow" },
    flowTitle: { ja: "応募の流れ", en: "Application Flow" },
    interviewsEyebrow: { ja: "Voice", en: "Voice" },
    interviewsTitle: {
      ja: "社員インタビューはこちら",
      en: "Employee Interviews",
    },
    interviewsToggleOpen: { ja: "詳細を見る", en: "Read more" },
    interviewsToggleClose: { ja: "閉じる", en: "Close" },
    entryEyebrow: { ja: "Entry", en: "Entry" },
    entryTitle: { ja: "エントリーフォーム", en: "Application Form" },
  },

  /* ==================== お問い合わせ ==================== */
  contact: {
    pageAlt: { ja: "お問い合わせ", en: "Contact" },
    eyebrow: { ja: "Contact", en: "Contact" },
    title: { ja: "お問い合わせ", en: "Contact Us" },
    intro: {
      ja: "サービスや協業のご相談、その他のご質問は下記フォームよりお問い合わせください。",
      en: "For inquiries about our services, partnerships or anything else, please use the form below.",
    },
  },

  /* ==================== プライバシーポリシー ==================== */
  privacy: {
    pageAlt: { ja: "プライバシーポリシー", en: "Privacy Policy" },
    eyebrow: { ja: "Privacy", en: "Privacy" },
    title: { ja: "プライバシーポリシー", en: "Privacy Policy" },
  },

  /* ==================== フォーム共通 ==================== */
  form: {
    required: { ja: "必須", en: "Required" },
    optional: { ja: "任意", en: "Optional" },
    name: { ja: "お名前", en: "Name" },
    email: { ja: "メールアドレス", en: "Email" },
    phone: { ja: "電話番号", en: "Phone" },
    subject: { ja: "件名", en: "Subject" },
    message: { ja: "お問い合わせ内容", en: "Message" },
    submit: { ja: "送信する", en: "Submit" },
    confirm: { ja: "入力内容を確認する", en: "Review Entries" },
    back: { ja: "入力に戻る", en: "Back to Form" },
    sending: { ja: "送信中…", en: "Sending…" },
    successTitle: { ja: "送信が完了しました", en: "Submission complete" },
    successBody: {
      ja: "お問い合わせありがとうございました。担当者よりご連絡いたします。",
      en: "Thank you for reaching out. Our team will be in touch shortly.",
    },
    privacyNotice: {
      ja: "送信前にプライバシーポリシーをご確認ください。",
      en: "Please review our Privacy Policy before submitting.",
    },
  },

  /* ==================== 共通ボタン ==================== */
  common: {
    readMore: { ja: "詳しく見る", en: "Read more" },
    backToHome: { ja: "ホームに戻る", en: "Back to home" },
  },
} as const;

/**
 * 翻訳辞書のキー型（型安全に t() を呼ぶための補助）
 * 例：t("nav.home")、t("home.heroTitle") など
 */
export type TranslationKey =
  | `${keyof typeof translations}.${string}`;

/**
 * ドット記法で辞書を引き、現在の言語の文字列を返す。
 * 例：getText("home.heroTitle", "en")
 */
export function getText(path: string, lang: Lang): string {
  const parts = path.split(".");
  let cur: unknown = translations;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      // 辞書ミス時はキーをそのまま返す（開発時に発見しやすくするため）
      return path;
    }
  }
  if (cur && typeof cur === "object" && "ja" in cur && "en" in cur) {
    return (cur as { ja: string; en: string })[lang];
  }
  return path;
}
