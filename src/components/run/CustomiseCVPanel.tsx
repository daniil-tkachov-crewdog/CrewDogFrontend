import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { sendCvCustomise, type CvCustomiseResult } from "@/services/support";

const PDFJS_CDN_URL =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";
const PDFJS_WORKER_CDN_URL =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

type PdfTextItem = { str?: string };
type PdfPage = { getTextContent: () => Promise<{ items: PdfTextItem[] }> };
type PdfDocument = { numPages: number; getPage: (n: number) => Promise<PdfPage> };
type PdfJsModule = {
  getDocument: (opts: { data: ArrayBuffer }) => { promise: Promise<PdfDocument> };
  GlobalWorkerOptions: { workerSrc: string };
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
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

async function extractTextFromBuffer(buffer: ArrayBuffer): Promise<string> {
  const pdfJsModule = await getPdfJsModule();
  const pdf = await pdfJsModule.getDocument({ data: buffer }).promise;

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
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [cvBuffer, setCvBuffer] = useState<ArrayBuffer | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isCustomising, setIsCustomising] = useState(false);
  const [customisedCv, setCustomisedCv] = useState<CvCustomiseResult | null>(null);

  const hasJd = jobUrl.trim().length > 0 || jobDescription.trim().length > 0;
  const canCustomise = cvBuffer !== null && hasJd;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;
    e.target.value = "";
    setFileError(null);
    setCvBuffer(null);
    setCvFileName(null);

    if (!selectedFile) return;
    if (!isPdfFile(selectedFile)) {
      setFileError("Please upload a PDF file.");
      return;
    }

    try {
      const buffer = await selectedFile.arrayBuffer();
      setCvBuffer(buffer);
      setCvFileName(selectedFile.name);
    } catch {
      setFileError("Could not read the file. Please try again or use a different PDF.");
    }
  }

  async function handleCustomise() {
    if (!canCustomise) return;

    setIsCustomising(true);
    setCustomisedCv(null);

    try {
      // slice(0) copies the buffer — PDF.js transfers (detaches) whatever it receives,
      // so we must never hand it the original stored in state.
      const cvText = await extractTextFromBuffer(cvBuffer!.slice(0));
      const result = await sendCvCustomise({
        cvText,
        jobUrl: jobUrl.trim(),
        jobDescription: jobDescription.trim(),
      });
      setCustomisedCv(result);
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

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 transition-all duration-200 py-12 px-4 cursor-pointer group"
      >
        {cvFileName ? (
          <>
            <FileText className="h-10 w-10 text-primary" />
            <span className="text-sm font-medium text-foreground truncate max-w-full px-4">
              {cvFileName}
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

      {fileError && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{fileError}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/80">
            Job Posting URL
          </label>
          <Input
            type="url"
            placeholder="https://linkedin.com/jobs/..."
            value={jobUrl}
            onChange={(e) => {
              setJobUrl(e.target.value);
              if (e.target.value) setJobDescription("");
            }}
            className="h-11 bg-background/60 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 focus:border-primary/40 transition-all duration-300 rounded-xl"
            disabled={isCustomising}
          />
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-4 py-1 text-xs font-semibold text-muted-foreground/60 tracking-wider uppercase rounded-full border border-border/50">
              Or paste description
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/80">
            Job Description
          </label>
          <Textarea
            placeholder="Paste the job description here…"
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (e.target.value) setJobUrl("");
            }}
            className="min-h-[120px] resize-none bg-background/60 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 focus:border-primary/40 transition-all duration-300 rounded-xl"
            disabled={isCustomising}
          />
        </div>
      </div>

      {customisedCv && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">Your CV has been customised and is ready to download.</span>
        </div>
      )}

      <Button
        type="button"
        className="w-full h-16 text-lg font-bold relative overflow-hidden group bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 rounded-xl mt-auto"
        onClick={handleCustomise}
        disabled={!canCustomise || isCustomising}
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
