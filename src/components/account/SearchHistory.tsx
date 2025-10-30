import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Calendar,
  Download,
  History as HistoryIcon,
  Target,
  Zap,
} from "lucide-react";
import type { SearchItem } from "../data/account.types";
import { Link } from "react-router-dom";

export default function SearchHistory({ items }: { items: SearchItem[] }) {
  const [expanded, setExpanded] = useState<number[]>([]);
  const toggle = (id: number) =>
    setExpanded((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <HistoryIcon className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Search History</h2>
      </div>

      {items.length === 0 ? (
        <Card className="p-12 glass-card text-center">
          <HistoryIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No searches yet</h3>
          <p className="text-muted-foreground mb-6">
            Start your first job search to see it here
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
          {items.map((it, idx) => (
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
                      <p className="font-semibold text-lg mb-1">{it.company}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {it.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {it.results} results
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {it.duration}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 border-green-500/20"
                    >
                      {it.status}
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
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">
                            Total Results
                          </p>
                          <p className="text-2xl font-bold">{it.results}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">
                            Search Duration
                          </p>
                          <p className="text-2xl font-bold">{it.duration}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Full Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
