interface ResultDownloadProps {
  url: string | null;
  fileName: string;
  onClear?: () => void;
}

export default function ResultDownload({
  url,
  fileName,
  onClear
}: ResultDownloadProps) {
  if (!url) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-sea/20 bg-white/70 px-4 py-3">
      <p className="text-sm text-ink/70">Your file is ready.</p>
      <a
        href={url}
        download={fileName}
        className="button-primary"
      >
        Download {fileName}
      </a>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="button-outline"
        >
          Clear result
        </button>
      ) : null}
    </div>
  );
}
