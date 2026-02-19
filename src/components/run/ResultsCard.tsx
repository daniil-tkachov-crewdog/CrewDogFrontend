// src/components/run/ResultsCard.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Globe,
  Briefcase,
  Users2,
  Info,
  UserSearch,
  ExternalLink,
  MessageSquareText,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Results = {
  company: string;
  website?: string;
  careerPage?: string;
  contacts?: Array<{ name: string; role?: string; linkedIn?: string }>;
  sniff_out_clues?: string;
  outreach_message?: string;
  leads?: Array<{ name: string; url: string }>;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getHost(url?: string) {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
}

function getInitials(name: string) {
  return name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function SectionHeader({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h4 className="font-semibold text-sm tracking-tight">{title}</h4>
      {count != null && count > 0 && (
        <Badge
          variant="secondary"
          className="ml-auto text-[10px] px-2 py-0.5 font-medium"
        >
          {count}
        </Badge>
      )}
    </div>
  );
}

function PersonCard({
  name,
  subline,
  href,
  icon: Icon,
  cta = "View profile",
  index = 0,
}: {
  name: string;
  subline?: string;
  href?: string;
  icon: React.ElementType;
  cta?: string;
  index?: number;
}) {
  const initials = getInitials(name);

  const inner = (
    <div className="flex items-center gap-3.5">
      {/* Avatar */}
      <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-colors duration-300">
        <span className="text-xs font-bold text-primary/80 group-hover:text-primary transition-colors">
          {initials || <Icon className="h-4 w-4" />}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm truncate leading-tight">{name}</p>
        {subline && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {subline}
          </p>
        )}
      </div>

      {/* CTA icon */}
      {href && (
        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ExternalLink className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
    </div>
  );

  return (
    <motion.div variants={fadeUp}>
      <div className="group rounded-xl border border-border/40 bg-gradient-to-br from-muted/40 to-transparent p-3.5 hover:border-primary/25 hover:bg-muted/60 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
            aria-label={`${cta}: ${name}`}
          >
            {inner}
          </a>
        ) : (
          inner
        )}
      </div>
    </motion.div>
  );
}

function ResourceLink({
  href,
  icon: Icon,
  label,
  sublabel,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  sublabel: string;
}) {
  return (
    <motion.a
      variants={fadeUp}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 hover:bg-muted/60 border border-transparent hover:border-primary/20 transition-all duration-300"
    >
      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {sublabel}
        </p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ResultsCard({ results }: { results: Results }) {
  const [copied, setCopied] = useState(false);

  function handleCopyOutreach() {
    if (!results.outreach_message) return;
    navigator.clipboard.writeText(results.outreach_message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const hasContacts =
    Array.isArray(results.contacts) && results.contacts.length > 0;
  const hasLeads = Array.isArray(results.leads) && results.leads.length > 0;
  const hasResources = !!(results.website || results.careerPage);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      <Card className="relative overflow-hidden border border-border/50 bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-xl shadow-xl">
        {/* Decorative gradient orb */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-accent/6 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-8 space-y-7">
          {/* ── Company Header ────────────────────────────── */}
          <motion.div variants={fadeUp} className="space-y-4">
            <div className="flex items-start gap-4">
              <motion.div
                className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Building2 className="h-7 w-7 text-primary-foreground" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Company Identified
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight truncate">
                  {results.company}
                </h3>
                {results.website && (
                  <a
                    href={results.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    <Globe className="h-3 w-3" />
                    {getHost(results.website)}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Insights ──────────────────────────────────── */}
          {results.sniff_out_clues && (
            <motion.div variants={fadeUp}>
              <div className="rounded-xl border border-border/30 bg-muted/20 p-4 space-y-2.5">
                <SectionHeader icon={Info} title="Why this company" />
                <p className="text-sm text-muted-foreground leading-relaxed pl-9">
                  {results.sniff_out_clues}
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Outreach Message ──────────────────────────── */}
          {results.outreach_message && (
            <motion.div variants={fadeUp}>
              <div className="rounded-xl border border-primary/15 bg-gradient-to-br from-primary/5 to-transparent p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <SectionHeader
                    icon={MessageSquareText}
                    title="Outreach Message"
                  />
                  <motion.button
                    type="button"
                    onClick={handleCopyOutreach}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                               bg-primary/10 text-primary hover:bg-primary/20
                               transition-colors duration-200"
                    aria-label="Copy outreach message"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </motion.button>
                </div>
                <div className="rounded-lg bg-background/60 border border-border/30 p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {results.outreach_message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Resources ─────────────────────────────────── */}
          {hasResources && (
            <motion.div variants={fadeUp} className="space-y-3">
              <SectionHeader icon={Globe} title="Resources" />
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {results.website && (
                  <ResourceLink
                    href={results.website}
                    icon={Globe}
                    label="Company Website"
                    sublabel={getHost(results.website) || "Visit site"}
                  />
                )}
                {results.careerPage && (
                  <ResourceLink
                    href={results.careerPage}
                    icon={Briefcase}
                    label="Careers Page"
                    sublabel={
                      getHost(results.careerPage) || "View open positions"
                    }
                  />
                )}
              </motion.div>
            </motion.div>
          )}

          {/* ── Key Contacts (HR) ─────────────────────────── */}
          {hasContacts && (
            <motion.div variants={fadeUp} className="space-y-3">
              <SectionHeader
                icon={Users2}
                title="Key Contacts"
                count={results.contacts!.length}
              />
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
              >
                {results.contacts!.map((c, i) => (
                  <PersonCard
                    key={`${c.linkedIn || c.name}-${i}`}
                    name={c.name}
                    subline={c.role}
                    href={c.linkedIn}
                    icon={Users2}
                    cta="View LinkedIn"
                    index={i}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── Potential Leads ────────────────────────────── */}
          {hasLeads && (
            <motion.div variants={fadeUp} className="space-y-3">
              <SectionHeader
                icon={UserSearch}
                title="Potential Leads"
                count={results.leads!.length}
              />
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
              >
                {results.leads!.map((p, i) => (
                  <PersonCard
                    key={`${p.url}-${i}`}
                    name={p.name}
                    subline={getHost(p.url)}
                    href={p.url}
                    icon={UserSearch}
                    cta="Open profile"
                    index={i}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── Footer accent ─────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-2 pt-2 text-[11px] text-muted-foreground/50"
          >
            <Sparkles className="h-3 w-3" />
            <span>Powered by AI analysis</span>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
