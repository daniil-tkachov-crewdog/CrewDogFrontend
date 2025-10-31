// src/pages/Run.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/auth/AuthProvider";

import { runSearch, mapN8nToResults } from "@/services/run";
import type { NormalizedResults } from "@/services/run";

// Account/quota summary for enabling the submit button
import { fetchAccountSummary, consumeOneCredit } from "@/services/account";
import { logHistory } from "@/services/history";

// Your presentational components
import CenteredForm from "@/components/run/CenteredForm";
import SideForm from "@/components/run/SideForm";
import LoadingCard from "@/components/run/LoadingCard";
import ResultsCard from "@/components/run/ResultsCard";
import QuotaBadge from "@/components/run/QuotaBadge";

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

export default function RunPage() {
  const { user } = useAuth();

  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [includeLeads, setIncludeLeads] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<NormalizedResults | null>(null);

  // derive plan/quota for enabling the submit button
  const [cap, setCap] = useState<number>(3);
  const [used, setUsed] = useState<number>(0);
  const [unlimited, setUnlimited] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await fetchAccountSummary();
        if (!mounted) return;
        setCap(s.cap ?? 3);
        setUsed(s.used ?? 0);
        setUnlimited(!!s.unlimited || isAdminUser(user));
      } catch {
        // ignore; keep defaults
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const canSearch = useMemo(() => {
    if (unlimited) return true;
    return used < cap;
  }, [unlimited, used, cap]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to run a search.",
        variant: "destructive",
      });
      return;
    }

    if (!jobUrl && !jobDescription) {
      toast({
        title: "Input Required",
        description: "Provide a job URL or paste the description.",
        variant: "destructive",
      });
      return;
    }

    if (!canSearch) {
      toast({
        title: "Quota Reached",
        description: "You’ve hit your current plan limit.",
        variant: "destructive",
      });
      return;
    }

    // ✅ GA4: submit (matches legacy)
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: "run_search",
      with_leads: includeLeads,
    });

    toast({ title: "Search Started", description: "Analyzing job posting…" });

    setIsLoading(true);
    try {
      const raw = await runSearch({
        JD: jobDescription || "",
        JD_link: jobUrl || "",
        includeLeads,
      });

      const normalized = mapN8nToResults(raw);
      setResults(normalized);

      // Fire-and-forget: consume credit + log history (full parity with old UI)
      void Promise.allSettled([
        consumeOneCredit(user?.id),
        logHistory({
          userId: user?.id,
          summary: normalized,
          jobUrl,
          jobDescription,
          includeLeads,
        }),
      ]);

      // ✅ GA4: success (matches legacy)
      (window as any).dataLayer.push({
        event: "run_search_success",
        with_leads: includeLeads,
      });

      // Notify other tabs to refresh quota
      try {
        const bc = new BroadcastChannel("gc-activity");
        bc.postMessage({ type: "search_used", ts: Date.now() });
        (bc as any).close?.();
      } catch {}

      // Optional legacy notifier
      (window as any).__notify?.("Search complete.", "success");

      toast({
        title: "Search Complete ✨",
        description: "Found company & contacts.",
      });
    } catch (err: any) {
      // ✅ GA4: error (matches legacy)
      (window as any).dataLayer.push({
        event: "run_search_error",
        message: err?.message || String(err),
      });

      (window as any).__notify?.(
        "Something went wrong. Please try again.",
        "error"
      );

      toast({
        title: "Search failed",
        description: err?.message || "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const hasSearched = !!results || isLoading;

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
                    setJobUrl={setJobUrl}
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    includeLeads={includeLeads}
                    setIncludeLeads={setIncludeLeads}
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
                    setJobUrl={setJobUrl}
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    includeLeads={includeLeads}
                    setIncludeLeads={setIncludeLeads}
                    isLoading={isLoading}
                    canSearch={canSearch}
                    onSubmit={handleSubmit}
                  />
                </motion.div>

                {/* Right: results or loader */}
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
                    {results && !isLoading && (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <ResultsCard results={results} />
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
