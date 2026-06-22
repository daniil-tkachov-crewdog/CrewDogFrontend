import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { sendCvCustomise, type CvCustomiseResult } from "@/services/support";
import { generateCvPdf } from "@/lib/generateCvPdf";
import { extractTextFromBuffer, isPdfFile } from "@/lib/extractPdfText";

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

  const labelCls =
    "block font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.08em] text-[#6F6C78] mb-[10px]";
  const inputCls =
    "w-full font-['Space_Grotesk',sans-serif] text-[15px] text-[#0B0B0F] bg-[#F4F2EE] border border-[#E4E1D9] rounded-[3px] px-[14px] py-[14px] transition-colors focus:outline-none focus:border-[#FF5A1F] disabled:opacity-50";

  return (
    <div className="rounded-md border border-[#E4E1D9] bg-white px-7 py-[30px]">
      <span className="font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.16em] text-[#FF5A1F]">
        Next step · CrewDog CV
      </span>
      <h2 className="mt-[10px] text-[24px] tracking-[-0.02em]">Customise your CV</h2>
      <p className="mt-2 text-[15px] leading-[1.6] text-[#55525E]">
        Upload your CV and we'll tailor it to the advert before you reach out.
      </p>

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
        className="mt-6 flex w-full flex-col items-center justify-center gap-2 rounded-[4px] border border-dashed border-[#E4E1D9] bg-[#F4F2EE] px-4 py-10 transition-colors hover:border-[#FF5A1F]"
      >
        <span className="font-['IBM_Plex_Mono',monospace] text-[13px] tracking-[0.04em] text-[#0B0B0F]">
          {cvFileName ?? "Click to upload your CV (PDF)"}
        </span>
        {!cvFileName && (
          <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-[#6F6C78]">
            PDF only
          </span>
        )}
      </button>

      {fileError && (
        <p className="mt-3 font-['IBM_Plex_Mono',monospace] text-[12px] text-red-600">
          {fileError}
        </p>
      )}

      <div className="mt-6 space-y-5">
        <div>
          <label className={labelCls}>Advert URL</label>
          <input
            type="url"
            placeholder="https://linkedin.com/jobs/..."
            value={jobUrl}
            onChange={(e) => {
              setJobUrl(e.target.value);
              if (e.target.value) setJobDescription("");
            }}
            className={inputCls}
            disabled={isCustomising}
          />
        </div>

        <div className="flex items-center gap-[14px]">
          <span className="h-px flex-1 bg-[#E4E1D9]" />
          <span className="font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.16em] text-[#6F6C78]">
            or paste the text
          </span>
          <span className="h-px flex-1 bg-[#E4E1D9]" />
        </div>

        <div>
          <label className={labelCls}>Advert text</label>
          <textarea
            placeholder="Paste the advert here…"
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (e.target.value) setJobUrl("");
            }}
            className={inputCls + " min-h-[120px] resize-y leading-[1.55]"}
            disabled={isCustomising}
          />
        </div>
      </div>

      {customisedCv && (
        <p className="mt-5 font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.04em] text-[#FF5A1F]">
          ✓ Your CV has been customised and is ready to download.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {customisedCv && (
          <button
            type="button"
            onClick={() => generateCvPdf(customisedCv)}
            className="flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#0B0B0F] px-[26px] py-[15px] font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" /> Download your CV
          </button>
        )}

        <button
          type="button"
          onClick={handleCustomise}
          disabled={!canCustomise || isCustomising}
          className="flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#FF5A1F] px-[26px] py-[15px] font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isCustomising ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Customising…
            </>
          ) : customisedCv ? (
            "Re-customise"
          ) : (
            "Customise"
          )}
        </button>
      </div>
    </div>
  );
}
