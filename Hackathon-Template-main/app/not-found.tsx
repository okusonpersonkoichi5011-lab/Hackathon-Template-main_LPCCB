import Link from "next/link";

/**
 * 存在しない URL へアクセスしたときの表示
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-base font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">ページが見つかりません</h1>
      <p className="mt-3 text-base text-muted-foreground">URL をご確認いただくか、トップへお戻りください。</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:opacity-90"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
