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

const parsePages = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item));

export default function SplitPage() {
  const [fileItem, setFileItem] = useState<FileItem | null>(null);
  const [pages, setPages] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://localhost:8000";

  const resultName = useMemo(() => "pdfpilot-split.pdf", []);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleFilesAdded = (incoming: File[]) => {
    setError(null);
    if (incoming.length === 0) return;
    const file = incoming[0];
    if (!isPdf(file)) {
      setError("Only PDF files are supported.");
      return;
    }
    if (incoming.length > 1) {
      setError("Only one PDF is allowed for splitting. Using the first file.");
    }
    setFileItem({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file
    });
  };

  const handleSplit = async () => {
    setError(null);
    if (!fileItem) {
      setError("Please upload a PDF to split.");
      return;
    }
    if (!pages.trim()) {
      setError("Enter the page numbers you want to extract.");
      return;
    }
    const pageNumbers = parsePages(pages);
    if (pageNumbers.length === 0 || pageNumbers.some((num) => Number.isNaN(num))) {
      setError("Page numbers must be a comma-separated list of numbers.");
      return;
    }
    if (pageNumbers.some((num) => num < 1)) {
      setError("Page numbers must be 1 or higher.");
      return;
    }

    setIsLoading(true);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }

    try {
      const formData = new FormData();
      formData.append("file", fileItem.file);
      formData.append("pages", pages);

      const response = await fetch(`${apiBase}/split`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to split PDF.");
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
          Split PDFs
        </p>
        <h1 className="font-display text-3xl sm:text-5xl">
          Extract the pages you need
        </h1>
        <p className="text-sm text-ink/70 sm:text-base">
          Upload one PDF and list the pages you want to keep (example: 1,3,5).
        </p>
      </section>

      <FileUpload
        title="Drop a PDF to split"
        helper="Upload one PDF file. Use comma-separated page numbers."
        onFilesAdded={handleFilesAdded}
        disabled={isLoading}
      />

      <div className="space-y-4">
        <h2 className="font-display text-xl">Selected file</h2>
        <FileList
          files={fileItem ? [fileItem] : []}
          onRemove={() => setFileItem(null)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink">Pages to extract</label>
        <input
          className="input-field"
          placeholder="1,3,5"
          value={pages}
          onChange={(event) => setPages(event.target.value)}
          disabled={isLoading}
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
          onClick={handleSplit}
          className="button-primary"
          disabled={isLoading}
        >
          Split PDF
        </button>
        {isLoading ? <LoadingSpinner label="Splitting PDF..." /> : null}
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
