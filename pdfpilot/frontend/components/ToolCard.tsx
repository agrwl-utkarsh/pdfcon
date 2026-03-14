import Link from "next/link";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  comingSoon?: boolean;
}

export default function ToolCard({
  title,
  description,
  href,
  comingSoon
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-glow ${
        comingSoon ? "pointer-events-none opacity-70" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">{title}</h3>
        {comingSoon ? (
          <span className="rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink/60">
            Coming soon
          </span>
        ) : (
          <span className="rounded-full bg-sea/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sea">
            Open tool
          </span>
        )}
      </div>
      <p className="text-sm text-ink/70">{description}</p>
      <div className="mt-auto flex items-center justify-between text-sm font-semibold text-ink/60">
        <span>PDFPilot utility</span>
        <span className="transition group-hover:text-ink">→</span>
      </div>
    </Link>
  );
}
