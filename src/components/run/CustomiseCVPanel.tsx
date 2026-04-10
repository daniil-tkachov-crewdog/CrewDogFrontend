import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Upload } from "lucide-react";

const CV_CUSTOMISE_URL =
  "https://crewdog.app.n8n.cloud/webhook/eb31b6d7-7bac-4ed0-a177-6676898d3ec8";

const PDFJS_CDN_URL =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";
const PDFJS_WORKER_CDN_URL =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

type PdfTextItem = {
  str?: string;
};

type PdfPage = {
  getTextContent: () => Promise<{ items: PdfTextItem[] }>;
};

type PdfDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
};

type PdfJsModule = {
  getDocument: (options: { data: ArrayBuffer }) => { promise: Promise<PdfDocument> };
  GlobalWorkerOptions: {
    workerSrc: string;
  };
};

let pdfJsModulePromise: Promise<PdfJsModule> | null = null;

async function getPdfJsModule(): Promise<PdfJsModule> {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import(/* @vite-ignore */ PDFJS_CDN_URL) as Promise<PdfJsModule>;
  }

  const pdfJsModule = await pdfJsModulePromise;
  pdfJsModule.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN_URL;
  return pdfJsModule;
}

function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endswith(".pdf");
}

async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfJsModule = await getPdfJsModule();
  const pdf = await pdfJsModule.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str ?? "").join(" ");
    fullText += `${pageText}\n`;
  }

  return fullText;
}

export default function CustomiseCVPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isCustomising, setIsCustomising] = useState(false);
  const [noFileAlert, setNoFileAlert] = useState(false);

  async function handleCustomise() {
    if (!cvFile) {
      setNoFileAlert(true);
      return;
    }

    setNoFileAlert(false);
    setIsCustomising(true);

    try {
      const cvText = await extractTextFromPdf(cvFile);
      await fetch(CV_CUSTOMISE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CV_text: cvText }),
      });
    } catch (err) {
      console.error("CV customise error:", err);
    } finally {
      setIsCustomising(false);
    }
  }

  return (
    <Card className="glass-card p-8 h-full flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Customise Your CV</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your CV and we'll tailor it to the job description.
        </p>
      </div>

      {noFileAlert && (
        <div className="px-4 py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/40 text-yellow-600 dark:text-yellow-400 text-sm font-medium">
          There's no CV uploaded.
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0] ?? null;

          if (selectedFile && isPdfFile(selectedFile)) {
            setCvFile(selectedFile);
            setNoFileAlert(false);
          } else {
            setCvFile(null);
          }
          e.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 transition-all duration-200 py-12 px-4 cursor-pointer group"
      >
        {cvFile ? (
          <>
            <FileText className="h-10 w-10 text-primary" />
            <span className="text-sm font-medium text-foreground truncate max-w-full px-4">
              {cvFile.name}
            </span>
            <span className="text-xs text-muted-foreground">Click to change</span>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Click to upload your CV
            </span>
            <span className="text-xs text-muted-foreground">PDF only</span>
          </>
        )}
      </button>

      <Button
        type="button"
        className="w-full h-16 text-lg font-bold relative overflow-hidden group bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 rounded-xl mt-auto"
        onClick={handleCustomise}
        disabled={isCustomising}
        size="lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {isCustomising ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin relative z-10 mr-2" />
            <span className="relative z-10">Customising…</span>
          </>
        ) : (
          <span className="relative z-10">Customise</span>
        )}
      </Button>
    </Card>
  );
}
