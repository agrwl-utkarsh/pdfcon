"use client";

import { useRef, useState } from "react";

interface FileUploadProps {
  title: string;
  helper: string;
  multiple?: boolean;
  disabled?: boolean;
  onFilesAdded: (files: File[]) => void;
}

export default function FileUpload({
  title,
  helper,
  multiple,
  disabled,
  onFilesAdded
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    onFilesAdded(Array.from(files));
  };

  return (
    <div
      className={`rounded-3xl border-2 border-dashed p-8 transition ${
        isDragging ? "border-sea bg-sea/5" : "border-ink/15 bg-white/70"
      } ${disabled ? "opacity-60" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-2xl bg-sea/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sea">
          Drag & drop PDFs
        </div>
        <div>
          <p className="font-display text-2xl">{title}</p>
          <p className="text-sm text-ink/70">{helper}</p>
        </div>
        <button
          type="button"
          className="button-primary"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          Select PDF files
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="application/pdf,.pdf"
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
    </div>
  );
}
