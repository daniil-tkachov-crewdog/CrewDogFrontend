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
    <div className="min-h-screen flex flex-col bg-background">
      <Topbar />

      <main className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 max-w-5xl flex-1 flex flex-col py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Premium Plan Badge */}
          <div className="mb-6">
            <Card className="glass-card overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getPlanColor()}`}>
                    {getPlanIcon()}
                    {plan} Plan
                  </div>
                  {!hasUnlimitedSearches ? (
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">{searchesUsed}</span>
                      <span className="text-muted-foreground"> / {totalSearches} searches used</span>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">∞</span>
                      <span className="text-muted-foreground"> Unlimited searches</span>
                    </div>
                  )}
                </div>
                {plan !== "Admin" && (
                  <Link to="/pricing">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Zap className="h-4 w-4" />
                      Upgrade
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>

          {/* Chat-like Interface */}
          <div className="flex-1 flex flex-col gap-4 max-w-3xl mx-auto w-full">
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Card className="glass-card p-6 border-primary/20">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">AI Job Search Assistant</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      I'll help you find company information and key contacts from job postings.
                      Simply paste a LinkedIn job URL or provide a detailed job description (300+ characters with location).
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

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
              <Card className="glass-card p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="Paste LinkedIn job URL..."
                      value={jobUrl}
                      onChange={(e) => {
                        setJobUrl(e.target.value);
                        if (e.target.value) setJobDescription("");
                      }}
                      className="h-12 text-base"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="h-px bg-border flex-1" />
                    <span>OR</span>
                    <div className="h-px bg-border flex-1" />
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Paste full job description here (min. 300 characters, include location)..."
                      value={jobDescription}
                      onChange={(e) => {
                        setJobDescription(e.target.value);
                        if (e.target.value) setJobUrl("");
                      }}
                      className="min-h-[120px] resize-none text-base"
                      disabled={isLoading}
                    />
                    {jobDescription && (
                      <p className="text-xs text-muted-foreground">
                        {jobDescription.length} / 300 characters
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base gap-2 magnetic-button"
                    disabled={isLoading || (!jobUrl && !jobDescription) || !canSearch}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Run AI Search
                      </>
                    )}
                  </Button>

                  {!canSearch && !hasUnlimitedSearches && (
                    <p className="text-sm text-center text-muted-foreground">
                      Search limit reached.{" "}
                      <Link to="/pricing" className="text-primary hover:underline">
                        Upgrade to continue
                      </Link>
                    </p>
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
