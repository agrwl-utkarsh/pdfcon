interface FileItem {
  id: string;
  file: File;
}

interface FileListProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
}

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function FileList({
  files,
  onRemove,
  onMoveUp,
  onMoveDown
}: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white/70 p-6 text-sm text-ink/60">
        Upload PDFs to start building your list.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white/80 px-4 py-3"
        >
          <div>
            <p className="text-sm font-semibold text-ink">{item.file.name}</p>
            <p className="text-xs text-ink/60">{formatSize(item.file.size)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {onMoveUp ? (
              <button
                type="button"
                onClick={() => onMoveUp(item.id)}
                disabled={index === 0}
                className="rounded-full border border-ink/10 px-3 py-1 transition hover:border-ink/30 disabled:opacity-40"
              >
                Move up
              </button>
            ) : null}
            {onMoveDown ? (
              <button
                type="button"
                onClick={() => onMoveDown(item.id)}
                disabled={index === files.length - 1}
                className="rounded-full border border-ink/10 px-3 py-1 transition hover:border-ink/30 disabled:opacity-40"
              >
                Move down
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="rounded-full border border-coral/30 px-3 py-1 text-coral transition hover:border-coral/60"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
