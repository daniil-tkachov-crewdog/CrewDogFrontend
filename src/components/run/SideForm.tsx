import { FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Sparkles } from "lucide-react";
import type { SearchResultsFeedbackOption } from "@/services/support";

type Props = {
  jobUrl: string;
  setJobUrl: (v: string) => void;
  jobDescription: string;
  setJobDescription: (v: string) => void;
  includeLeads: boolean;
  setIncludeLeads: (v: boolean) => void;
  outreachMessage: boolean;
  setOutreachMessage: (v: boolean) => void;
  isLoading: boolean;
  canSearch: boolean;
  onSubmit: (e: FormEvent) => void;
  onCustomise: () => void;
  feedbackOption: SearchResultsFeedbackOption | "";
  setFeedbackOption: (v: SearchResultsFeedbackOption) => void;
  customFeedback: string;
  setCustomFeedback: (v: string) => void;
  feedbackSubmitting: boolean;
  onFeedbackSubmit: () => void;
};

export default function SideForm({
  jobUrl,
  setJobUrl,
  jobDescription,
  setJobDescription,
  includeLeads,
  setIncludeLeads,
  outreachMessage,
  setOutreachMessage,
  isLoading,
  canSearch,
  onSubmit,
  onCustomise,
  feedbackOption,
  setFeedbackOption,
  customFeedback,
  setCustomFeedback,
  feedbackSubmitting,
  onFeedbackSubmit,
}: Props) {
  return (
    <Card className="glass-card p-6 h-full">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        Search Query
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-3">
          <Input
            type="url"
            placeholder="🔗 Job URL"
            value={jobUrl}
            onChange={(e) => {
              setJobUrl(e.target.value);
              if (e.target.value) setJobDescription("");
            }}
            className="h-11 text-sm border-primary/20 bg-background/50"
            disabled={isLoading}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Textarea
            placeholder="📝 Job description (include location)…"
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (e.target.value) setJobUrl("");
            }}
            className="min-h-[100px] resize-none text-sm border-primary/20 bg-background/50"
            disabled={isLoading}
          />

          <p className="text-xs text-muted-foreground/70">
            ⚠️ Location is mandatory for best results.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
            <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={includeLeads}
                    onChange={(e) => setIncludeLeads(e.target.checked)}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="w-8 h-4 bg-muted rounded-full peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent transition-all" />
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-background rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
                </div>
              <div className="flex-1">
                <p className="font-medium text-[11px] leading-tight">Leads</p>
              </div>
            </label>
          </div>

          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
            <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={outreachMessage}
                    onChange={(e) => setOutreachMessage(e.target.checked)}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="w-8 h-4 bg-muted rounded-full peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent transition-all" />
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-background rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
                </div>
              <div className="flex-1">
                <p className="font-medium text-[11px] leading-tight">Outreach</p>
              </div>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-sm gap-2 magnetic-button glow-effect"
          disabled={isLoading || (!jobUrl && !jobDescription) || !canSearch}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              New Search
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full h-10 text-sm font-semibold border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all duration-200"
          onClick={onCustomise}
          disabled={isLoading}
        >
          Customise your CV
        </Button>
        
        <div className="pt-2 border-t border-border/60 space-y-3">
          <h3 className="text-sm font-semibold">How do you find these results?</h3>

          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="results-feedback"
                checked={feedbackOption === "helpful"}
                onChange={() => setFeedbackOption("helpful")}
                className="accent-primary"
                disabled={feedbackSubmitting}
              />
              <span>It was quite helpful, thanks!</span>
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="results-feedback"
                checked={feedbackOption === "no_response"}
                onChange={() => setFeedbackOption("no_response")}
                className="accent-primary"
                disabled={feedbackSubmitting}
              />
              <span>I didn't get any response.</span>
            </label>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="results-feedback"
                checked={feedbackOption === "irrelevant"}
                onChange={() => setFeedbackOption("irrelevant")}
                className="accent-primary"
                disabled={feedbackSubmitting}
              />
              <span>These results are irrelevant!</span>
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="results-feedback"
                  checked={feedbackOption === "custom"}
                  onChange={() => setFeedbackOption("custom")}
                  className="accent-primary"
                  disabled={feedbackSubmitting}
                />
                <span>Your own feedback</span>
              </label>
              <Textarea
                placeholder="Write your own sentence..."
                value={customFeedback}
                onChange={(e) => {
                  setCustomFeedback(e.target.value);
                  if (e.target.value && feedbackOption !== "custom") {
                    setFeedbackOption("custom");
                  }
                }}
                className="min-h-[72px] resize-none text-sm border-primary/20 bg-background/50"
                disabled={feedbackSubmitting}
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={onFeedbackSubmit}
              disabled={
                feedbackSubmitting ||
                !feedbackOption ||
                (feedbackOption === "custom" && !customFeedback.trim())
              }
            >
              {feedbackSubmitting ? "Sending..." : "Send the feedback"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
