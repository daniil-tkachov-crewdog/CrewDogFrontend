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
import { Loader2, Sparkles, Zap, Crown, ArrowLeft, Send } from "lucide-react";
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

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Premium Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
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
        <div className="container mx-auto px-4 max-w-4xl flex-1 flex flex-col py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {/* Chat-like Interface */}
          <div className="flex-1 flex flex-col gap-6 max-w-3xl mx-auto w-full">

            {/* Results Display */}
            <AnimatePresence mode="wait">
              {results && !isLoading && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4"
                >
                  <Card className="glass-card p-6 glow-effect">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 animate-glow-pulse">
                          <Sparkles className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Company Found</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                              {results.company}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Resources</p>
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={results.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                              >
                                🌐 Website
                              </a>
                              <a
                                href={results.careerPage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                              >
                                💼 Careers
                              </a>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-sm font-medium text-muted-foreground">Key Contacts</p>
                            {results.contacts.map((contact, index) => (
                              <div key={index} className="p-4 rounded-lg bg-muted/50 space-y-1">
                                <p className="font-semibold">{contact.name}</p>
                                <p className="text-sm text-muted-foreground">{contact.role}</p>
                                <a
                                  href={contact.linkedIn}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  LinkedIn Profile →
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4"
                >
                  <Card className="glass-card p-6">
                    <div className="flex items-center gap-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <div className="space-y-1">
                        <p className="font-medium">Analyzing with AI...</p>
                        <p className="text-sm text-muted-foreground">
                          Tracing company information and contacts
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card p-8 border-primary/10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Input
                      type="url"
                      placeholder="🔗 Paste LinkedIn job URL here..."
                      value={jobUrl}
                      onChange={(e) => {
                        setJobUrl(e.target.value);
                        if (e.target.value) setJobDescription("");
                      }}
                      className="h-14 text-base border-primary/20 focus:border-primary/40 bg-background/50"
                      disabled={isLoading}
                    />

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-3 py-1 rounded-full text-muted-foreground font-medium">
                          or paste description
                        </span>
                      </div>
                    </div>

                    <Textarea
                      placeholder="📝 Paste full job description here...&#10;&#10;Requirements:&#10;• Minimum 300 characters&#10;• Include location information&#10;• More details = better results"
                      value={jobDescription}
                      onChange={(e) => {
                        setJobDescription(e.target.value);
                        if (e.target.value) setJobUrl("");
                      }}
                      className="min-h-[140px] resize-none text-base border-primary/20 focus:border-primary/40 bg-background/50"
                      disabled={isLoading}
                    />
                    {jobDescription && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                            style={{ width: `${Math.min((jobDescription.length / 300) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium min-w-[80px] text-right">
                          {jobDescription.length} / 300
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Include Leads Option */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={includeLeads}
                          onChange={(e) => setIncludeLeads(e.target.checked)}
                          className="sr-only peer"
                          disabled={isLoading}
                        />
                        <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent transition-all duration-300" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full transition-transform duration-300 peer-checked:translate-x-5 shadow-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                          Include Potential Leads Search
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Find additional contacts beyond hiring managers
                        </p>
                      </div>
                      <Sparkles className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" />
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-base gap-3 magnetic-button glow-effect font-semibold relative overflow-hidden group"
                    disabled={isLoading || (!jobUrl && !jobDescription) || !canSearch}
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-20 transition-opacity" />
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing with AI
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Run AI Search
                        <Send className="h-5 w-5" />
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
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
