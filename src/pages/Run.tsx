import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowLeft, Copy } from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/auth/AuthProvider";

import { runSearch, mapN8nToResults } from "@/services/run";
import type { NormalizedResults } from "@/services/run";

import { fetchAccountSummary, consumeOneCredit } from "@/services/account";
import { logHistory } from "@/services/history";

import QuotaBadge from "@/components/run/QuotaBadge";

import CenteredForm from "@/components/run/CenteredForm";
import SideForm from "@/components/run/SideForm";
import LoadingCard from "@/components/run/LoadingCard";
import ResultsCard from "@/components/run/ResultsCard";

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
  args: { JD: string; JD_link: string; includeLeads: boolean; outreachMessage: boolean },
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
  const [includeLeads, setIncludeLeads] = useState(false);
  const [outreachMessage, setOutreachMessage] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<NormalizedResults | null>(null);
  const [err, setErr] = useState<{
    message: string;
    code?: string;
    requestId?: string;
  } | null>(null);

  const [cap, setCap] = useState<number>(3);
  const [used, setUsed] = useState<number>(0);
  const [unlimited, setUnlimited] = useState<boolean>(false);

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

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to run a search.",
        variant: "destructive",
      });
      return;
    }

    if (jobUrl.trim() && jobDescription.trim()) {
      toast({
        title: "Choose one input",
        description: "Provide either a Job URL or a Job Description, not both.",
        variant: "destructive",
      });
      return;
    }
    if (!jobUrl.trim() && !jobDescription.trim()) {
      toast({
        title: "Input required",
        description: "Provide a Job URL or paste the description.",
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
      const raw = await runSearchWithTimeout(
        { JD: jobDescription || "", JD_link: jobUrl || "", includeLeads, outreachMessage },
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

  const hasSearched = !!results || isLoading || !!err;

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <Topbar />
      <QuotaBadge />

      <main className="flex-1 flex flex-col relative">
        <div className="container mx-auto px-4 flex-1 flex flex-col py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <AnimatePresence mode="wait">
            {!hasSearched ? (
              <motion.div
                key="centered"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="w-full max-w-2xl">
                  <CenteredForm
                    jobUrl={jobUrl}
                    setJobUrl={(v) => {
                      setErr(null);
                      setResults(null);
                      setJobUrl(v);
                      if (v) setJobDescription("");
                    }}
                    jobDescription={jobDescription}
                    setJobDescription={(v) => {
                      setErr(null);
                      setResults(null);
                      setJobDescription(v);
                      if (v) setJobUrl("");
                    }}
                    includeLeads={includeLeads}
                    setIncludeLeads={setIncludeLeads}
                    outreachMessage={outreachMessage}
                    setOutreachMessage={setOutreachMessage}
                    isLoading={isLoading}
                    canSearch={canSearch}
                    onSubmit={handleSubmit}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="split"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full"
              >
                {/* Left: compact form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <SideForm
                    jobUrl={jobUrl}
                    setJobUrl={(v) => {
                      setErr(null);
                      setResults(null);
                      setJobUrl(v);
                      if (v) setJobDescription("");
                    }}
                    jobDescription={jobDescription}
                    setJobDescription={(v) => {
                      setErr(null);
                      setResults(null);
                      setJobDescription(v);
                      if (v) setJobUrl("");
                    }}
                    includeLeads={includeLeads}
                    setIncludeLeads={setIncludeLeads}
                    outreachMessage={outreachMessage}
                    setOutreachMessage={setOutreachMessage}
                    isLoading={isLoading}
                    canSearch={canSearch}
                    onSubmit={handleSubmit}
                  />
                </motion.div>

                {/* Right: results / loader / error */}
                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <AnimatePresence mode="wait">
                    {isLoading && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <LoadingCard />
                      </motion.div>
                    )}

                    {!isLoading && err && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card p-6 border-red-500/20 bg-red-500/5 rounded-xl"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              We couldn’t complete the search
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {err.message}
                            </p>
                            {(err.code || err.requestId) && (
                              <div className="mt-3 text-xs text-muted-foreground/90 flex items-center gap-3">
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
                                      className="inline-flex items-center gap-1 px-2 py-0.5 border rounded-md hover:bg-accent/30"
                                      onClick={() =>
                                        navigator.clipboard.writeText(
                                          err.requestId!
                                        )
                                      }
                                      aria-label="Copy request id"
                                    >
                                      <Copy className="h-3.5 w-3.5" /> Copy
                                    </button>
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                type="button"
                                className="btn btn-sm border px-3 py-1.5 rounded-md"
                                onClick={(ev) => handleSubmit(ev as any)}
                              >
                                Try Again
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm border px-3 py-1.5 rounded-md"
                                onClick={() => {
                                  setErr(null);
                                  setResults(null);
                                }}
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {!isLoading && results && !err && (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <ResultsCard results={results as any} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
