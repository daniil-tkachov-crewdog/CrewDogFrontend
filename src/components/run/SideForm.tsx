import { FormEvent, useRef } from "react";
import { Loader2 } from "lucide-react";
import type { SearchResultsFeedbackOption } from "@/services/support";
import { isPdfFile } from "@/lib/extractPdfText";

type Props = {
  jobUrl: string;
  setJobUrl: (v: string) => void;
  jobDescription: string;
  setJobDescription: (v: string) => void;
  cvFile: File | null;
  setCvFile: (f: File | null) => void;
  cvFileError: string | null;
  setCvFileError: (msg: string | null) => void;
  includeLeads: boolean;
  setIncludeLeads: (v: boolean) => void;
  outreachMessage: boolean;
  setOutreachMessage: (v: boolean) => void;
  isLoading: boolean;
  canSearch: boolean;
  onSubmit: (e: FormEvent) => void;
  onCustomise: () => void;
  showFeedback: boolean;
  feedbackOption: SearchResultsFeedbackOption | "";
  setFeedbackOption: (v: SearchResultsFeedbackOption) => void;
  customFeedback: string;
  setCustomFeedback: (v: string) => void;
  feedbackSubmitting: boolean;
  onFeedbackSubmit: () => void;
};

/* Radar form-card — shared by every flow stage (idle, loading, results, error). */
export default function SideForm({
  jobUrl,
  setJobUrl,
  jobDescription,
  setJobDescription,
  cvFile,
  setCvFile,
  cvFileError,
  setCvFileError,
  includeLeads,
  setIncludeLeads,
  outreachMessage,
  setOutreachMessage,
  isLoading,
  canSearch,
  onSubmit,
  onCustomise,
  showFeedback,
  feedbackOption,
  setFeedbackOption,
  customFeedback,
  setCustomFeedback,
  feedbackSubmitting,
  onFeedbackSubmit,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlDisabled = isLoading || !!jobDescription || !!cvFile;
  const jdDisabled = isLoading || !!jobUrl || !!cvFile;
  const cvDisabled = isLoading || !!jobUrl || !!jobDescription;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    e.target.value = "";
    setCvFileError(null);
    if (!selected) return;
    if (!isPdfFile(selected)) {
      setCvFileError("Please upload a PDF file.");
      return;
    }
    setJobUrl("");
    setJobDescription("");
    setCvFile(selected);
  }

  const labelCls =
    "block font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.08em] text-[#6F6C78] mb-[10px]";
  const inputCls =
    "w-full font-['Space_Grotesk',sans-serif] text-[15px] text-[#0B0B0F] bg-[#F4F2EE] border border-[#E4E1D9] rounded-[3px] px-[14px] py-[14px] transition-colors focus:outline-none focus:border-[#FF5A1F] disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="rounded-md border border-[#E4E1D9] bg-white px-7 py-[30px]">
      <form onSubmit={onSubmit}>
        {/* Advert URL */}
        <div className="mb-[22px]">
          <label htmlFor="run-url" className={labelCls}>
            Advert URL
          </label>
          <input
            id="run-url"
            type="url"
            placeholder="https://linkedin.com/jobs/..."
            value={jobUrl}
            onChange={(e) => {
              const v = e.target.value;
              setJobUrl(v);
              if (v) {
                setJobDescription("");
                setCvFile(null);
                setCvFileError(null);
              }
            }}
            className={inputCls}
            disabled={urlDisabled}
          />
        </div>

        {/* divider */}
        <div className="my-[6px] mb-[22px] flex items-center gap-[14px]">
          <span className="h-px flex-1 bg-[#E4E1D9]" />
          <span className="font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.16em] text-[#6F6C78]">
            or paste the text
          </span>
          <span className="h-px flex-1 bg-[#E4E1D9]" />
        </div>

        {/* Advert text */}
        <div className="mb-[22px]">
          <label htmlFor="run-jd" className={labelCls}>
            Advert text
          </label>
          <textarea
            id="run-jd"
            placeholder="Paste the full competitor advert here — include the location for best results…"
            value={jobDescription}
            onChange={(e) => {
              const v = e.target.value;
              setJobDescription(v);
              if (v) {
                setJobUrl("");
                setCvFile(null);
                setCvFileError(null);
              }
            }}
            className={inputCls + " min-h-[170px] resize-y leading-[1.55]"}
            disabled={jdDisabled}
          />
        </div>

        {/* divider — CV upload (kept feature) */}
        <div className="my-[6px] mb-[22px] flex items-center gap-[14px]">
          <span className="h-px flex-1 bg-[#E4E1D9]" />
          <span className="font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.16em] text-[#6F6C78]">
            or upload a CV
          </span>
          <span className="h-px flex-1 bg-[#E4E1D9]" />
        </div>

        <div className="mb-[22px]">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={cvDisabled}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={cvDisabled}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-[4px] border border-dashed border-[#E4E1D9] bg-[#F4F2EE] px-3 py-5 transition-colors hover:border-[#FF5A1F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.04em] text-[#0B0B0F]">
              {cvFile ? cvFile.name : "Click to upload a CV (PDF)"}
            </span>
            {!cvFile && (
              <span className="font-['IBM_Plex_Mono',monospace] text-[10px] text-[#6F6C78]">
                PDF only
              </span>
            )}
          </button>
          {cvFile && (
            <button
              type="button"
              onClick={() => {
                setCvFile(null);
                setCvFileError(null);
              }}
              disabled={isLoading}
              className="mt-2 font-['IBM_Plex_Mono',monospace] text-[11px] text-[#6F6C78] hover:text-[#0B0B0F]"
            >
              ✕ Remove
            </button>
          )}
          {cvFileError && (
            <p className="mt-2 font-['IBM_Plex_Mono',monospace] text-[11px] text-red-600">
              {cvFileError}
            </p>
          )}
        </div>

        {/* Toggles */}
        <div className="mb-6 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
          <Toggle
            on={outreachMessage}
            onClick={() => setOutreachMessage(!outreachMessage)}
            disabled={isLoading}
            label="Reveal contact"
            sub="Direct tier"
          />
          <Toggle
            on={includeLeads}
            onClick={() => setIncludeLeads(!includeLeads)}
            disabled={isLoading}
            label="Extra leads"
            sub="Wider net"
          />
        </div>

        {/* Primary */}
        <button
          type="submit"
          disabled={isLoading || (!jobUrl && !jobDescription && !cvFile) || !canSearch}
          className="flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#FF5A1F] px-[26px] py-[15px] font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Scanning…
            </>
          ) : (
            "Run Radar search"
          )}
        </button>

        {/* Ghost — Customise CV (kept feature) */}
        <button
          type="button"
          onClick={onCustomise}
          disabled={isLoading}
          className="mt-3 w-full rounded-[2px] border border-[#E4E1D9] bg-transparent px-[26px] py-[13px] font-['Space_Grotesk',sans-serif] text-[14px] font-medium text-[#0B0B0F] transition-colors hover:border-[#FF5A1F] disabled:opacity-50"
        >
          Customise your CV
        </button>

        <p className="mt-[14px] font-['IBM_Plex_Mono',monospace] text-[11px] leading-[1.5] tracking-[0.03em] text-[#6F6C78]">
          ⚠ Location is required for an accurate client match. Provide a URL, the
          advert text, or a CV — not more than one.
        </p>

        {/* Feedback survey (kept feature) — only after results */}
        {showFeedback && (
          <div className="mt-6 space-y-3 border-t border-[#E4E1D9] pt-5">
            <h3 className="text-[14px] font-semibold">How did Radar do?</h3>
            <div className="space-y-[10px]">
              {[
                { key: "helpful", label: "It was quite helpful, thanks!" },
                { key: "no_response", label: "I didn't get any response." },
                { key: "irrelevant", label: "These results are irrelevant!" },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className="flex cursor-pointer items-center gap-2 text-[14px]"
                >
                  <input
                    type="radio"
                    name="results-feedback"
                    checked={feedbackOption === opt.key}
                    onChange={() =>
                      setFeedbackOption(opt.key as SearchResultsFeedbackOption)
                    }
                    className="accent-[#FF5A1F]"
                    disabled={feedbackSubmitting}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}

              <label className="flex cursor-pointer items-center gap-2 text-[14px]">
                <input
                  type="radio"
                  name="results-feedback"
                  checked={feedbackOption === "custom"}
                  onChange={() => setFeedbackOption("custom")}
                  className="accent-[#FF5A1F]"
                  disabled={feedbackSubmitting}
                />
                <span>Your own feedback</span>
              </label>
              <textarea
                placeholder="Write your own sentence..."
                value={customFeedback}
                onChange={(e) => {
                  setCustomFeedback(e.target.value);
                  if (e.target.value && feedbackOption !== "custom") {
                    setFeedbackOption("custom");
                  }
                }}
                className={inputCls + " min-h-[72px] resize-y"}
                disabled={feedbackSubmitting}
              />

              <button
                type="button"
                onClick={onFeedbackSubmit}
                disabled={
                  feedbackSubmitting ||
                  !feedbackOption ||
                  (feedbackOption === "custom" && !customFeedback.trim())
                }
                className="w-full rounded-[2px] bg-[#FF5A1F] px-[26px] py-[12px] font-['Space_Grotesk',sans-serif] text-[14px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {feedbackSubmitting ? "Sending..." : "Send the feedback"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function Toggle({
  on,
  onClick,
  disabled,
  label,
  sub,
}: {
  on: boolean;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
      className={
        "flex select-none items-center gap-3 rounded-[4px] border px-[14px] py-[13px] text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
        (on
          ? "border-[#FF5A1F] bg-[#FF5A1F]/[0.04]"
          : "border-[#E4E1D9] hover:border-[#FF5A1F]")
      }
    >
      <span
        className={
          "relative h-[21px] w-[38px] flex-shrink-0 rounded-full transition-colors " +
          (on ? "bg-[#FF5A1F]" : "bg-[#E4E1D9]")
        }
      >
        <span
          className={
            "absolute left-[2px] top-[2px] h-[17px] w-[17px] rounded-full bg-white transition-transform " +
            (on ? "translate-x-[17px]" : "")
          }
        />
      </span>
      <span>
        <span className="block text-[13px] font-semibold leading-[1.2]">
          {label}
        </span>
        <span className="mt-[2px] block font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.04em] text-[#6F6C78]">
          {sub}
        </span>
      </span>
    </button>
  );
}
