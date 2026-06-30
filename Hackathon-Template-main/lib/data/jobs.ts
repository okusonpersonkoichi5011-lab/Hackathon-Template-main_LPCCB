/**
 * 【採用・募集内容を変えたいときはここ】
 * 公式サイトの採用ページ（https://light-path.co.jp/recruit/）に沿って整理しています。
 * 各テキストは Localized<string>（日本語＋英語）として持ち、useLanguage().pick() で表示します。
 */

import type { Localized } from "@/lib/i18n/types";

export type JobItem = {
  title: Localized<string>;
  employmentType: Localized<string>;
  description: Localized<string>;
  /** 職種カードのアイコン画像 */
  icon: string;
};

export const jobOpenings: JobItem[] = [
  {
    title: {
      ja: "システムエンジニア",
      en: "System Engineer",
    },
    employmentType: {
      ja: "正社員（未経験・経験者ともに歓迎）",
      en: "Full-time (open to both newcomers and experienced engineers)",
    },
    description: {
      ja: "開発言語や工程に応じて、お客様先での開発支援に携わります。研修や資格取得のサポート体制を整え、キャリア形成を後押しします。",
      en: "Support client development projects across various languages and project phases. We back your career growth with training and certification support.",
    },
    icon: "/images/Recruit1.png",
  },
  {
    title: {
      ja: "インフラエンジニア",
      en: "Infrastructure Engineer",
    },
    employmentType: { ja: "正社員", en: "Full-time" },
    description: {
      ja: "サーバー／ネットワーク／DB／セキュリティなど、インフラ領域の設計・構築・運用に関わります。現場で必要なスキルを段階的に身につけることができます。",
      en: "Design, build and operate IT infrastructure, including servers, networks, databases and security. You can pick up the skills you need on the job, step by step.",
    },
    icon: "/images/Recruit2.png",
  },
  {
    title: {
      ja: "ヘルプデスク・IT サポート",
      en: "Help Desk / IT Support",
    },
    employmentType: { ja: "正社員", en: "Full-time" },
    description: {
      ja: "社内 IT 問い合わせ対応やキッティングなどを担当します。コミュニケーション力を活かしつつ、IT の基礎から実務スキルまで幅広く成長できます。",
      en: "You'll handle internal IT inquiries and device kitting. Put your communication skills to work while growing across IT, from fundamentals to applied skills.",
    },
    icon: "/images/Recruit3.png",
  },
];

/** 「こんな人が集まっています！」リスト */
export const idealCandidates: Localized<string[]> = {
  ja: [
    "切磋琢磨が出来る同世代の仲間と共に働きたい方",
    "夢や目標に向かってポジティブに仕事を進められる方",
    "今まで頑張ってきた分野からキャリアチェンジして頑張りたい方",
    "スキル、資格、収入を得る事に貪欲にチャレンジしたい方",
    "IT 業界でエンジニアとしてスキルアップしたい方",
    "IT 業界は未経験だけど、これから一人前を目指したい方",
    "安定した働き方を求めている方",
  ],
  en: [
    "People who want to work alongside peers their own age who push each other to grow",
    "People who approach their work positively, with clear dreams and goals",
    "People who want to switch careers from a field they've worked hard in until now",
    "People eager to keep chasing growth in their skills, qualifications and income",
    "People who want to upskill as an engineer in the IT industry",
    "People new to IT who want to grow into well-rounded engineers from here",
    "People looking for a stable way of working",
  ],
};

/** 応募から就業開始までの 5 ステップ */
export type ApplicationStep = {
  step: number;
  title: Localized<string>;
  description: Localized<string>;
};

export const applicationFlow: ApplicationStep[] = [
  {
    step: 1,
    title: {
      ja: "応募フォームからご連絡",
      en: "Apply via the application form",
    },
    description: {
      ja: "本サイトや求人媒体の記載内容をご確認の上、応募フォームに必要事項をご記入の上ご連絡ください。",
      en: "Please review the details on this site or the job listing, then fill out the required fields in the application form.",
    },
  },
  {
    step: 2,
    title: { ja: "書類選考", en: "Document screening" },
    description: {
      ja: "応募内容を確認させていただきます。選考通過の方には、2 営業日以内にメールまたは電話にて面接日の調整をさせていただきます。",
      en: "We'll review your application. If you move forward, you'll hear from us by email or phone within 2 business days to schedule an interview.",
    },
  },
  {
    step: 3,
    title: { ja: "面接", en: "Interview" },
    description: {
      ja: "対面もしくはオンラインで面接を実施します。",
      en: "We hold the interview either in person or online.",
    },
  },
  {
    step: 4,
    title: { ja: "研修", en: "Training" },
    description: {
      ja: "未経験からでも安心して就業できるように、基本から丁寧にお伝えします。",
      en: "We walk you through the fundamentals carefully, so you can get started with confidence even with no prior experience.",
    },
  },
  {
    step: 5,
    title: { ja: "就業開始", en: "Your first day" },
    description: {
      ja: "ここからエンジニアキャリアのスタートです。配属後もスタッフが継続してサポートします。",
      en: "This is the start of your engineering career. Our staff keep supporting you after placement, too.",
    },
  },
];

/** 採用ページ冒頭のリード文 */
export const recruitLead = {
  heading: {
    ja: "エンジニア候補募集",
    en: "We're hiring future engineers",
  } satisfies Localized<string>,
  paragraphs: {
    ja: [
      "株式会社ライトパスでは、一緒に会社を盛り上げてくれる仲間をまだまだ募集しています。",
      "IT エンジニアの業界は、今後数十年でさらなる人材不足が予想されており、まだまだ多くの活躍のチャンスが見込める状態です。",
      "IT 業界未経験からのスタートでも多くの方に活躍していただける様に、研修や環境を準備してお待ちしています。さらに、経験豊富なスタッフが 1 からサポートさせていただきますので、あなたの理想のキャリアを一緒に相談しながら作っていく事が可能です。",
      "ベンチャーならではのカジュアルな雰囲気で、和やかな面談を随時行っております。これからの会社を共に創ってくださる皆さまからのお問い合わせをお待ちしております。",
    ],
    en: [
      "Light Path Inc. is still actively looking for people to help build the company alongside us.",
      "The IT engineering industry is expected to face an even bigger talent shortage over the coming decades, which means plenty of opportunities to make an impact.",
      "We've put together training programs and an environment ready for people starting with no industry experience. Our experienced staff support you from day one, so we can shape your ideal career together.",
      "We hold relaxed, friendly interviews on a rolling basis, the kind of casual atmosphere only a startup can offer. We'd love to hear from anyone who wants to help shape this company with us.",
    ],
  } satisfies Localized<string[]>,
};

/**
 * 社員インタビュー（採用ページの「社員インタビューはこちら」で表示）
 *
 * 配列の順番＝画面上の表示順（A, O, Y, K を 2列で 左上から右下 に配置）。
 */
export type EmployeeInterview = {
  initial: Localized<string>;
  role: Localized<string>;
  question: Localized<string>;
  answer: Localized<string[]>;
};

export const employeeInterviews: EmployeeInterview[] = [
  {
    initial: { ja: "Aさん", en: "A" },
    role: {
      ja: "前職：コンセプトカフェ・地下アイドル",
      en: "Previously: concept cafe staff and underground idol",
    },
    question: {
      ja: "未経験から実際に業務に携わった感想は？",
      en: "What was it like jumping into the work with no experience?",
    },
    answer: {
      ja: [
        "未経験から IT 業界に飛び込んだので不安もありましたが、実際に働いてみると「自分にもできること」がたくさんあり、毎日新たなことに挑戦して日々成長を感じています！",
      ],
      en: [
        "I jumped into IT with no background in it, so I was a little anxious. Once I actually started, though, I found plenty of things I could do, and every day I take on something new and feel myself growing.",
      ],
    },
  },
  {
    initial: { ja: "Oさん", en: "O" },
    role: {
      ja: "前職：セキュリティエンジニア",
      en: "Previously: security engineer",
    },
    question: {
      ja: "ライトパスの今後についてどう感じますか？",
      en: "How do you feel about Light Path's future?",
    },
    answer: {
      ja: [
        "ベンチャー企業ならではの成長意欲と勢いがあり、「これからもっと大きくなっていく」という熱量を感じています。特に経営陣のやる気や行動力には日々刺激を受けています。",
      ],
      en: [
        "There's the kind of growth drive and momentum you only find at a startup, and a real sense that we're going to get much bigger from here. The energy and decisiveness of the leadership team especially inspire me every day.",
      ],
    },
  },
  {
    initial: { ja: "Yさん", en: "Y" },
    role: {
      ja: "前職：ホテルのマーケティングセールス・フロント業務",
      en: "Previously: hotel sales/marketing and front desk",
    },
    question: {
      ja: "入社前と入社後の印象に違いはありましたか？",
      en: "Did your impression of the company change after joining?",
    },
    answer: {
      ja: [
        "入社前は「IT 企業×ベンチャー」と聞いて少し堅いイメージを持っていましたが、実際はフレンドリーな方が多く、困ったときには親身になって相談に乗ってくれる温かい職場でした。",
      ],
      en: [
        "Hearing \"IT startup\" before I joined, I pictured something a bit stiff. In reality the people are friendly, and when something comes up they really listen, it's a warm workplace.",
      ],
    },
  },
  {
    initial: { ja: "Kさん", en: "K" },
    role: { ja: "前職：自動車関連", en: "Previously: automotive industry" },
    question: {
      ja: "入社後スムーズに業務に馴染めましたか？",
      en: "Did you settle into the work smoothly after joining?",
    },
    answer: {
      ja: [
        "配属先での業務にも、想像していたよりスムーズに入ることができました。参画前の面談や、配属後も担当者が定期的に様子を確認してフォローしてくれるので、困ったときにすぐ相談できる安心感があります。そのおかげで、落ち着いて業務に取り組めています。",
      ],
      en: [
        "I settled into the work at my placement more smoothly than I'd expected. With interviews before I joined the project and regular check-ins from my staff contact afterwards, I always have someone to turn to when I run into something. That peace of mind lets me focus calmly on the work.",
      ],
    },
  },
];
