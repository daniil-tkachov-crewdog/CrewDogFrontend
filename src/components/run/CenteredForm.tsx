import { FormEvent, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, Loader2, Send, Sparkles, Upload, X } from "lucide-react";
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
};

export default function CenteredForm({
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
}: Props) {
  const jdLen = jobDescription?.length ?? 0;
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

  return (
    <Card className="glass-card p-12 border-primary/10 shadow-2xl backdrop-blur-xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Search Assistant
        </h1>
        <p className="text-muted-foreground">
          Discover companies and key contacts from any job posting
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-5">
          <div className="group">
            <label className="block text-sm font-medium mb-2 text-foreground/80">
              LinkedIn Job URL
            </label>
            <div className="relative">
              <Input
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
                className="h-14 text-base pl-4 pr-4 bg-background/60 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 focus:border-primary/40 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md focus:shadow-lg"
                disabled={urlDisabled}
              />
            </div>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-6 py-1.5 text-xs font-semibold text-muted-foreground/60 tracking-wider uppercase rounded-full border border-border/50">
                Or provide details
              </span>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium mb-2 text-foreground/80">
              Job Description
            </label>
            <Textarea
              placeholder="Paste the complete job description here (include location)…"
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
              className="min-h-[160px] resize-none text-base p-4 bg-background/60 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 focus:border-primary/40 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md focus:shadow-lg"
              disabled={jdDisabled}
            />
            {jobDescription && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                    {/* <div
                      className="h-full bg-gradient-to-r from-primary via-primary to-accent transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.min((jdLen / 300) * 100, 100)}%`,
                      }}
                    /> */}
                  </div>
                  {/* <span className="text-xs font-semibold text-muted-foreground min-w-[90px] text-right tabular-nums">
                    {jdLen} / 300
                  </span> */}
                </div>
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground/70">
              ⚠️ Location is mandatory for best results.
            </p>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-6 py-1.5 text-xs font-semibold text-muted-foreground/60 tracking-wider uppercase rounded-full border border-border/50">
                Or upload your CV
              </span>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium mb-2 text-foreground/80">
              CV (PDF)
            </label>
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
              className="flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 transition-all duration-200 py-8 px-4 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cvFile ? (
                <>
                  <FileText className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-foreground truncate max-w-full px-4">
                    {cvFile.name}
                  </span>
                  <span className="text-xs text-muted-foreground">Click to change</span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Click to upload your CV
                  </span>
                  <span className="text-xs text-muted-foreground">PDF only</span>
                </>
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
                className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" /> Remove
              </button>
            )}
            {cvFileError && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium">{cvFileError}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-background/50 to-accent/[0.07] border-2 border-primary/10 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={includeLeads}
                    onChange={(e) => setIncludeLeads(e.target.checked)}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-muted/80 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent transition-all duration-300 shadow-inner" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-0">Leads Search</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Decision-makers
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-background/50 to-accent/[0.07] border-2 border-primary/10 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={outreachMessage}
                    onChange={(e) => setOutreachMessage(e.target.checked)}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-muted/80 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent transition-all duration-300 shadow-inner" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-0">Outreach</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Messaging
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-16 text-lg gap-3 font-bold relative overflow-hidden group bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 rounded-xl"
          disabled={isLoading || (!jobUrl && !jobDescription && !cvFile) || !canSearch}
          size="lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat group-hover:bg-[position:200%_0,0_0] transition-[background-position] duration-1000" />
          {isLoading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin relative z-10" />
              <span className="relative z-10">Analyzing with AI</span>
            </>
          ) : (
            <>
              <Sparkles className="h-6 w-6 relative z-10" />
              <span className="relative z-10">Run AI Search</span>
              <Send className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 text-base font-semibold border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-200 rounded-xl"
          onClick={onCustomise}
          disabled={isLoading}
        >
          Customise your CV
        </Button>


      </form>
    </Card>
  );
}
