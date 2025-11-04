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
  openBillingPortal, // keep if you added Manage Billing
} from "@/services/billing";

export default function SubscriptionCard({
  user,
  summary,
  onRefresh,
  onCancel,
}: {
  user: AccountUser;
  summary: NormalizedSummary | null;
  onRefresh: () => Promise<void> | void;
  onCancel: () => void;
}) {
  const pro = summary?.pro ?? user.plan !== "Free";
  const unlimited = summary?.unlimited ?? false;

  const used = summary?.used ?? user.quota.used;
  const cap = summary?.cap ?? user.quota.total;
  const remaining = summary?.remaining ?? Math.max(0, cap - used);
  const renewalDate = summary?.renewalDate ?? user.renewalDate;
  const atCap = !unlimited && cap > 0 && used >= cap;
  const quotaPct = unlimited
    ? 100
    : Math.min(100, Math.max(0, (used / Math.max(cap, 1)) * 100));

  const planLabel = unlimited ? "Admin" : pro ? "Pro" : "Free";
  const planSubtitle = unlimited
    ? "You have unlimited searches."
    : pro
    ? "Thanks for being a premium member!"
    : "Upgrade to unlock more searches";

  const handleUpgrade = async () => {
    try {
      await startCheckout();
    } catch (e: any) {
      notify(e?.message || "Unable to start checkout.", "error");
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

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Crown className="h-5 w-5 text-primary" />
        <h3 className="text-2xl font-bold">Subscription</h3>
      </div>

      <Card className="p-8 glass-card relative overflow-hidden group hover:shadow-xl transition-all">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-primary to-purple-500">
                  {planLabel}
                </Badge>
                {(pro || unlimited) && (
                  <Badge
                    variant="outline"
                    className="gap-1 text-green-500 border-green-500/20"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{planSubtitle}</p>
            </div>
            {(pro || unlimited) && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </motion.div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Monthly Quota</span>
              <span className="text-sm font-bold">
                {unlimited ? "Unlimited" : `${used} / ${cap} searches`}
              </span>
            </div>
            <div className="relative">
              <Progress value={quotaPct} className="h-3" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {unlimited
                  ? "—"
                  : renewalDate
                  ? `Resets on ${renewalDate}`
                  : "—"}
              </span>
              {!unlimited && (
                <span className="text-xs text-muted-foreground">
                  {remaining} remaining
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {!unlimited && !pro && (
              <Button
                className="flex-1 group"
                size="lg"
                onClick={handleUpgrade}
              >
                <Crown className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                Upgrade Plan
              </Button>
            )}

            {/* Manage Billing available to paying users (non-unlimited) */}
            {pro && !unlimited && (
              <Button variant="outline" size="lg" onClick={handleManageBilling}>
                Manage Billing
              </Button>
            )}

            {pro && !unlimited && atCap && (
              <Button size="lg" className="flex-1" onClick={handleRenewNow}>
                Renew now
              </Button>
            )}

            {pro && (
              <Button variant="outline" size="lg" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
