import Link from "next/link";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, children }: Props) {
  return (
    <article className="kawaii-card mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-center text-2xl font-bold text-pink-700">{title}</h1>
      <div className="space-y-4 text-sm leading-relaxed text-pink-900/80">{children}</div>
      <p className="border-t border-pink-100 pt-4 text-center">
        <Link href="/" className="text-sm font-semibold text-pink-500 hover:text-pink-700">
          ← חזרה לעמוד הבית
        </Link>
      </p>
    </article>
  );
}
