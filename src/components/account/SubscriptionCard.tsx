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
  const cancelAtPeriodEnd = summary?.cancelAtPeriodEnd ?? false;

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
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <motion.div
          className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-sm"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Crown className="h-5 w-5 text-primary" />
        </motion.div>
        <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Subscription
        </h3>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden border-2 border-border/50 bg-gradient-to-br from-background via-background/95 to-background/80 p-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
          {/* Animated Background Gradient */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/8 to-pink-500/5 opacity-60"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "300% 300%" }}
          />

          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />

          {/* Floating Sparkles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: `${20 + i * 20}%`,
                  y: "100%",
                }}
                animate={{
                  y: ["-10%", "-20%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-3 h-3 text-primary/30" />
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              {/* LEFT SECTION */}
              <div className="flex-1 space-y-6">
                {/* Plan Badge & Status */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge className="text-base px-5 py-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 shadow-lg shadow-primary/25 border-0 font-semibold">
                        {planLabel}
                      </Badge>
                    </motion.div>

                    {(pro || unlimited) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        <Badge
                          variant="outline"
                          className="gap-1.5 text-emerald-500 border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 font-medium backdrop-blur-sm"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </motion.div>
                          Active
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                    {planSubtitle}
                  </p>
                </div>

                {/* Premium Features Badge */}
                {(pro || unlimited) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 px-4 py-2.5 text-sm backdrop-blur-sm"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                    </motion.div>
                    <span className="font-medium text-yellow-200/90">
                      Priority access to the latest features
                    </span>
                  </motion.div>
                )}
              </div>

              {/* RIGHT SECTION - Quota Card */}
              <div className="flex-1 space-y-5 lg:max-w-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 rounded-2xl border-2 border-border/40 bg-gradient-to-br from-background/80 via-background/60 to-background/40 p-5 sm:p-6 shadow-xl backdrop-blur-xl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Monthly Quota
                    </span>
                    <motion.span
                      className="text-sm font-bold tabular-nums bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
                      key={`${used}-${cap}`}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      {unlimited ? "Unlimited ∞" : `${used} / ${cap}`}
                    </motion.span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="relative h-3 rounded-full bg-muted/50 overflow-hidden backdrop-blur-sm border border-border/30">
                      <motion.div
                        className={`absolute inset-y-0 left-0 rounded-full ${
                          unlimited
                            ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"
                            : quotaPct >= 90
                            ? "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
                            : quotaPct >= 70
                            ? "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-blue-500 via-primary to-purple-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${quotaPct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>
                    {!unlimited && quotaPct >= 90 && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-orange-400 font-medium flex items-center gap-1.5"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          ⚠️
                        </motion.div>
                        Running low on searches
                      </motion.p>
                    )}
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/30">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {getRenewalLabel()}
                    </span>
                    {!unlimited && (
                      <motion.span
                        className="font-bold tabular-nums text-foreground"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {remaining} left
                      </motion.span>
                    )}
                  </div>
                </motion.div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  {!unlimited && !pro && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex-1"
                    >
                      <Button
                        className="w-full group relative overflow-hidden bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
                        size="lg"
                        onClick={handleUpgradeClick}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                          animate={{
                            x: ["-100%", "200%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        />
                        <Crown className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform relative z-10" />
                        <span className="relative z-10 font-semibold">
                          Choose a Plan
                        </span>
                      </Button>
                    </motion.div>
                  )}

                  {pro && !unlimited && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="min-w-[150px] border-2 hover:bg-accent/50 hover:border-primary/50 transition-all"
                      onClick={handleManageBilling}
                    >
                      Manage Billing
                    </Button>
                  )}

                  {pro && !unlimited && atCap && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex-1"
                    >
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        onClick={handleRenewNow}
                      >
                        Renew Now
                      </Button>
                    </motion.div>
                  )}

                  {pro && !cancelAtPeriodEnd && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  )}

                  {pro && cancelAtPeriodEnd && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-2 rounded-lg border-2 border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium"
                    >
                      ⚠️ Subscription ends on{" "}
                      {renewalDate
                        ? new Date(renewalDate).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "renewal date"}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ENHANCED PLAN MODAL */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-h-[90vh] sm:max-h-[85vh] sm:max-w-3xl border-2 border-primary/20 bg-gradient-to-br from-background via-background/98 to-background/95 backdrop-blur-3xl shadow-2xl p-0 overflow-hidden rounded-3xl flex flex-col">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="relative z-10 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-2rem)] sm:max-h-[calc(85vh-2rem)] scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent hover:[&::-webkit-scrollbar-thumb]:bg-primary/50"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "hsl(var(--primary) / 0.3) transparent",
            }}
          >
            {/* Header */}
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Crown className="h-6 w-6 text-primary" />
                </motion.div>
                <div>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    Upgrade Your Plan
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground mt-1">
                    Choose the plan that fits your hiring volume and unlock
                    premium features.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Plans Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {plans.map((p, idx) => {
                const active = selectedPlan === p.code;
                return (
                  <motion.button
                    key={p.code}
                    type="button"
                    onClick={() => setSelectedPlan(p.code)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={[
                      "relative text-left rounded-2xl border-2 px-5 py-5 transition-all duration-300",
                      active
                        ? "border-primary bg-gradient-to-br from-primary/15 via-primary/8 to-transparent shadow-xl shadow-primary/20 ring-2 ring-primary/30"
                        : "border-border/50 bg-gradient-to-br from-background via-background/80 to-muted/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
                    ].join(" ")}
                  >
                    {/* Popular Badge */}
                    {p.highlight && (
                      <motion.div
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2"
                      >
                        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary/50 bg-gradient-to-r from-primary to-purple-500 px-4 py-1 text-[10px] font-bold uppercase text-white shadow-lg backdrop-blur-sm">
                          <Sparkles className="h-3 w-3" />
                          Most Popular
                        </span>
                      </motion.div>
                    )}

                    <div className="flex flex-col gap-3">
                      {/* Plan Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5">
                          <span className="font-bold text-base sm:text-lg flex items-center gap-2">
                            {p.name}
                            {active && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                              >
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              </motion.div>
                            )}
                          </span>
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="font-semibold text-foreground">
                              {p.searches}
                            </span>{" "}
                            searches / month
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            {p.price.split("/")[0]}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            per month
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 pt-2 border-t border-border/30">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Instant activation</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Auto-renews monthly</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Cancel anytime</span>
                        </div>
                      </div>

                      {/* Selection indicator */}
                      {active && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-semibold text-xs"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Selected Plan
                        </motion.div>
                      )}
                    </div>

                    {/* Hover glow effect */}
                    {active && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-500/20"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 px-4 py-3 rounded-xl bg-muted/30 backdrop-blur-sm text-xs text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Money-back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Cancel Anytime</span>
              </div>
            </motion.div>

            {/* Footer Actions */}
            <DialogFooter className="gap-3 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => setPlanDialogOpen(false)}
                disabled={upgradeBusy}
                className="w-full sm:w-auto border-2"
                size="lg"
              >
                Close
              </Button>
              <Button
                onClick={handleUpgradeConfirm}
                disabled={upgradeBusy || !selectedPlan}
                className="w-full sm:w-auto bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:shadow-xl hover:shadow-primary/25 disabled:opacity-50 relative overflow-hidden group"
                size="lg"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{
                    x: upgradeBusy ? ["-100%", "200%"] : "-100%",
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: upgradeBusy ? Infinity : 0,
                    ease: "linear",
                  }}
                />
                <span className="relative z-10 font-semibold">
                  {upgradeBusy ? "Processing..." : "Continue to Checkout"}
                </span>
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
