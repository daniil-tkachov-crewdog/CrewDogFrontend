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
        return "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
      case "Pro":
        return "bg-primary/10 border-primary/20 text-primary";
      default:
        return "bg-muted/50 border-border text-muted-foreground";
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
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Subtle tech background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <Topbar />

      {/* Floating Quota Badge */}
      <div className="fixed top-20 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`backdrop-blur-lg px-3 py-1.5 rounded-full shadow-lg border ${getPlanColor()}`}
        >
          <div className="flex items-center gap-2 text-xs font-medium">
            {getPlanIcon()}
            <span>{plan}</span>
            {!hasUnlimitedSearches && (
              <>
                <span className="opacity-40">•</span>
                <span className="tabular-nums">{searchesUsed}/{totalSearches}</span>
              </>
            )}
            {hasUnlimitedSearches && (
              <>
                <span className="opacity-40">•</span>
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
                  <Card className="relative backdrop-blur-xl bg-card/80 border-2 border-primary/10 p-8 shadow-xl">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] rounded-lg pointer-events-none" />
                    
                    <div className="relative">
                      <div className="mb-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-3">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-semibold mb-1">AI Job Search</h1>
                        <p className="text-sm text-muted-foreground">Find companies and decision makers instantly</p>
                      </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div className="group">
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/jobs/..."
                        value={jobUrl}
                        onChange={(e) => {
                          setJobUrl(e.target.value);
                          if (e.target.value) setJobDescription("");
                        }}
                        className="h-11 border-border/50 bg-background/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-card px-3 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">or</span>
                      </div>
                    </div>

                    <div className="group">
                      <Textarea
                        placeholder="Paste full job description...&#10;&#10;• Minimum 300 characters&#10;• Include location&#10;• More detail = better results"
                        value={jobDescription}
                        onChange={(e) => {
                          setJobDescription(e.target.value);
                          if (e.target.value) setJobUrl("");
                        }}
                        className="min-h-[130px] resize-none border-border/50 bg-background/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                        disabled={isLoading}
                      />
                      {jobDescription && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                              style={{ width: `${Math.min((jobDescription.length / 300) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground tabular-nums">
                            {jobDescription.length}/300
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-3.5 border border-primary/10 rounded-lg cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all group">
                    <input
                      type="checkbox"
                      checked={includeLeads}
                      onChange={(e) => setIncludeLeads(e.target.checked)}
                      className="w-4 h-4 rounded border-input accent-primary"
                      disabled={isLoading}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Include potential leads</div>
                      <div className="text-xs text-muted-foreground">Find additional contacts beyond hiring managers</div>
                    </div>
                    <Sparkles className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
                  </label>

                  <Button
                    type="submit"
                    className="w-full h-11 gap-2 font-medium shadow-lg hover:shadow-xl transition-all"
                    disabled={isLoading || (!jobUrl && !jobDescription) || !canSearch}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Run AI Search
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
                    </div>
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
                  <Card className="backdrop-blur-xl bg-card/80 border-2 border-primary/10 p-6 h-full shadow-lg">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <h2 className="text-sm font-semibold">Search Query</h2>
                    </div>
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
                          className="h-9 text-sm border-border/50 bg-background/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                          disabled={isLoading}
                        />

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border/50" />
                          </div>
                          <div className="relative flex justify-center">
                            <span className="bg-card px-2 text-xs text-muted-foreground/70 uppercase tracking-wide">or</span>
                          </div>
                        </div>

                        <Textarea
                          placeholder="Job description..."
                          value={jobDescription}
                          onChange={(e) => {
                            setJobDescription(e.target.value);
                            if (e.target.value) setJobUrl("");
                          }}
                          className="min-h-[80px] resize-none text-sm border-border/50 bg-background/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                          disabled={isLoading}
                        />
                        {jobDescription && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-muted/50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                                style={{ width: `${Math.min((jobDescription.length / 300) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground tabular-nums">{jobDescription.length}/300</span>
                          </div>
                        )}
                      </div>

                      <label className="flex items-center gap-2 p-2.5 border border-primary/10 rounded cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all">
                        <input
                          type="checkbox"
                          checked={includeLeads}
                          onChange={(e) => setIncludeLeads(e.target.checked)}
                          className="w-4 h-4 rounded accent-primary"
                          disabled={isLoading}
                        />
                        <span className="text-xs font-medium">Include leads</span>
                      </label>

                      <Button
                        type="submit"
                        className="w-full h-9 text-sm gap-2 shadow-md hover:shadow-lg transition-all"
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
