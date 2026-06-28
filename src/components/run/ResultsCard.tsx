// src/components/run/ResultsCard.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { pushContactToBullhorn } from "@/services/bullhorn";

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
  return (
    name
      .split(/[\s-]+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "•"
  );
}

const cardEnter = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

const labelCls =
  "font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.16em] text-[#6F6C78]";

/* Push-to-Bullhorn button with per-row state. Only rendered when connected. */
type PushState = "idle" | "pushing" | "pushed" | "duplicate" | "error";

function PushToBullhornButton({
  contact,
}: {
  contact: { name: string; role?: string; linkedIn?: string };
}) {
  const [state, setState] = useState<PushState>("idle");

  async function handlePush() {
    if (state === "pushing" || state === "pushed") return;
    setState("pushing");
    try {
      const res = await pushContactToBullhorn(contact);
      if (res.duplicate) {
        setState("duplicate");
        toast.info(`${contact.name} already exists in Bullhorn.`);
      } else {
        setState("pushed");
        toast.success(
          res.candidateId
            ? `Pushed to Bullhorn (#${res.candidateId}).`
            : "Pushed to Bullhorn.",
        );
      }
    } catch (e: any) {
      setState("error");
      toast.error(e?.message || "Could not push to Bullhorn.");
    }
  }

  const label =
    state === "pushing"
      ? "Pushing…"
      : state === "pushed"
        ? "In Bullhorn"
        : state === "duplicate"
          ? "Duplicate"
          : state === "error"
            ? "Retry"
            : "Bullhorn";

  const done = state === "pushed" || state === "duplicate";

  return (
    <button
      type="button"
      onClick={handlePush}
      disabled={state === "pushing" || done}
      title="Push to Bullhorn"
      className="whitespace-nowrap rounded-[2px] border border-[#FF5A1F]/[0.35] px-3 py-[7px] font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.06em] text-[#FF5A1F] transition-colors hover:bg-[#FF5A1F]/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="inline-flex items-center gap-1.5">
        {state === "pushing" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : done ? (
          <Check className="h-3 w-3" />
        ) : (
          <Upload className="h-3 w-3" />
        )}
        {label}
      </span>
    </button>
  );
}

/* A single contact / lead row, prototype `.contact` style. */
function ContactRow({
  name,
  sub,
  href,
  cta,
  pushContact,
}: {
  name: string;
  sub?: string;
  href?: string;
  cta: string;
  pushContact?: { name: string; role?: string; linkedIn?: string };
}) {
  return (
    <div className="flex items-center gap-4 border-t border-[#E4E1D9] py-4 first:border-t-0">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#E4E1D9] bg-[#F4F2EE] font-['IBM_Plex_Mono',monospace] text-[14px] font-semibold text-[#FF5A1F]">
        {getInitials(name)}
      </div>
      <div className="min-w-0">
        <div className="truncate text-[15px] font-semibold tracking-[-0.01em]">
          {name}
        </div>
        {sub && <div className="truncate text-[13px] text-[#55525E]">{sub}</div>}
      </div>
      <div className="ml-auto flex items-center gap-2">
        {pushContact && <PushToBullhornButton contact={pushContact} />}
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-[2px] border border-[#FF5A1F]/[0.35] px-3 py-[7px] font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.06em] text-[#FF5A1F] transition-colors hover:bg-[#FF5A1F]/[0.08]"
          >
            {cta} ↗
          </a>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ResultsCard({
  results,
  bullhornConnected = false,
}: {
  results: Results;
  bullhornConnected?: boolean;
}) {
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
  const hasSources = !!(results.website || results.careerPage);

  return (
    <div className="grid gap-[18px]">
      {/* ── Likely end client ── */}
      <motion.div
        {...cardEnter}
        className="overflow-hidden rounded-md border border-[#E4E1D9] bg-white"
      >
        <div className="flex items-center gap-[18px] border-b border-[#E4E1D9] px-7 py-[26px]">
          <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-[4px] bg-[#FF5A1F] font-['IBM_Plex_Mono',monospace] text-[20px] font-bold text-[#0B0B0F]">
            {(results.company?.[0] ?? "?").toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className={labelCls + " text-[#FF5A1F]"}>Likely end client</span>
            <h2 className="mt-1 truncate text-[26px] tracking-[-0.02em]">
              {results.company}
            </h2>
          </div>
        </div>

        {(results.sniff_out_clues || hasSources) && (
          <div className="px-7 py-6">
            {results.sniff_out_clues && (
              <>
                <div className={labelCls + " mb-[14px]"}>Why this company</div>
                <p className="max-w-[54ch] text-[15px] leading-[1.6] text-[#55525E]">
                  {results.sniff_out_clues}
                </p>
              </>
            )}

            {hasSources && (
              <div className="mt-5 flex flex-wrap gap-2">
                {results.website && (
                  <a
                    href={results.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[2px] border border-[#FF5A1F]/[0.35] px-3 py-[7px] font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.06em] text-[#FF5A1F] transition-colors hover:bg-[#FF5A1F]/[0.08]"
                  >
                    {getHost(results.website) || "Website"} ↗
                  </a>
                )}
                {results.careerPage && (
                  <a
                    href={results.careerPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[2px] border border-[#FF5A1F]/[0.35] px-3 py-[7px] font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.06em] text-[#FF5A1F] transition-colors hover:bg-[#FF5A1F]/[0.08]"
                  >
                    Careers ↗
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* ── Outreach message (kept feature) ── */}
      {results.outreach_message && (
        <motion.div
          {...cardEnter}
          className="overflow-hidden rounded-md border border-[#E4E1D9] bg-white"
        >
          <div className="flex items-center justify-between gap-4 border-b border-[#E4E1D9] px-7 py-[18px]">
            <span className={labelCls + " text-[#FF5A1F]"}>Outreach message</span>
            <button
              type="button"
              onClick={handleCopyOutreach}
              className="inline-flex items-center gap-1.5 rounded-[2px] border border-[#FF5A1F]/[0.35] px-3 py-[6px] font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.06em] text-[#FF5A1F] transition-colors hover:bg-[#FF5A1F]/[0.08]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </button>
          </div>
          <div className="px-7 py-6">
            <p className="whitespace-pre-wrap text-[15px] leading-[1.6] text-[#55525E]">
              {results.outreach_message}
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Likely contacts ── */}
      {hasContacts && (
        <motion.div
          {...cardEnter}
          className="overflow-hidden rounded-md border border-[#E4E1D9] bg-white"
        >
          <div className="flex items-center gap-[18px] border-b border-[#E4E1D9] px-7 py-[26px]">
            <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-[4px] bg-[#FF5A1F] font-['IBM_Plex_Mono',monospace] text-[20px] font-bold text-[#0B0B0F]">
              →
            </div>
            <div>
              <span className={labelCls + " text-[#FF5A1F]"}>Worth approaching</span>
              <h2 className="mt-1 text-[20px] tracking-[-0.02em]">Likely contacts</h2>
            </div>
          </div>
          <div className="px-7 py-2">
            {results.contacts!.map((c, i) => (
              <ContactRow
                key={`${c.linkedIn || c.name}-${i}`}
                name={c.name}
                sub={c.role}
                href={c.linkedIn}
                cta="LinkedIn"
                pushContact={
                  bullhornConnected
                    ? { name: c.name, role: c.role, linkedIn: c.linkedIn }
                    : undefined
                }
              />
            ))}
          </div>
          <div className="flex items-center gap-[10px] border-t border-[#E4E1D9] px-7 py-4 font-['IBM_Plex_Mono',monospace] text-[11px] tracking-[0.06em] text-[#6F6C78]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#FF5A1F]" />
            Radar Contact · Direct tier
          </div>
        </motion.div>
      )}

      {/* ── Extra leads ── */}
      {hasLeads && (
        <motion.div
          {...cardEnter}
          className="overflow-hidden rounded-md border border-[#E4E1D9] bg-white"
        >
          <div className="flex items-center gap-[18px] border-b border-[#E4E1D9] px-7 py-[26px]">
            <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-[4px] bg-[#FF5A1F] font-['IBM_Plex_Mono',monospace] text-[16px] font-bold text-[#0B0B0F]">
              +
            </div>
            <div>
              <span className={labelCls + " text-[#FF5A1F]"}>Wider net</span>
              <h2 className="mt-1 text-[20px] tracking-[-0.02em]">Extra leads</h2>
            </div>
          </div>
          <div className="px-7 py-2">
            {results.leads!.map((p, i) => (
              <ContactRow
                key={`${p.url}-${i}`}
                name={p.name}
                sub={getHost(p.url)}
                href={p.url}
                cta="Open"
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
