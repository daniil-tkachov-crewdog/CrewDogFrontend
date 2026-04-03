import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Calendar,
  History as HistoryIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Link as LinkIcon,
  Users,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  fetchSearchHistory,
  setContactStatuses,
  setImportantSearch,
  type HistoryItem,
} from "@/services/history";
import type { ContactStatus } from "@/types/account";

export default function SearchHistory() {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]); // cursor used to fetch page index
  const [nextCursors, setNextCursors] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [importantOnly, setImportantOnly] = useState(false);
  const [savingImportant, setSavingImportant] = useState<Record<string, boolean>>({});
  const [savingStatus, setSavingStatus] = useState<Record<string, boolean>>({});
  const [showFullJd, setShowFullJd] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setExpanded((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  const loadPage = async (target: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const cursor = cursorStack[target - 1] ?? null;
      const data = await fetchSearchHistory({ limit: 5, cursor });
      setItems(data.items || []);
      const nc = [...nextCursors];
      nc[target - 1] = data.nextCursor ?? null;
      setNextCursors(nc);
      setPage(target);
      if (data.nextCursor && !cursorStack[target]) {
        const ns = [...cursorStack];
        ns[target] = data.nextCursor;
        setCursorStack(ns);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1);
    // refresh when tab becomes visible
    const vis = () => {
      if (document.visibilityState === "visible") loadPage(1);
    };
    document.addEventListener("visibilitychange", vis);
    // listen for quota/search usage broadcast
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("gc-activity");
      bc.addEventListener("message", (e) => {
        if (e?.data?.type === "search_used") loadPage(1);
      });
    } catch {}
    return () => {
      document.removeEventListener("visibilitychange", vis);
      bc?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canPrev = page > 1;
  const canNext = Boolean(nextCursors[page - 1] || cursorStack[page]);
  const visibleItems = importantOnly
    ? items.filter((i) => i.isImportant)
    : items;

  const toggleImportant = async (it: HistoryItem) => {
    if (!it?.id) return;
    const next = !it.isImportant;
    setItems((prev) =>
      prev.map((x) => (x.id === it.id ? { ...x, isImportant: next } : x))
    );
    setSavingImportant((p) => ({ ...p, [it.id]: true }));
    try {
      await setImportantSearch(it.id, next);
    } catch {
      setItems((prev) =>
        prev.map((x) => (x.id === it.id ? { ...x, isImportant: !next } : x))
      );
    } finally {
      setSavingImportant((p) => ({ ...p, [it.id]: false }));
    }
  };

  const statusColor = (s: ContactStatus) => {
    if (s === "requested") return "text-orange-600 bg-orange-50 border-orange-200";
    if (s === "accepted") return "text-green-600 bg-green-50 border-green-200";
    if (s === "messaged") return "text-purple-600 bg-purple-50 border-purple-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const setStatus = async (
    item: HistoryItem,
    kind: "hr" | "lead",
    key: string,
    status: ContactStatus
  ) => {
    const mapKey = `${kind}:${key}`;
    const current = item.contactStatuses || {};
    const next = { ...current, [mapKey]: status };
    setItems((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, contactStatuses: next } : x))
    );
    setSavingStatus((p) => ({ ...p, [item.id]: true }));
    try {
      await setContactStatuses(item.id, next);
    } catch {
      setItems((prev) =>
        prev.map((x) =>
          x.id === item.id ? { ...x, contactStatuses: current } : x
        )
      );
    } finally {
      setSavingStatus((p) => ({ ...p, [item.id]: false }));
    }
  };

  const jdPreview = (it: HistoryItem) => {
    const base = (it.jdRaw || it.jdExcerpt || "").trim();
    if (!base) return it.sourceUrl || "No excerpt available.";
    if (showFullJd[it.id] || base.length <= 220) return base;
    return `${base.slice(0, 220)}...`;
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HistoryIcon className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Search History</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={importantOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setImportantOnly((v) => !v)}
          >
            <Star className="h-4 w-4 mr-1" />
            {importantOnly ? "Important only" : "All results"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => canPrev && loadPage(page - 1)}
            disabled={!canPrev || loading}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => canNext && loadPage(page + 1)}
            disabled={!canNext || loading}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <Card className="p-12 glass-card text-center">
          <HistoryIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No searches yet</h3>
          <p className="text-muted-foreground mb-6">
            {importantOnly
              ? "No starred searches yet."
              : "Start your first job search to see it here"}
          </p>
          <Link to="/run">
            <Button size="lg">
              <Briefcase className="mr-2 h-4 w-4" />
              Run Your First Search
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {visibleItems.map((it, idx) => {
            const created = it.createdAt
              ? new Date(it.createdAt).toLocaleString()
              : "";
            const status = "Completed";
            return (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="glass-card overflow-hidden">
                  <button
                    onClick={() => toggle(it.id)}
                    className="w-full p-6 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-lg mb-1">
                          {it.jobTitle || "Untitled role"}
                          {it.companyName ? ` — ${it.companyName}` : ""}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {created}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500 border-green-500/20"
                      >
                        <button
                          type="button"
                          disabled={savingImportant[it.id]}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void toggleImportant(it);
                          }}
                          className="mr-2"
                          aria-label="Mark important"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              it.isImportant
                                ? "fill-amber-400 text-amber-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                        {status}
                      </Badge>
                    </div>
                    <motion.div
                      animate={{ rotate: expanded.includes(it.id) ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <svg
                        className="h-5 w-5 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expanded.includes(it.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6"
                      >
                        <Separator className="mb-4" />
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">
                            Job description (excerpt)
                          </p>
                          <p className="text-sm whitespace-pre-wrap">
                            {jdPreview(it)}
                          </p>
                          {((it.jdRaw || it.jdExcerpt || "").trim().length > 220 ||
                            Boolean(it.sourceUrl)) && (
                            <button
                              className="mt-2 text-xs text-primary hover:underline"
                              onClick={() =>
                                setShowFullJd((p) => ({
                                  ...p,
                                  [it.id]: !p[it.id],
                                }))
                              }
                              type="button"
                            >
                              {showFullJd[it.id] ? "Show less" : "Show more"}
                            </button>
                          )}
                        </div>
                        <div className="mt-4 grid gap-3">
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">
                              Company website
                            </p>
                            {it.companyUrl ? (
                              <a
                                href={it.companyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline break-all"
                              >
                                <LinkIcon className="h-3.5 w-3.5" />
                                {it.companyUrl}
                              </a>
                            ) : (
                              <p className="text-sm">—</p>
                            )}
                          </div>

                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">
                              Source job link
                            </p>
                            {it.sourceUrl ? (
                              <a
                                href={it.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline break-all"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                {it.sourceUrl}
                              </a>
                            ) : (
                              <p className="text-sm">—</p>
                            )}
                          </div>

                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-1">
                              Why this company
                            </p>
                            <p className="text-sm whitespace-pre-wrap">
                              {it.whyCompany || "—"}
                            </p>
                          </div>

                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Key contacts
                            </p>
                            {it.hrContacts?.length ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {it.hrContacts.map((c, i) => {
                                  const key = c.profileUrl || c.name || `hr-${i}`;
                                  const st = (it.contactStatuses?.[`hr:${key}`] ||
                                    "none") as ContactStatus;
                                  return (
                                    <div
                                      key={`${it.id}-contact-${i}`}
                                      className="rounded-xl border bg-background p-3 flex items-start justify-between gap-3"
                                    >
                                      <div className="min-w-0">
                                        {c?.profileUrl ? (
                                          <a
                                            href={c.profileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-medium text-primary hover:underline truncate block"
                                          >
                                            {c?.name || c.profileUrl}
                                          </a>
                                        ) : (
                                          <p className="text-sm font-medium truncate">
                                            {c?.name || "Unnamed contact"}
                                          </p>
                                        )}
                                        <p className="text-xs text-muted-foreground truncate">
                                          {c?.title || it.companyName || "—"}
                                        </p>
                                      </div>
                                      <select
                                        value={st}
                                        disabled={savingStatus[it.id]}
                                        onChange={(e) =>
                                          void setStatus(
                                            it,
                                            "hr",
                                            key,
                                            e.target.value as ContactStatus
                                          )
                                        }
                                        className={`text-xs rounded-md border px-2 py-1 ${statusColor(
                                          st
                                        )}`}
                                      >
                                        <option value="none">None</option>
                                        <option value="requested">Requested</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="messaged">Messaged</option>
                                      </select>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm">No contacts found.</p>
                            )}
                          </div>
                          <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Potential leads
                            </p>
                            {it.potentialLeads?.length ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {it.potentialLeads.map((c, i) => {
                                  const key = c.profileUrl || c.name || `lead-${i}`;
                                  const st = (it.contactStatuses?.[`lead:${key}`] ||
                                    "none") as ContactStatus;
                                  return (
                                    <div
                                      key={`${it.id}-lead-${i}`}
                                      className="rounded-xl border bg-background p-3 flex items-start justify-between gap-3"
                                    >
                                      <div className="min-w-0">
                                        {c?.profileUrl ? (
                                          <a
                                            href={c.profileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-medium text-primary hover:underline truncate block"
                                          >
                                            {c?.name || c.profileUrl}
                                          </a>
                                        ) : (
                                          <p className="text-sm font-medium truncate">
                                            {c?.name || "Unnamed lead"}
                                          </p>
                                        )}
                                        <p className="text-xs text-muted-foreground truncate">
                                          {c?.title || "linkedin.com"}
                                        </p>
                                      </div>
                                      <select
                                        value={st}
                                        disabled={savingStatus[it.id]}
                                        onChange={(e) =>
                                          void setStatus(
                                            it,
                                            "lead",
                                            key,
                                            e.target.value as ContactStatus
                                          )
                                        }
                                        className={`text-xs rounded-md border px-2 py-1 ${statusColor(
                                          st
                                        )}`}
                                      >
                                        <option value="none">None</option>
                                        <option value="requested">Requested</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="messaged">Messaged</option>
                                      </select>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm">No potential leads found.</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
