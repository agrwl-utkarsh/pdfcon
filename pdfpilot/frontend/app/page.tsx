import ToolCard from "@/components/ToolCard";

const tools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into a single, polished file.",
    href: "/merge"
  },
  {
    title: "Split PDF",
    description: "Extract only the pages you need in seconds.",
    href: "/split"
  },
  {
    title: "Compress PDF",
    description: "Shrink PDFs without losing quality.",
    href: "/",
    comingSoon: true
  },
  {
    title: "Rotate PDF",
    description: "Fix page orientation in a click.",
    href: "/",
    comingSoon: true
  }
];

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="glass-panel rounded-3xl p-10 sm:p-14">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sea/80">
            PDFPilot Phase 1
          </p>
          <h1 className="font-display text-4xl leading-tight sm:text-6xl">
            PDF Tools Made Simple
          </h1>
          <p className="text-base text-ink/70 sm:text-lg">
            Upload, merge, and split PDFs with a clean interface built for speed.
            PDFPilot keeps everything lightweight so you can finish your document
            work in minutes, not hours.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-sea/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sea">
              No account required
            </span>
            <span className="rounded-full bg-coral/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-coral">
              Secure processing
            </span>
            <span className="rounded-full bg-ink/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink/60">
              Fast downloads
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl sm:text-3xl">Popular tools</h2>
          <p className="text-sm text-ink/60">More utilities launching soon.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
