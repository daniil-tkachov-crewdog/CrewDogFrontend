// src/components/run/ResultsCard.tsx
import { Card } from "@/components/ui/card";
import {
  Building2,
  Globe,
  Briefcase,
  Users2,
  Info,
  UserSearch,
  ExternalLink,
} from "lucide-react";

export type Results = {
  company: string;
  website?: string;
  careerPage?: string;
  contacts?: Array<{ name: string; role?: string; linkedIn?: string }>;
  sniff_out_clues?: string;
  leads?: Array<{ name: string; url: string }>;
};

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h4 className="font-semibold text-sm">{title}</h4>
    </div>
  );
}

function getHost(url?: string) {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
}

function PersonCard({
  name,
  subline,
  href,
  icon: Icon,
  cta = "View profile",
}: {
  name: string;
  subline?: string;
  href?: string;
  icon: React.ElementType;
  cta?: string;
}) {
  // Shared look for Contacts & Leads
  const inner = (
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        {subline && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {subline}
          </p>
        )}
        {href && (
          <p className="mt-1 text-xs text-primary inline-flex items-center gap-1">
            {cta} <ExternalLink className="h-3.5 w-3.5" />
          </p>
        )}
      </div>
      <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="h-4 w-4 text-primary" />
      </div>
    </div>
  );

  return (
    <div
      className="group rounded-xl border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-4
                 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-lg"
          aria-label={`${cta}: ${name}`}
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}

export default function ResultsCard({ results }: { results: Results }) {
  return (
    <Card className="glass-card p-8 h-full">
      <div className="space-y-8">
        {/* Company Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Company Found</p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {results.company}
              </h3>
            </div>
          </div>
        </div>

        {/* Insights */}
        {results.sniff_out_clues && (
          <div className="space-y-2">
            <SectionHeader icon={Info} title="Why this company" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {results.sniff_out_clues}
            </p>
          </div>
        )}

        {/* Resources */}
        {(results.website || results.careerPage) && (
          <div className="space-y-3">
            <SectionHeader icon={Globe} title="Resources" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.website && (
                <a
                  href={results.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Website</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {getHost(results.website) || "Visit company site"}
                  </p>
                </a>
              )}

              {results.careerPage && (
                <a
                  href={results.careerPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Careers</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {getHost(results.careerPage) || "View open positions"}
                  </p>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Key Contacts */}
        {Array.isArray(results.contacts) && results.contacts.length > 0 && (
          <div className="space-y-3">
            <SectionHeader icon={Users2} title="Key Contacts" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.contacts.map((c, i) => (
                <PersonCard
                  key={`${c.linkedIn || c.name}-${i}`}
                  name={c.name}
                  subline={c.role}
                  href={c.linkedIn}
                  icon={Users2}
                  cta="View LinkedIn"
                />
              ))}
            </div>
          </div>
        )}

        {/* Potential Leads */}
        {Array.isArray(results.leads) && results.leads.length > 0 && (
          <div className="space-y-3">
            <SectionHeader icon={UserSearch} title="Potential Leads" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.leads.map((p, i) => (
                <PersonCard
                  key={`${p.url}-${i}`}
                  name={p.name}
                  subline={getHost(p.url)}
                  href={p.url}
                  icon={UserSearch}
                  cta="Open profile"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
