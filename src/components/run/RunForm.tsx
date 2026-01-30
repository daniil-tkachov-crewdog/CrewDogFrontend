import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export type RunFormValues = {
  jobUrl: string;
  jobDescription: string;
  includeLeads: boolean;
  outreachMessage: boolean;
};

export default function RunForm({
  values,
  setValues,
  isLoading,
  onSubmit,
  compact = false,
}: {
  values: RunFormValues;
  setValues: (v: RunFormValues) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  compact?: boolean;
}) {
  const { jobUrl, jobDescription, includeLeads, outreachMessage } = values;
  const jdLen = jobDescription?.length ?? 0;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-5">
        {!compact && (
          <div className="group">
            <label className="block text-sm font-medium mb-2 text-foreground/80">
              LinkedIn Job URL
            </label>
            <div className="relative">
              <Input
                type="url"
                placeholder="https://linkedin.com/jobs/..."
                value={jobUrl}
                onChange={(e) =>
                  setValues({
                    ...values,
                    jobUrl: e.target.value,
                    jobDescription: e.target.value ? "" : values.jobDescription,
                  })
                }
                className="h-14 text-base pl-4 pr-4 bg-background/60 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 focus:border-primary/40 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md focus:shadow-lg"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {compact && (
          <>
            <Input
              type="url"
              placeholder="🔗 Job URL"
              value={jobUrl}
              onChange={(e) =>
                setValues({
                  ...values,
                  jobUrl: e.target.value,
                  jobDescription: e.target.value ? "" : values.jobDescription,
                })
              }
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
          </>
        )}

        <div className="group">
          {!compact && (
            <label className="block text-sm font-medium mb-2 text-foreground/80">
              Job Description
            </label>
          )}
          <Textarea
            placeholder="Paste full description (include location)…"
            value={jobDescription}
            onChange={(e) =>
              setValues({
                ...values,
                jobDescription: e.target.value,
                jobUrl: e.target.value ? "" : values.jobUrl,
              })
            }
            className={
              compact
                ? "min-h-[100px] resize-none text-sm border-primary/20 bg-background/50"
                : "min-h-[160px] resize-none text-base p-4 bg-background/60 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 focus:border-primary/40 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md focus:shadow-lg"
            }
            disabled={isLoading}
          />
          {jobDescription && (
            <div className={`mt-3 ${compact ? "" : "space-y-2"}`}>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-primary to-accent transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min((jdLen / 300) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-muted-foreground min-w-[90px] text-right tabular-nums">
                  {jdLen} / 300
                </span>
              </div>
            </div>
          )}
          {!compact && (
            <p className="mt-2 text-xs text-muted-foreground/70">
              ⚠️ Location is mandatory for best results.
            </p>
          )}
        </div>
      </div>

      {/* Include Leads Toggle */}
      <div
        className={
          compact
            ? "p-3 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
            : "relative group"
        }
      >
        {!compact && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        <div
          className={
            compact
              ? "flex items-center gap-2 cursor-pointer group"
              : "relative p-5 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-background/50 to-accent/[0.07] border-2 border-primary/10 backdrop-blur-sm hover:border-primary/20 transition-all duration-300"
          }
        >
          <label className="flex items-center gap-4 cursor-pointer">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={values.includeLeads}
                onChange={(e) =>
                  setValues({ ...values, includeLeads: e.target.checked })
                }
                className="sr-only peer"
                disabled={isLoading}
              />
              <div
                className={
                  compact
                    ? "w-9 h-5 bg-muted rounded-full peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent transition-all"
                    : "w-14 h-7 bg-muted/80 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent transition-all duration-300 shadow-inner"
                }
              />
              <div
                className={
                  compact
                    ? "absolute left-0.5 top-0.5 w-4 h-4 bg-background rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"
                    : "absolute left-1 top-1 w-5 h-5 bg-background rounded-full transition-all duration-300 peer-checked:translate-x-7 shadow-lg"
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold ${
                  compact ? "text-xs" : "text-base"
                } mb-0.5`}
              >
                Include Potential Leads Search
              </p>
              <p className="text-xs text-muted-foreground">
                Find additional decision-makers
              </p>
            </div>
            {!compact && (
              <Sparkles className="h-6 w-6 text-primary/70 flex-shrink-0 group-hover:text-primary transition-colors" />
            )}
          </label>
        </div>
      </div>

      {/* Outreach Message Toggle */}
      <div
        className={
          compact
            ? "p-3 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
            : "relative group"
        }
      >
        {!compact && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        <div
          className={
            compact
              ? "flex items-center gap-2 cursor-pointer group"
              : "relative p-5 rounded-2xl bg-gradient-to-br from-primary/[0.07] via-background/50 to-accent/[0.07] border-2 border-primary/10 backdrop-blur-sm hover:border-primary/20 transition-all duration-300"
          }
        >
          <label className="flex items-center gap-4 cursor-pointer">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={values.outreachMessage}
                onChange={(e) =>
                  setValues({ ...values, outreachMessage: e.target.checked })
                }
                className="sr-only peer"
                disabled={isLoading}
              />
              <div
                className={
                  compact
                    ? "w-9 h-5 bg-muted rounded-full peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent transition-all"
                    : "w-14 h-7 bg-muted/80 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent transition-all duration-300 shadow-inner"
                }
              />
              <div
                className={
                  compact
                    ? "absolute left-0.5 top-0.5 w-4 h-4 bg-background rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"
                    : "absolute left-1 top-1 w-5 h-5 bg-background rounded-full transition-all duration-300 peer-checked:translate-x-7 shadow-lg"
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold ${
                  compact ? "text-xs" : "text-base"
                } mb-0.5`}
              >
                Outreach Message
              </p>
              <p className="text-xs text-muted-foreground">
                Enable outreach messaging
              </p>
            </div>
            {!compact && (
              <Sparkles className="h-6 w-6 text-primary/70 flex-shrink-0 group-hover:text-primary transition-colors" />
            )}
          </label>
        </div>
      </div>

      {/* CTA */}
      <Button
        type="submit"
        className={
          compact
            ? "w-full h-11 text-sm gap-2"
            : "w-full h-16 text-lg gap-3 font-bold relative overflow-hidden group bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 rounded-xl"
        }
        disabled={isLoading || (!jobUrl && !jobDescription)}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {compact ? (
              "Searching..."
            ) : (
              <span className="relative z-10">Analyzing with AI</span>
            )}
          </>
        ) : (
          <>
            {!compact && (
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
            {!compact && (
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat group-hover:bg-[position:200%_0,0_0] transition-[background-position] duration-1000" />
            )}
            <Send className="h-4 w-4" />
            {compact ? (
              "New Search"
            ) : (
              <span className="relative z-10">Run AI Search</span>
            )}
          </>
        )}
      </Button>
    </form>
  );
}
