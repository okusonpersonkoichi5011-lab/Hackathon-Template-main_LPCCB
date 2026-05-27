import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "会社案内",
  description:
    "株式会社ライトパスの会社案内。会社概要、代表挨拶、事業内容、アクセス（東京都渋谷区道玄坂）をご紹介します。",
  alternates: { canonical: "/company" },
  openGraph: {
    title: "会社案内 | 株式会社ライトパス",
    description:
      "会社概要・代表挨拶・事業内容・アクセスをご紹介します。本社は東京都渋谷区道玄坂。",
    url: "/company",
  },
};

/**
 * 会社案内ページ
 * 会社概要・代表挨拶・事業内容は、株式会社ライトパス公式サイトの公開情報に基づきます。
 * https://light-path.co.jp/company/
 */
export default function CompanyPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        <SectionTitle
          eyebrow="Company"
          title="会社案内"
          description="会社概要、代表挨拶、事業内容をご紹介します。"
        />

        {/* 会社概要（公式サイトの表と同一項目） */}
        <Reveal>
        <section className="mt-14 rounded-xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">会社概要</h2>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">会社名</dt>
              <dd className="mt-1 font-medium text-slate-900">株式会社ライトパス</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">英文社名</dt>
              <dd className="mt-1 font-medium text-slate-900">Light Path Inc.</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">代表取締役</dt>
              <dd className="mt-1 font-medium text-slate-900">野坂 星司</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">資本金</dt>
              <dd className="mt-1 font-medium text-slate-900">4,000 万円</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">所在地</dt>
              <dd className="mt-1 font-medium text-slate-900">{siteConfig.contact.address}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">TEL</dt>
              <dd className="mt-1 font-medium text-slate-900">{siteConfig.contact.phone}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">従業員数</dt>
              <dd className="mt-1 font-medium text-slate-900">正社員 121 名（2026 年 1 月現在）</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">事業内容</dt>
              <dd className="mt-1 font-medium text-slate-900">
                システムエンジニアリングサービス、インフラエンジニアリングサービス、ヘルプデスク・サポートデスク
                アウトソーシング
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">許認可・資格</dt>
              <dd className="mt-1 font-medium text-slate-900">
                労働者派遣事業（許可番号：派13-317835）
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">営業時間</dt>
              <dd className="mt-1 font-medium text-slate-900">{siteConfig.contact.businessHours}</dd>
            </div>
          </dl>
        </section>
        </Reveal>

        {/* 企業メッセージ（公式の代表挨拶から要約した2カラム） */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal delay={100}>
            <div className="lp-hover-lift h-full rounded-xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900">私たちのスタンス</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                「Unleash your potential（潜在能力を解放する）」— 株式会社ライトパスは、個々人が自身のスキルや才能を最大限に活かし、成長し続けるための道しるべのような存在でありたいと考えています。
              </p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="lp-hover-lift h-full rounded-xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900">社会へのコミット</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                企業活動において「DX 推進」や「リスキリング」の必要性が高まる一方、IT エンジニア不足が深刻化しています。私たちは個々人の可能性に光を当て、一人でも多くの IT
                エンジニアを育成・輩出し、企業の DX を通じて社会に貢献してまいります。
              </p>
            </div>
          </Reveal>
        </section>

        {/* 代表挨拶（公式サイト掲載文の抜粋・構成はテンプレート用に整形） */}
        <Reveal>
        <section className="mt-12 rounded-xl border border-dashed border-border bg-muted/40 p-6 sm:p-10">
          <h2 className="text-lg font-semibold text-slate-900">代表挨拶</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-800">
            「Unleash your potential（潜在能力を解放する）」私達は誰もが皆、本人も気が付かない程の無限の可能性を持っています。株式会社ライトパスは、個々人が自身のスキルや才能を最大限に活かし、成長し続けるための道しるべの様な存在でありたいと願っています。
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-800">
            昨今の企業活動では、どの様な組織においても「DX 推進」や「リスキリング」の必要性が叫ばれております。一方で、IT
            エンジニア不足が深刻化しており、人材の確保・育成がますます重要となっております。
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-800">
            私達は、個々人の可能性に光をあて、1 人でも多くの IT エンジニアを育成・輩出し、企業の DX 化を通して世の中に貢献していきます。
          </p>
          <p className="mt-8 text-sm font-medium text-slate-900">
            株式会社ライトパス
            <br />
            代表取締役　野坂 星司
          </p>
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-slate-900">代表経歴（公式サイト掲載の要約）</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              世界トップシェアの顧客管理システムを提供する Salesforce 出身。大手企業を担当し、過去最高額の受注を記録したトップセールス。お客様現場でのエンジニア不足を痛感し、IT
              業界のエンジニア数向上に貢献するためライトパスを創業。プライベートでは 100 マイル（160km）のウルトラトレイルランを完走するなど、挑戦を続けています。
            </p>
          </div>
        </section>
        </Reveal>

        {/* 事業内容 */}
        <section className="mt-12">
          <Reveal>
            <h2 className="text-lg font-semibold text-slate-900">事業内容</h2>
          </Reveal>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <Reveal delay={100}>
              <div className="lp-hover-lift rounded-lg border border-border bg-surface p-4">
                <p className="font-semibold text-slate-900">システムエンジニアリングサービス</p>
                <p className="mt-2">
                  IT の各分野や開発言語に対応し、スキルと実務経験の豊富なエンジニアがお客様の課題解決を支援します。
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="lp-hover-lift rounded-lg border border-border bg-surface p-4">
                <p className="font-semibold text-slate-900">インフラエンジニアリングサービス</p>
                <p className="mt-2">
                  サーバー、ネットワーク、データベース、セキュリティなど、IT インフラの設計・構築・整備・保守を支援します。
                </p>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="lp-hover-lift rounded-lg border border-border bg-surface p-4">
                <p className="font-semibold text-slate-900">ヘルプデスク・サポートデスク アウトソーシング</p>
                <p className="mt-2">
                  情報システム部門の社内 IT サポート、キッティングなど、各種デスク業務のアウトソーシングを提供します。
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* アクセス（公式サイトのアクセスマップ項目に準拠） */}
        <section id="access" className="mt-12 scroll-mt-28">
          <Reveal>
            <h2 className="text-lg font-semibold text-slate-900">アクセス</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              各線の渋谷駅から徒歩 5〜10 分ほど。「道玄坂上交番前」交差点から道玄坂を少し上った左手のビルです。
            </p>
          </Reveal>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Reveal delay={100}>
              <div className="lp-hover-lift h-full rounded-xl border border-border bg-surface p-6">
                <h3 className="text-sm font-semibold text-slate-900">所在地</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {siteConfig.contact.address}
                </p>
                <h3 className="mt-6 text-sm font-semibold text-slate-900">営業時間</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {siteConfig.contact.businessHours}
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="lp-hover-lift h-full rounded-xl border border-border bg-surface p-6">
                <h3 className="text-sm font-semibold text-slate-900">電車でお越しの場合</h3>
                <ul className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
                  {siteConfig.access.train.map((line) => (
                    <li key={line}>・{line}</li>
                  ))}
                </ul>

                <h3 className="mt-6 text-sm font-semibold text-slate-900">お車でお越しの場合</h3>
                <ul className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
                  {siteConfig.access.car.map((line) => (
                    <li key={line}>・{line}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* 目印情報（公式サイトの「アクセス情報」本文より） */}
          <Reveal variant="scale" delay={300} className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 p-6">
            <h3 className="text-sm font-semibold text-slate-900">入口の目印</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.access.landmark}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              ※ ビル入口は「SHINANOYA（信濃屋）」さんの左脇です。入ってすぐエレベーターがありますので 8 階へお越しください。
            </p>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
