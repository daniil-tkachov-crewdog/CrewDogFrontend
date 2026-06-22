import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy } from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/auth/AuthProvider";

import { runSearch, mapN8nToResults } from "@/services/run";
import type { NormalizedResults } from "@/services/run";
import { extractTextFromBuffer } from "@/lib/extractPdfText";

//Added by Denny - the user survey

import {
  sendSearchResultsFeedback,
  type SearchResultsFeedbackOption,
} from "@/services/support";

//...

import { fetchAccountSummary, consumeOneCredit } from "@/services/account";
import { logHistory } from "@/services/history";

import QuotaBadge from "@/components/run/QuotaBadge";

import SideForm from "@/components/run/SideForm";
import LoadingCard from "@/components/run/LoadingCard";
import ResultsCard from "@/components/run/ResultsCard";
import CustomiseCVPanel from "@/components/run/CustomiseCVPanel";

/* ---------------- helpers ---------------- */

function isAdminUser(user: any) {
  const app = user?.app_metadata ?? {};
  const u = user?.user_metadata ?? {};
  const role = app.role ?? u.role ?? user?.role;
  return (
    role === "ADMIN" ||
    role === "admin" ||
    app.isAdmin === true ||
    u.isAdmin === true
  );
}

function extractN8nError(
  raw: any
): { message: string; code?: string; requestId?: string } | null {
  if (typeof raw === "string") {
    const msg = raw.trim();
    return msg ? { message: msg } : null;
  }
  if (!raw || typeof raw !== "object") return null;

  if (raw.output_error) {
    if (typeof raw.output_error === "string")
      return { message: raw.output_error };
    if (typeof raw.output_error === "object") {
      const { message, code, requestId, request_id } = raw.output_error as any;
      return {
        message: message || "Unexpected error",
        code,
        requestId: requestId || request_id,
      };
    }
  }
  if (raw.error) {
    if (typeof raw.error === "string") return { message: raw.error };
    if (typeof raw.error === "object") {
      const { message, code, requestId, request_id } = raw.error as any;
      return {
        message: message || "Unexpected error",
        code,
        requestId: requestId || request_id,
      };
    }
  }
  if (raw.success === false) {
    const { message, code, requestId, request_id } = raw as any;
    return {
      message: message || "Request failed",
      code,
      requestId: requestId || request_id,
    };
  }
  if (typeof raw.message === "string" && raw.message)
    return { message: raw.message };
  if (typeof (raw as any).detail === "string" && (raw as any).detail)
    return { message: (raw as any).detail };
  if (raw.data?.error) {
    const e = raw.data.error;
    if (typeof e === "string") return { message: e };
    if (typeof e === "object") {
      const { message, code, requestId, request_id } = e as any;
      return {
        message: message || "Unexpected error",
        code,
        requestId: requestId || request_id,
      };
    }
  }
  if (Array.isArray(raw) && raw.length) {
    const first = raw[0];
    const nested = extractN8nError(first);
    if (nested) return nested;
  }
  return null;
}

async function runSearchWithTimeout(
  args: {
    JD: string;
    JD_link: string;
    full_CV_text: string;
    includeLeads: boolean;
    outreachMessage: boolean;
  },
  ms = 60000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const raw = await runSearch(args as any);
    return raw;
  } finally {
    clearTimeout(id);
  }
}

/* ---------------- component ---------------- */

export default function RunPage() {
  const { user } = useAuth();

  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileError, setCvFileError] = useState<string | null>(null);
  const [includeLeads, setIncludeLeads] = useState(false);
  const [outreachMessage, setOutreachMessage] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<NormalizedResults | null>(null);
  const [err, setErr] = useState<{
    message: string;
    code?: string;
    requestId?: string;
  } | null>(null);

  const [showCustomise, setShowCustomise] = useState(false);
  
  const [cap, setCap] = useState<number>(3);
  const [used, setUsed] = useState<number>(0);
  const [unlimited, setUnlimited] = useState<boolean>(false);

//Added by Denny - the user survey
  
  const [feedbackOption, setFeedbackOption] = useState<
    SearchResultsFeedbackOption | ""
  >("");
  const [customFeedback, setCustomFeedback] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  
//...
  
  async function syncQuotaFromServer() {
    const s = await fetchAccountSummary();
    setCap(s.cap ?? 3);
    setUsed(s.used ?? 0);
    setUnlimited(!!s.unlimited || isAdminUser(user));
    return s;
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await fetchAccountSummary();
        if (!mounted) return;
        setCap(s.cap ?? 3);
        setUsed(s.used ?? 0);
        setUnlimited(!!s.unlimited || isAdminUser(user));
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const canSearch = useMemo(
    () => (unlimited ? true : used < cap),
    [unlimited, used, cap]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setFeedbackOption("");
    setCustomFeedback("");
    setShowCustomise(false);

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to run a search.",
        variant: "destructive",
      });
      return;
    }

    const filledCount =
      (jobUrl.trim() ? 1 : 0) +
      (jobDescription.trim() ? 1 : 0) +
      (cvFile ? 1 : 0);

    if (filledCount > 1) {
      toast({
        title: "Choose one input",
        description: "Provide a Job URL, a Job Description, or a CV — not more than one.",
        variant: "destructive",
      });
      return;
    }
    if (filledCount === 0) {
      toast({
        title: "Input required",
        description: "Provide a Job URL, paste the description, or upload your CV.",
        variant: "destructive",
      });
      return;
    }

    // fresh gate
    const sNow = await fetchAccountSummary();
    const isUnlimitedNow = !!sNow.unlimited || isAdminUser(user);
    const capNow = sNow.cap ?? 3;
    const usedNow = sNow.used ?? 0;

    if (!isUnlimitedNow && usedNow >= capNow) {
      toast({
        title: "Quota reached",
        description: "You’ve hit your current plan limit.",
        variant: "destructive",
      });
      setCap(capNow);
      setUsed(usedNow);
      setUnlimited(isUnlimitedNow);
      return;
    }

    setCap(capNow);
    setUsed(usedNow);
    setUnlimited(isUnlimitedNow);

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "run_search",
      with_leads: includeLeads,
    });

    toast({ title: "Search started", description: "Analyzing job posting…" });

    if (!isUnlimitedNow) {
      setUsed((u) => Math.min(capNow, u + 1));
    }

    setIsLoading(true);
    try {
      let fullCvText = "";
      if (cvFile) {
        try {
          const buffer = await cvFile.arrayBuffer();
          fullCvText = await extractTextFromBuffer(buffer);
        } catch (extractErr: any) {
          setErr({
            message:
              "Could not read the uploaded PDF. Please try a different file.",
          });
          throw extractErr;
        }
      }

      const raw = await runSearchWithTimeout(
        {
          JD: jobDescription || "",
          JD_link: jobUrl || "",
          full_CV_text: fullCvText,
          includeLeads,
          outreachMessage,
        },
        60000
      );
      if (raw == null) throw new Error("Empty response from server");

      const maybeErr = extractN8nError(raw);
      if (maybeErr) {
        if (/missed location/i.test(maybeErr.message)) {
          maybeErr.message =
            "We couldn’t detect the job location. Please include the city/region and try again.";
        }
        setErr(maybeErr);
        throw new Error(maybeErr.message);
      }

      let normalized: NormalizedResults;
      try {
        normalized = mapN8nToResults(raw);
      } catch (mapErr: any) {
        setErr({
          message:
            mapErr?.message ||
            "We received an unexpected payload from the search engine.",
        });
        throw mapErr;
      }

      if (!normalized || typeof normalized !== "object") {
        setErr({ message: "No results returned from the search." });
        throw new Error("No results");
      }

      setResults(normalized);

      // consume then history
      await consumeOneCredit(user?.id);

      void logHistory({
        userId: user?.id,
        summary: normalized,
        jobUrl,
        jobDescription,
        includeLeads,
      });

      (window as any).dataLayer.push({
        event: "run_search_success",
        with_leads: includeLeads,
      });

      // settle -> sync -> broadcast
      await new Promise((r) => setTimeout(r, 350));
      const synced = await syncQuotaFromServer();

      try {
        const bc = new BroadcastChannel("gc-activity");
        bc.postMessage({ type: "quota_changed", ts: Date.now(), synced });
        (bc as any).close?.();
      } catch {}

      (window as any).__notify?.("Search complete.", "success");
      toast({
        title: "Search complete ✨",
        description: "Found company & contacts.",
      });
    } catch (error: any) {
      // revert optimistic if needed by syncing
      const synced = await syncQuotaFromServer();

      try {
        const bc = new BroadcastChannel("gc-activity");
        bc.postMessage({ type: "quota_changed", ts: Date.now(), synced });
        (bc as any).close?.();
      } catch {}

      (window as any).dataLayer.push({
        event: "run_search_error",
        message: error?.message || String(error),
      });

      (window as any).__notify?.(
        "Something went wrong. Please try again.",
        "error"
      );
      toast({
        title: "Search failed",
        description:
          err?.message ||
          error?.message ||
          "Unexpected error. Please retry or try a different input.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  //Added by Denny - the user survay

  async function handleFeedbackSubmit() {
    if (!feedbackOption) return;
    if (feedbackOption === "custom" && !customFeedback.trim()) {
      toast({
        title: "Feedback is empty",
        description: "Please write your feedback before sending.",
        variant: "destructive",
      });
      return;
    }

    setFeedbackSubmitting(true);
    try {
      const defaultMessageByType: Record<SearchResultsFeedbackOption, string> = {
        helpful: "It was quite helpful, thanks!",
        no_response: "I didn't get any response.",
        irrelevant: "These results are irrelevant!",
        custom: customFeedback.trim(),
      };

      await sendSearchResultsFeedback({
        feedbackType: feedbackOption,
        feedbackMessage: defaultMessageByType[feedbackOption],
        userEmail: user?.email || "",
      });

      toast({
        title: "Feedback sent",
        description: "Thanks for helping us improve the results.",
      });
      setFeedbackOption("");
      setCustomFeedback("");
    } catch (error: any) {
      toast({
        title: "Could not send feedback",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setFeedbackSubmitting(false);
    }
  }

  //...
  
  // Shared input setters — clearing stale state + enforcing single-input rule.
  const onJobUrl = (v: string) => {
    setErr(null);
    setResults(null);
    setJobUrl(v);
    if (v) {
      setJobDescription("");
      setCvFile(null);
      setCvFileError(null);
    }
  };
  const onJobDescription = (v: string) => {
    setErr(null);
    setResults(null);
    setJobDescription(v);
    if (v) {
      setJobUrl("");
      setCvFile(null);
      setCvFileError(null);
    }
  };
  const onCvFile = (f: File | null) => {
    setErr(null);
    setResults(null);
    setCvFile(f);
    if (f) {
      setJobUrl("");
      setJobDescription("");
    }
  };

  const showResults = !showCustomise && !isLoading && !!results && !err;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] text-[#0B0B0F] font-['Space_Grotesk',system-ui,sans-serif]">
      <Topbar />
      <QuotaBadge />

      <main className="flex-1 py-14">
        <div className="mx-auto w-full max-w-[1040px] px-6">
          {/* Run heading */}
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="font-['IBM_Plex_Mono',monospace] text-[13px] uppercase tracking-[0.2em] text-[#FF5A1F]">
                // run a search
              </span>
              <Link
                to="/"
                className="font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.06em] text-[#6F6C78] transition-colors hover:text-[#0B0B0F]"
              >
                ← Back
              </Link>
            </div>
            <h1 className="max-w-[18ch] text-[clamp(30px,5vw,46px)] leading-[1.02] tracking-[-0.02em]">
              Paste a competitor advert
            </h1>
            <p className="mt-4 max-w-[56ch] text-[17px] leading-[1.6] text-[#55525E]">
              Drop in the job post — URL or full text. Radar reads the signals and
              names the likely end client behind it, plus the contact worth
              approaching.
            </p>
          </div>

          {/* Split layout — consistent across every stage */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
            {/* Left: form (always present) */}
            <SideForm
              jobUrl={jobUrl}
              setJobUrl={onJobUrl}
              jobDescription={jobDescription}
              setJobDescription={onJobDescription}
              cvFile={cvFile}
              setCvFile={onCvFile}
              cvFileError={cvFileError}
              setCvFileError={setCvFileError}
              includeLeads={includeLeads}
              setIncludeLeads={setIncludeLeads}
              outreachMessage={outreachMessage}
              setOutreachMessage={setOutreachMessage}
              isLoading={isLoading}
              canSearch={canSearch}
              onSubmit={handleSubmit}
              onCustomise={() => setShowCustomise(true)}
              showFeedback={showResults}
              feedbackOption={feedbackOption}
              setFeedbackOption={setFeedbackOption}
              customFeedback={customFeedback}
              setCustomFeedback={setCustomFeedback}
              feedbackSubmitting={feedbackSubmitting}
              onFeedbackSubmit={handleFeedbackSubmit}
            />

            {/* Right: state-dependent panel */}
            <div className="min-h-[340px]">
              <AnimatePresence mode="wait">
                {showCustomise ? (
                  <motion.div
                    key="customise"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-3">
                      <button
                        type="button"
                        onClick={() => setShowCustomise(false)}
                        className="font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.06em] text-[#6F6C78] transition-colors hover:text-[#0B0B0F]"
                      >
                        ← Back to results
                      </button>
                    </div>
                    <CustomiseCVPanel />
                  </motion.div>
                ) : isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <LoadingCard />
                  </motion.div>
                ) : err ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-md border border-[#E4E1D9] border-l-4 border-l-[#FF5A1F] bg-white px-7 py-7"
                  >
                    <span className="font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.16em] text-[#FF5A1F]">
                      No signal
                    </span>
                    <h3 className="mt-2 text-[20px] tracking-[-0.01em]">
                      We couldn’t complete the search
                    </h3>
                    <p className="mt-2 max-w-[54ch] text-[15px] leading-[1.6] text-[#55525E]">
                      {err.message}
                    </p>
                    {(err.code || err.requestId) && (
                      <div className="mt-3 flex items-center gap-3 font-['IBM_Plex_Mono',monospace] text-[11px] text-[#6F6C78]">
                        {err.code && (
                          <span>
                            Code: <code>{err.code}</code>
                          </span>
                        )}
                        {err.requestId && (
                          <span className="inline-flex items-center gap-1">
                            Req: <code>{err.requestId}</code>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-[2px] border border-[#E4E1D9] px-2 py-0.5 hover:border-[#FF5A1F]"
                              onClick={() =>
                                navigator.clipboard.writeText(err.requestId!)
                              }
                              aria-label="Copy request id"
                            >
                              <Copy className="h-3 w-3" /> Copy
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={(ev) => handleSubmit(ev as any)}
                        className="rounded-[2px] bg-[#FF5A1F] px-5 py-[11px] text-[14px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5"
                      >
                        Try again
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setErr(null);
                          setResults(null);
                        }}
                        className="rounded-[2px] border border-[#E4E1D9] px-5 py-[11px] text-[14px] font-medium transition-colors hover:border-[#FF5A1F]"
                      >
                        Reset
                      </button>
                    </div>
                  </motion.div>
                ) : results ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ResultsCard results={results as any} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-md border border-dashed border-[#E4E1D9] px-9 py-12 text-center"
                  >
                    <div className="relative mb-[26px] h-[120px] w-[120px] rounded-full border border-[#FF5A1F]/30">
                      <span className="absolute inset-6 rounded-full border border-[#FF5A1F]/[0.22]" />
                      <span className="absolute inset-12 rounded-full border border-[#FF5A1F]/[0.16]" />
                      <span className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5A1F]" />
                    </div>
                    <h3 className="mb-2 text-[18px] tracking-[-0.01em]">
                      Awaiting signal
                    </h3>
                    <p className="max-w-[36ch] text-[14px] leading-[1.55] text-[#55525E]">
                      Paste an advert and run the search. Your likely client and
                      contact will surface here.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
