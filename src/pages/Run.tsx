import { useState } from "react";
import { Link } from "react-router-dom";
import { useMockAuth, getQuotaForPlan } from "@/hooks/useMockAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Zap, Crown, ArrowLeft, Send, Building2, Globe, Briefcase, Users2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SearchResult {
  company: string;
  website: string;
  careerPage: string;
  contacts: Array<{
    name: string;
    role: string;
    linkedIn: string;
  }>;
}

export default function Run() {
  const { user, isAuthenticated, incrementSearches } = useMockAuth();
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [includeLeads, setIncludeLeads] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);

  const plan = user?.plan || "Free";
  const searchesUsed = user?.searchesUsed || 0;
  const totalSearches = getQuotaForPlan(plan);
  const hasUnlimitedSearches = plan === "Admin";
  const canSearch = hasUnlimitedSearches || searchesUsed < totalSearches;

  const getPlanIcon = () => {
    switch (plan) {
      case "Admin":
        return <Crown className="h-4 w-4" />;
      case "Pro":
        return <Zap className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getPlanColor = () => {
    switch (plan) {
      case "Admin":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
      case "Pro":
        return "bg-gradient-to-r from-primary to-accent text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to run a search.",
        variant: "destructive",
      });
      return;
    }

    if (!canSearch) {
      toast({
        title: "Search Limit Reached",
        description: "You've used all your searches. Upgrade to Pro for more!",
        variant: "destructive",
      });
      return;
    }

    if (!jobUrl && !jobDescription) {
      toast({
        title: "Input Required",
        description: "Please provide either a job URL or description.",
        variant: "destructive",
      });
      return;
    }

    if (jobDescription && jobDescription.length < 300) {
      toast({
        title: "Description Too Short",
        description: "Job description must be at least 300 characters.",
        variant: "destructive",
      });
      return;
    }

    if (jobDescription && !jobDescription.toLowerCase().includes("location")) {
      toast({
        title: "Location Required",
        description: "Please include location information in the description.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Search Started",
      description: "Analyzing job posting with AI...",
    });

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      incrementSearches();
      setResults({
        company: "TechCorp Industries",
        website: "https://techcorp.example.com",
        careerPage: "https://techcorp.example.com/careers",
        contacts: [
          { name: "Sarah Johnson", role: "Hiring Manager", linkedIn: "https://linkedin.com/in/sarah-johnson" },
          { name: "Mike Chen", role: "HR Director", linkedIn: "https://linkedin.com/in/mike-chen" },
        ],
      });
      toast({
        title: "Search Complete! ✨",
        description: "Found company details and key contacts.",
      });
    }, 3000);
  };

  const hasSearched = results !== null || isLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Topbar />

      {/* Floating Quota Badge */}
      <div className="fixed top-20 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`glass-card px-3 py-2 rounded-full shadow-lg ${getPlanColor()}`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            {getPlanIcon()}
            <span>{plan}</span>
            {!hasUnlimitedSearches && (
              <>
                <span className="opacity-50">•</span>
                <span>{searchesUsed}/{totalSearches}</span>
              </>
            )}
            {hasUnlimitedSearches && (
              <>
                <span className="opacity-50">•</span>
                <span>∞</span>
              </>
            )}
          </div>
        </motion.div>
      </div>

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
              // Centered initial view
              <motion.div
                key="centered"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="w-full max-w-2xl">

                  {/* Centered Search Form */}
                  <Card className="border p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <Input
                      type="url"
                      placeholder="Paste LinkedIn job URL"
                      value={jobUrl}
                      onChange={(e) => {
                        setJobUrl(e.target.value);
                        if (e.target.value) setJobDescription("");
                      }}
                      className="h-10"
                      disabled={isLoading}
                    />

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-background px-2 text-xs text-muted-foreground">or</span>
                      </div>
                    </div>

                    <Textarea
                      placeholder="Paste job description (min. 300 characters, include location)"
                      value={jobDescription}
                      onChange={(e) => {
                        setJobDescription(e.target.value);
                        if (e.target.value) setJobUrl("");
                      }}
                      className="min-h-[120px] resize-none"
                      disabled={isLoading}
                    />
                    {jobDescription && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${Math.min((jobDescription.length / 300) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="tabular-nums">{jobDescription.length}/300</span>
                      </div>
                    )}
                  </div>

                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeLeads}
                      onChange={(e) => setIncludeLeads(e.target.checked)}
                      className="w-4 h-4 rounded border-input"
                      disabled={isLoading}
                    />
                    <div className="flex-1 text-sm">
                      Include potential leads search
                    </div>
                  </label>

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={isLoading || (!jobUrl && !jobDescription) || !canSearch}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        Run Search
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {!canSearch && !hasUnlimitedSearches && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-4 rounded-lg bg-destructive/10 border border-destructive/20"
                    >
                      <p className="text-sm font-medium text-destructive">
                        Search limit reached.{" "}
                        <Link to="/pricing" className="underline hover:no-underline">
                          Upgrade to Pro
                        </Link>
                        {" "}for 50 searches/month
                      </p>
                    </motion.div>
                  )}
                    </form>
                  </Card>
                </div>
              </motion.div>
            ) : (
              // Split view after search
              <motion.div
                key="split"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full"
              >
                {/* Left Column - Form (1/3) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-1"
                >
                  <Card className="border p-5 h-full">
                    <h2 className="text-sm font-semibold mb-4">Search Query</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-3">
                        <Input
                          type="url"
                          placeholder="Job URL"
                          value={jobUrl}
                          onChange={(e) => {
                            setJobUrl(e.target.value);
                            if (e.target.value) setJobDescription("");
                          }}
                          className="h-9 text-sm"
                          disabled={isLoading}
                        />

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center">
                            <span className="bg-background px-2 text-xs text-muted-foreground">or</span>
                          </div>
                        </div>

                        <Textarea
                          placeholder="Job description..."
                          value={jobDescription}
                          onChange={(e) => {
                            setJobDescription(e.target.value);
                            if (e.target.value) setJobUrl("");
                          }}
                          className="min-h-[80px] resize-none text-sm"
                          disabled={isLoading}
                        />
                        {jobDescription && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all"
                                style={{ width: `${Math.min((jobDescription.length / 300) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="tabular-nums">{jobDescription.length}/300</span>
                          </div>
                        )}
                      </div>

                      <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-accent/5 transition-colors">
                        <input
                          type="checkbox"
                          checked={includeLeads}
                          onChange={(e) => setIncludeLeads(e.target.checked)}
                          className="w-4 h-4 rounded"
                          disabled={isLoading}
                        />
                        <span className="text-xs">Include leads</span>
                      </label>

                      <Button
                        type="submit"
                        className="w-full h-9 text-sm gap-2"
                        disabled={isLoading || (!jobUrl && !jobDescription) || !canSearch}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Send className="h-3 w-3" />
                            New Search
                          </>
                        )}
                      </Button>

                      {!canSearch && !hasUnlimitedSearches && (
                        <div className="text-center p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <p className="text-xs text-destructive">
                            Limit reached.{" "}
                            <Link to="/pricing" className="underline">
                              Upgrade
                            </Link>
                          </p>
                        </div>
                      )}
                    </form>
                  </Card>
                </motion.div>

                {/* Right Column - Results (2/3) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-2"
                >
                  <AnimatePresence mode="wait">
                    {isLoading && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card className="glass-card p-12 h-full flex items-center justify-center">
                          <div className="text-center space-y-6">
                            <div className="relative">
                              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent animate-glow-pulse flex items-center justify-center">
                                <Loader2 className="h-10 w-10 animate-spin text-primary-foreground" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xl font-semibold">Analyzing with AI</p>
                              <p className="text-sm text-muted-foreground">
                                Extracting company details and key contacts...
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}

                    {results && !isLoading && (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card className="glass-card p-8 h-full">
                          <div className="space-y-8">
                            {/* Company Header */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                  <Building2 className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Company Found</p>
                                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                    {results.company}
                                  </h3>
                                </div>
                              </div>
                            </div>

                            {/* Resources */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-sm">Resources</h4>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <a
                                  href={results.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/20"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <Globe className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Website</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">Visit company site</p>
                                </a>
                                <a
                                  href={results.careerPage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/20"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <Briefcase className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Careers</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">View open positions</p>
                                </a>
                              </div>
                            </div>

                            {/* Key Contacts */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Users2 className="h-4 w-4 text-primary" />
                                <h4 className="font-semibold text-sm">Key Contacts</h4>
                              </div>
                              <div className="space-y-3">
                                {results.contacts.map((contact, index) => (
                                  <div
                                    key={index}
                                    className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-primary/20 transition-colors"
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <p className="font-semibold mb-1">{contact.name}</p>
                                        <p className="text-sm text-muted-foreground mb-2">{contact.role}</p>
                                        <a
                                          href={contact.linkedIn}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                                        >
                                          View LinkedIn Profile →
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
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
