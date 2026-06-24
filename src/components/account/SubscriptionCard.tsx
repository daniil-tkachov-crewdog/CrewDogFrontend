import { useState } from "react";
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

const BTN_PRIMARY =
  "rounded-[2px] bg-[#FF5A1F] px-[22px] py-[13px] font-['Space_Grotesk',sans-serif] text-[14px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40";
const BTN_GHOST =
  "rounded-[2px] border border-[#E4E1D9] px-[22px] py-[13px] text-[14px] font-medium transition-colors hover:border-[#FF5A1F] disabled:opacity-40";
const MONO =
  "font-['IBM_Plex_Mono',monospace] tracking-[0.06em]";

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
    : Math.min(100, Math.max(0, (used / Math.max(cap, 1)) * 100));

  const planLabel = unlimited
    ? "Admin"
    : summary?.planLabel ?? (pro ? "Pro" : "Free");

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
    { code: "silver", name: "Silver", searches: 60, price: "£29.99 / month" },
    { code: "gold", name: "Gold", searches: 200, price: "£99 / month" },
    { code: "business", name: "Business", searches: 1000, price: "£299 / month" },
  ];

  return (
    <section>
      <span className="font-['IBM_Plex_Mono',monospace] text-[13px] uppercase tracking-[0.2em] text-[#FF5A1F]">
        // subscription
      </span>

      <div className="mt-5 rounded-md border border-[#E4E1D9] bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* LEFT */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-[2px] bg-[#0B0B0F] px-4 py-2 font-['IBM_Plex_Mono',monospace] text-[13px] uppercase tracking-[0.08em] text-[#FF5A1F]">
                {planLabel}
              </span>
              {(pro || unlimited) && (
                <span className={MONO + " flex items-center gap-1.5 text-[12px] text-[#FF5A1F]"}>
                  <span className="h-[6px] w-[6px] rounded-full bg-[#FF5A1F]" />
                  Active
                </span>
              )}
            </div>
            <p className="max-w-md text-[15px] leading-[1.6] text-[#55525E]">
              {planSubtitle}
            </p>
          </div>

          {/* RIGHT — quota */}
          <div className="flex-1 space-y-5 lg:max-w-md">
            <div className="rounded-[4px] border border-[#E4E1D9] bg-[#F4F2EE] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className={MONO + " text-[11px] uppercase text-[#6F6C78]"}>
                  Monthly quota
                </span>
                <span className={MONO + " text-[13px] font-semibold text-[#0B0B0F]"}>
                  {unlimited ? "Unlimited ∞" : `${used} / ${cap}`}
                </span>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="h-[8px] overflow-hidden rounded-full bg-[#E4E1D9]">
                  <div
                    className="h-full rounded-full bg-[#FF5A1F] transition-[width] duration-700"
                    style={{ width: `${quotaPct}%` }}
                  />
                </div>
                {!unlimited && quotaPct >= 90 && (
                  <p className={MONO + " mt-2 text-[11px] text-[#FF5A1F]"}>
                    ⚠ Running low on searches
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#E4E1D9] pt-3">
                <span className={MONO + " text-[11px] text-[#6F6C78]"}>
                  {getRenewalLabel()}
                </span>
                {!unlimited && (
                  <span className={MONO + " text-[11px] font-semibold text-[#0B0B0F]"}>
                    {remaining} left
                  </span>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col flex-wrap gap-3 sm:flex-row">
              {!unlimited && !pro && (
                <button onClick={handleUpgradeClick} className={BTN_PRIMARY + " flex-1"}>
                  Choose a plan
                </button>
              )}

              {pro && !unlimited && (
                <button onClick={handleManageBilling} className={BTN_GHOST + " min-w-[150px]"}>
                  Manage billing
                </button>
              )}

              {pro && !unlimited && atCap && (
                <button onClick={handleRenewNow} className={BTN_PRIMARY + " flex-1"}>
                  Renew now
                </button>
              )}

              {pro && !cancelAtPeriodEnd && (
                <button
                  onClick={onCancel}
                  className="rounded-[2px] border border-[#E4E1D9] px-[22px] py-[13px] text-[14px] font-medium text-[#55525E] transition-colors hover:border-red-400 hover:text-red-600"
                >
                  Cancel
                </button>
              )}

              {pro && cancelAtPeriodEnd && (
                <div className={MONO + " rounded-[2px] border border-[#FF5A1F]/40 bg-[#FF5A1F]/[0.06] px-4 py-2 text-[12px] text-[#FF5A1F]"}>
                  ⚠ Subscription ends on{" "}
                  {renewalDate
                    ? new Date(renewalDate).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "renewal date"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PLAN MODAL */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-md border border-[#E4E1D9] bg-[#F4F2EE] p-6 font-['Space_Grotesk',system-ui,sans-serif] text-[#0B0B0F] sm:max-w-3xl sm:p-8">
          <DialogHeader>
            <span className="font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.16em] text-[#FF5A1F]">
              Upgrade your plan
            </span>
            <DialogTitle className="mt-2 text-[26px] tracking-[-0.02em]">
              Choose a plan
            </DialogTitle>
            <DialogDescription className="text-[15px] text-[#55525E]">
              Choose the plan that fits your hiring volume.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            {plans.map((p) => {
              const active = selectedPlan === p.code;
              return (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setSelectedPlan(p.code)}
                  className={
                    "relative rounded-md border bg-white px-5 py-5 text-left transition-colors " +
                    (active
                      ? "border-[#FF5A1F] ring-1 ring-[#FF5A1F]"
                      : "border-[#E4E1D9] hover:border-[#FF5A1F]")
                  }
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-[2px] bg-[#FF5A1F] px-3 py-1 font-['IBM_Plex_Mono',monospace] text-[10px] font-bold uppercase tracking-[0.06em] text-[#0B0B0F]">
                      Most popular
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="flex items-center gap-2 text-[18px] font-semibold tracking-[-0.01em]">
                        {p.name}
                        {active && <span className="text-[#FF5A1F]">✓</span>}
                      </span>
                      <div className={MONO + " mt-1.5 text-[12px] text-[#6F6C78]"}>
                        <span className="font-semibold text-[#0B0B0F]">
                          {p.searches}
                        </span>{" "}
                        searches / month
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[20px] font-bold">
                        {p.price.split("/")[0]}
                      </div>
                      <div className={MONO + " text-[10px] text-[#6F6C78]"}>
                        per month
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 border-t border-[#E4E1D9] pt-3">
                    {["Instant activation", "Auto-renews monthly", "Cancel anytime"].map(
                      (f) => (
                        <div
                          key={f}
                          className={MONO + " flex items-center gap-2 text-[11px] text-[#6F6C78]"}
                        >
                          <span className="text-[#FF5A1F]">›</span> {f}
                        </div>
                      )
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <DialogFooter className="mt-2 gap-3">
            <button
              onClick={() => setPlanDialogOpen(false)}
              disabled={upgradeBusy}
              className={BTN_GHOST + " w-full sm:w-auto"}
            >
              Close
            </button>
            <button
              onClick={handleUpgradeConfirm}
              disabled={upgradeBusy || !selectedPlan}
              className={BTN_PRIMARY + " w-full sm:w-auto"}
            >
              {upgradeBusy ? "Processing..." : "Continue to checkout"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
