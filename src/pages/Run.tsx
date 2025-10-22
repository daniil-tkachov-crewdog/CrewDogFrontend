import { useState } from "react";
import { Link } from "react-router-dom";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, ExternalLink, CheckCircle, ArrowLeft } from "lucide-react";

export default function Run() {
  const { user, isAuthenticated } = useMockAuth();
  const [includeLeads, setIncludeLeads] = useState(false);
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState("");

  // User's plan data
  const plan = user?.plan || "Free";
  const quota = { used: 2, total: isAuthenticated ? 3 : 1 };
  const renewalDate = "30 days";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!jobUrl && !jobDescription) {
      setError("Please provide either a job URL or job description");
      return;
    }

    if (jobDescription && jobDescription.length < 300) {
      setError("Job description must be at least 300 characters");
      return;
    }

    if (jobDescription && !jobDescription.toLowerCase().includes("location")) {
      setError("Job description must include location information");
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResults({
        company: "TechCorp Industries",
        website: "https://techcorp.example.com",
        careerPage: "https://techcorp.example.com/careers",
        contacts: [
          { name: "Sarah Johnson", role: "Hiring Manager", linkedIn: "https://linkedin.com/in/sarah-johnson" },
          { name: "Mike Chen", role: "HR Director", linkedIn: "https://linkedin.com/in/mike-chen" }
        ]
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Plan Strip */}
          <Card className="p-4 mb-6 glass-card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {plan}
                </div>
                <div className="text-sm">
                  <span className="font-medium">{quota.used}/{quota.total}</span>
                  <span className="text-muted-foreground"> searches used</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Resets in {renewalDate}
                </div>
              </div>
              <Link to="/pricing">
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 glass-card">
                <h1 className="text-2xl font-bold mb-6">Run Job Search</h1>

                {/* Alert */}
                <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Before you run your search:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Job description must be at least 300 characters</li>
                        <li>• Must include location information</li>
                        <li>• More details = better results</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Include Leads Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="leads" 
                      checked={includeLeads}
                      onCheckedChange={(checked) => setIncludeLeads(checked as boolean)}
                    />
                    <label
                      htmlFor="leads"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Include potential leads search?
                    </label>
                  </div>

                  {/* Job URL */}
                  <div className="space-y-2">
                    <Label htmlFor="jobUrl">Job URL (LinkedIn)</Label>
                    <Input
                      id="jobUrl"
                      type="url"
                      placeholder="https://linkedin.com/jobs/view/..."
                      value={jobUrl}
                      onChange={(e) => {
                        setJobUrl(e.target.value);
                        if (e.target.value) setJobDescription("");
                      }}
                      className="h-11"
                    />
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    OR
                  </div>

                  {/* Job Description */}
                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">
                      Job Description
                      <span className="text-muted-foreground ml-2">
                        ({jobDescription.length} / 300+ chars)
                      </span>
                    </Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="Paste the full job description here..."
                      value={jobDescription}
                      onChange={(e) => {
                        setJobDescription(e.target.value);
                        if (e.target.value) setJobUrl("");
                      }}
                      className="min-h-[200px]"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 magnetic-button" 
                    size="lg"
                    disabled={isLoading || (!jobUrl && !jobDescription)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Run Search"
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 glass-card h-full">
                <h2 className="text-2xl font-bold mb-6">Results</h2>

                <AnimatePresence mode="wait">
                  {!results && !isLoading && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-64 text-center"
                    >
                      <div className="space-y-2">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-muted-foreground">
                          Results will appear here after you run a search
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {isLoading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-64"
                    >
                      <div className="text-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                        <div className="space-y-2">
                          <p className="font-medium">Analyzing job posting...</p>
                          <p className="text-sm text-muted-foreground">Tracing employer information</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {results && !isLoading && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Search Complete</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Company</h3>
                          <p className="text-lg font-semibold">{results.company}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Links</h3>
                          <div className="space-y-2">
                            <a 
                              href={results.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-primary hover:underline"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Company Website
                            </a>
                            <a 
                              href={results.careerPage} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-primary hover:underline"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Careers Page
                            </a>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Contacts</h3>
                          <div className="space-y-3">
                            {results.contacts.map((contact: any, index: number) => (
                              <div key={index} className="p-3 rounded-lg bg-muted/50">
                                <p className="font-medium">{contact.name}</p>
                                <p className="text-sm text-muted-foreground">{contact.role}</p>
                                <a 
                                  href={contact.linkedIn} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  LinkedIn Profile
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}