export default function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-ink/70">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/20 border-t-sea" />
      <span>{label ?? "Processing..."}</span>
    </div>
  );
}
