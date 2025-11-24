import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle2, Crown, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { AccountUser } from "@/types/account";
import type { NormalizedSummary } from "@/types/account";

import { notify } from "@/lib/notify";
import {
  startCheckout,
  renewNow,
  confirmIfRequired,
  openBillingPortal,
  type PlanCode,
} from "@/services/billing";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  user: AccountUser;
  summary: NormalizedSummary | null;
  onRefresh: () => Promise<void> | void;
  onCancel: () => void;
};

export default function SubscriptionCard({
  user,
  summary,
  onRefresh,
  onCancel,
}: Props) {
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanCode | null>(null);
  const [upgradeBusy, setUpgradeBusy] = useState(false);

  const pro = summary?.pro ?? false;
  const unlimited = summary?.unlimited ?? false;

  // ---- FIXED LOGIC ----
  const remainingServer =
    summary?.remaining ??
    Math.max(0, (user.quota.total || 0) - (user.quota.used || 0));

  let cap = summary?.cap ?? user.quota.total ?? remainingServer;

  // If remaining > cap (e.g. retention mid-cycle), bump cap up
  if (remainingServer > cap) {
    cap = remainingServer;
  }

  const remaining = remainingServer;
  const used = unlimited ? 0 : Math.max(0, cap - remaining);

  const renewalDate = summary?.renewalDate ?? user.renewalDate;

  const atCap = !unlimited && cap > 0 && used >= cap;

  const quotaPct = unlimited
    ? 100
    : Math.min(100, Math.max(0, (used / Math.max(cap, 1)) * 100)); // ✔ fixed

  const planLabel = unlimited
    ? "Admin"
    : summary?.planLabel ?? (pro ? "Pro" : "Free");

  const isPlatinum =
    pro && !unlimited && planLabel.toLowerCase().includes("platinum");

  const planSubtitle = unlimited
    ? "You have unlimited searches."
    : pro
    ? `You're on the ${planLabel} plan.`
    : "Upgrade to unlock more searches and faster hiring.";

  const handleUpgradeClick = () => {
    setSelectedPlan("platinum"); // default choice
    setPlanDialogOpen(true);
  };

  const handleUpgradeConfirm = async () => {
    if (!selectedPlan) {
      notify("Please select a plan first.", "error");
      return;
    }
    try {
      setUpgradeBusy(true);
      await startCheckout(selectedPlan);
    } catch (e: any) {
      notify(e?.message || "Unable to start checkout.", "error");
    } finally {
      setUpgradeBusy(false);
    }
  };

  const handleRenewNow = async () => {
    try {
      const resp = await renewNow();
      await confirmIfRequired(resp?.client_secret);
      notify("Your cycle was reset. You now have fresh credits.", "success");
      await onRefresh();
    } catch (e: any) {
      notify(e?.message || "Could not renew now.", "error");
    }
  };

  const handleManageBilling = async () => {
    try {
      await openBillingPortal();
    } catch (e: any) {
      notify(e?.message || "Could not open billing portal.", "error");
    }
  };

  function getRenewalLabel() {
    if (!renewalDate || unlimited) return "—";
    const d = new Date(renewalDate);
    if (isNaN(d.getTime())) return `Resets on ${renewalDate}`;
    return `Resets on ${d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }

  const plans: Array<{
    code: PlanCode;
    name: string;
    searches: number;
    price: string;
    highlight?: boolean;
  }> = [
    {
      code: "platinum",
      name: "Platinum",
      searches: 20,
      price: "£9.99 / month",
      highlight: true,
    },
    {
      code: "silver",
      name: "Silver",
      searches: 60,
      price: "£29.99 / month",
    },
    {
      code: "gold",
      name: "Gold",
      searches: 200,
      price: "£99 / month",
    },
    {
      code: "business",
      name: "Business",
      searches: 1000,
      price: "£299 / month",
    },
  ];

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Crown className="h-5 w-5 text-primary" />
        <h3 className="text-2xl font-bold tracking-tight">Subscription</h3>
      </div>

      <Card className="relative overflow-hidden border border-border/70 bg-gradient-to-br from-background via-background/80 to-background/60 p-6 sm:p-8 glass-card group hover:shadow-2xl transition-all duration-300">
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/14 via-purple-500/10 to-transparent opacity-80"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "reverse" }}
          style={{ backgroundSize: "220% 220%" }}
        />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-stretch md:justify-between">
          {/* LEFT */}
          <div className="flex-1 space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="text-base px-4 py-1.5 bg-gradient-to-r from-primary to-purple-500 shadow-sm">
                  {planLabel}
                </Badge>

                {(pro || unlimited) && (
                  <Badge
                    variant="outline"
                    className="gap-1 text-emerald-400 border-emerald-500/40 bg-emerald-500/5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                {planSubtitle}
              </p>
            </div>

            {(pro || unlimited) && (
              <motion.div
                className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1 text-xs text-yellow-300"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Priority access to the latest features.
              </motion.div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex-1 space-y-4 md:max-w-md">
            <div className="space-y-3 rounded-2xl border border-border/60 bg-background/60 p-4 sm:p-5 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  Monthly Quota
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {unlimited ? "Unlimited" : `${used} / ${cap} searches`}
                </span>
              </div>

              <Progress value={quotaPct} className="h-2.5 rounded-full" />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {getRenewalLabel()}
                </span>
                {!unlimited && (
                  <span className="font-medium tabular-nums">
                    {remaining} remaining
                  </span>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 pt-1">
              {!unlimited && !pro && (
                <Button
                  className="flex-1 group"
                  size="lg"
                  onClick={handleUpgradeClick}
                >
                  <Crown className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Choose a Plan
                </Button>
              )}

              {pro && !unlimited && (
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[150px]"
                  onClick={handleManageBilling}
                >
                  Manage Billing
                </Button>
              )}

              {pro && !unlimited && atCap && (
                <Button size="lg" className="flex-1" onClick={handleRenewNow}>
                  Renew now
                </Button>
              )}

              {pro && (
                <Button
                  variant="outline"
                  size="lg"
                  className="md:ml-auto"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* PLAN MODAL */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-h-[90vh] sm:max-h-[80vh] sm:max-w-2xl border border-white/10 bg-gradient-to-br from-slate-950/92 via-slate-900/97 to-slate-950/92 backdrop-blur-2xl shadow-2xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18 }}
            className="p-5 sm:p-7 space-y-5"
          >
            <DialogHeader className="space-y-2">
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Crown className="h-4 w-4" />
                </span>
                Upgrade your plan
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Choose the plan that fits your hiring volume.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-1 grid gap-3 sm:grid-cols-2">
              {plans.map((p) => {
                const active = selectedPlan === p.code;
                return (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => setSelectedPlan(p.code)}
                    className={[
                      "relative text-left rounded-2xl border px-4 py-4 transition-all",
                      active
                        ? "border-primary/70 from-primary/12 via-primary/5 to-slate-950/80 shadow-primary/20 shadow-lg ring-1 ring-primary/40"
                        : "border-border/70 from-background via-muted to-background hover:border-primary/40 hover:shadow-primary/10 hover:shadow-md",
                      "bg-gradient-to-br",
                    ].join(" ")}
                  >
                    {p.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 text-[10px] font-semibold uppercase text-primary shadow-sm backdrop-blur-sm">
                        MOST POPULAR
                      </span>
                    )}

                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="font-semibold text-sm sm:text-base">
                            {p.name}
                          </span>
                          <div className="text-[11px] sm:text-xs text-muted-foreground">
                            Includes{" "}
                            <span className="font-medium">{p.searches}</span>{" "}
                            searches / month
                          </div>
                        </div>
                        <span className="text-sm sm:text-base font-semibold">
                          {p.price}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Instant activation. Auto-renews monthly.</span>
                        {active && (
                          <span className="inline-flex items-center gap-1 text-primary font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <DialogFooter className="mt-4 gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => setPlanDialogOpen(false)}
                disabled={upgradeBusy}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
              <Button
                onClick={handleUpgradeConfirm}
                disabled={upgradeBusy}
                className="w-full sm:w-auto"
              >
                {upgradeBusy ? "Starting checkout…" : "Continue to Checkout"}
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
