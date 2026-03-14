import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-white/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sea text-lg font-semibold text-white">
            P
          </div>
          <div>
            <p className="font-display text-xl">PDFPilot</p>
            <p className="text-xs text-ink/60">Lightweight PDF tools</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-ink/70 sm:flex">
          <Link href="/merge" className="transition hover:text-ink">
            Merge
          </Link>
          <Link href="/split" className="transition hover:text-ink">
            Split
          </Link>
          <Link href="/" className="transition hover:text-ink">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/merge" className="button-outline">
            Try merge
          </Link>
          <Link href="/split" className="button-primary">
            Split now
          </Link>
        </div>
      </div>
    </header>
  );
}
