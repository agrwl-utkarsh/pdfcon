"use client";

import { useEffect, useMemo, useState } from "react";
import FileList from "@/components/FileList";
import FileUpload from "@/components/FileUpload";
import LoadingSpinner from "@/components/LoadingSpinner";
import ResultDownload from "@/components/ResultDownload";

interface FileItem {
  id: string;
  file: File;
}

const isPdf = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

export default function MergePage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://localhost:8000";

  const canMerge = files.length >= 2 && !isLoading;

  const resultName = useMemo(() => "pdfpilot-merged.pdf", []);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleFilesAdded = (incoming: File[]) => {
    setError(null);
    const valid = incoming.filter(isPdf);
    if (valid.length !== incoming.length) {
      setError("Only PDF files are supported.");
    }
    if (valid.length === 0) return;
    setFiles((prev) => [
      ...prev,
      ...valid.map((file) => ({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file
      }))
    ]);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const moveFile = (id: string, direction: "up" | "down") => {
    setFiles((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(index, 1);
      updated.splice(nextIndex, 0, moved);
      return updated;
    });
  };

  const handleMerge = async () => {
    setError(null);
    if (files.length < 2) {
      setError("Please upload at least two PDFs to merge.");
      return;
    }

    setIsLoading(true);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }

    try {
      const formData = new FormData();
      files.forEach((item) => formData.append("files", item.file));

      const response = await fetch(`${apiBase}/merge`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to merge PDFs.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sea/80">
          Merge PDFs
        </p>
        <h1 className="font-display text-3xl sm:text-5xl">
          Combine files into a single PDF
        </h1>
        <p className="text-sm text-ink/70 sm:text-base">
          Add two or more PDFs, arrange them in order, and merge instantly.
        </p>
      </section>

      <FileUpload
        title="Drop PDFs to merge"
        helper="Upload at least 2 PDFs. Drag and drop to reorder afterward."
        multiple
        onFilesAdded={handleFilesAdded}
        disabled={isLoading}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Merge list</h2>
          <p className="text-sm text-ink/60">{files.length} file(s)</p>
        </div>
        <FileList
          files={files}
          onRemove={handleRemove}
          onMoveUp={(id) => moveFile(id, "up")}
          onMoveDown={(id) => moveFile(id, "down")}
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleMerge}
          className="button-primary"
          disabled={!canMerge}
        >
          Merge PDFs
        </button>
        {isLoading ? <LoadingSpinner label="Merging PDFs..." /> : null}
      </div>

      <ResultDownload
        url={resultUrl}
        fileName={resultName}
        onClear={() => {
          if (resultUrl) URL.revokeObjectURL(resultUrl);
          setResultUrl(null);
        }}
      />
    </div>
  );
}
