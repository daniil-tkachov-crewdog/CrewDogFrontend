import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Check,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  DollarSign,
  Crown,
} from "lucide-react";
import faqHeroBg from "@/assets/faq-hero-bg.png";
import { gaEvent } from "@/analytics/gtm";
import { useAuth } from "@/auth/AuthProvider";
import {
  startCheckout,
  openBillingPortal,
  type PlanCode,
} from "@/services/billing";
import {
  fetchAccountSummary,
  type NormalizedSummary,
} from "@/services/account";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    monthlyPrice: "£0",
    annualPrice: "£0",
    period: "forever",
    description: "",
    highlight: "Best for exploring",
    icon: Star,
    color: "from-gray-500 to-slate-500",
    features: [
      "3 searches per month",
      "Basic company information",
      "Email support",
      "Search history (30 days)",
    ],
    cta: "Get Started",
    disabled: false,
  },
  {
    name: "Platinum",
    monthlyPrice: "£9.99",
    annualPrice: "£99",
    period: "per month",
    description: "",
    highlight: "Active job seekers",
    icon: Zap,
    color: "from-primary to-cyan-500",
    features: [
      "20 searches per month",
      "Full company intelligence",
      "Priority email support",
      "Contact recommendations",
      "Search history (1 year)",
      "Export results",
      "Advanced filters",
    ],
    cta: "Choose Platinum",
  },
  {
    name: "Silver",
    monthlyPrice: "£29.99",
    annualPrice: "£299",
    period: "per month",
    description: "",
    highlight: "Power users",
    icon: TrendingUp,
    color: "from-sky-500 to-emerald-500",
    features: [
      "60 searches per month",
      "Full company intelligence",
      "Priority email support",
      "Contact recommendations",
      "Search history (1 year)",
      "Export results (CSV & XLSX)",
      "Advanced & saved filters",
    ],
    cta: "Choose Silver",
  },
  {
    name: "Gold",
    monthlyPrice: "£99",
    annualPrice: "£990",
    period: "per month",
    description: "",
    highlight: "Most popular",
    icon: Star,
    color: "from-amber-400 to-orange-500",
    features: [
      "200 searches per month",
      "Deep company & team insights",
      "Priority email support",
      "Contact recommendations",
      "Search history (1 year)",
      "Export results & bulk actions",
      "Advanced filters & saved views",
    ],
    cta: "Choose Gold",
    popular: true,
  },
  {
    name: "Business",
    monthlyPrice: "£299",
    annualPrice: "£2,990",
    period: "per month",
    description: "",
    highlight: "Teams (5 seats)",
    icon: Sparkles,
    color: "from-fuchsia-500 to-cyan-500",
    features: [
      "1000 searches per month",
      "Up to 5 seats included",
      "Full company & hiring pipeline intelligence",
      "Priority support & onboarding",
      "Team-wide search history (1 year)",
      "Exports, bulk actions & collaboration",
      "Advanced filters, saved views & team sharing",
    ],
    cta: "Choose Bussiness",
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [summary, setSummary] = useState<NormalizedSummary | null>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.1]);

  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "pricing_page_view" });
    try {
      gaEvent("pricing_page_view");
    } catch {}
  }, []);

  // Fetch user summary when logged in
  useEffect(() => {
    if (user) {
      fetchAccountSummary()
        .then(setSummary)
        .catch(() => {
          /* ignore */
        });
    }
  }, [user]);

  async function handlePlanClick(planName: string, isPaid: boolean) {
    const billing = "monthly";
    const price = plans.find((p) => p.name === planName);
    const amount = price?.monthlyPrice;

    const payload = { plan: planName, billing, amount };

    (window as any).dataLayer.push({ event: "select_plan_click", ...payload });
    try {
      gaEvent("select_plan_click", payload);
    } catch {}

    // If user is not logged in, redirect to login
    if (!user) {
      navigate("/login?from=/pricing");
      return;
    }

    // If user already has an active paid plan, redirect to billing portal
    if (summary?.pro && !summary?.unlimited) {
      toast.info(
        "You already have an active plan. Manage your subscription in the billing portal."
      );
      try {
        await openBillingPortal();
      } catch (e: any) {
        toast.error(e?.message || "Unable to open billing portal.");
      }
      return;
    }

    // If it's the free plan, redirect to dashboard
    if (!isPaid) {
      navigate("/run");
      return;
    }

    // For paid plans, go direct to checkout
    if (isPaid) {
      (window as any).dataLayer.push({ event: "checkout_start", ...payload });
      try {
        gaEvent("checkout_start", payload);
      } catch {}

      // Map plan names to plan codes
      const planCodeMap: Record<string, PlanCode> = {
        Platinum: "platinum",
        Silver: "silver",
        Gold: "gold",
        Business: "business",
      };

      const planCode = planCodeMap[planName];
      if (planCode) {
        try {
          await startCheckout(planCode);
        } catch (e: any) {
          toast.error(e?.message || "Unable to start checkout.");
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/80 to-background">
      <Topbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${faqHeroBg})`,
              filter: "brightness(0.35)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-purple-500/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </motion.div>

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: Math.random() * 300,
              }}
              animate={{
                y: [null, Math.random() * 300],
                opacity: [0.2, 0.7, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 12,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ opacity: heroOpacity }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-medium border border-primary/20 bg-background/60 backdrop-blur-md shadow-lg"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <DollarSign className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-semibold">
                Simple, transparent pricing
              </span>
              <span className="h-1 w-1 rounded-full bg-primary/70" />
              <span className="text-xs text-muted-foreground">
                No setup fees. Cancel anytime.
              </span>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent tracking-tight">
                Choose the plan that matches your search volume
              </h1>
            </div>

            {/* Current Plan Info for Logged-in Users */}
            {user && summary && (
              <div className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group w-full max-w-md"
                >
                  {/* Glow effect */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-purple-500/30 to-primary/40 rounded-3xl blur-xl opacity-60"
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <div className="relative glass-card px-6 py-4 rounded-3xl border border-primary/40 bg-gradient-to-br from-background/95 via-primary/5 to-background/95 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-4">
                      {/* Icon with animated background */}
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary to-purple-500 rounded-xl blur-md opacity-50"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <div className="relative bg-gradient-to-br from-primary to-purple-500 p-2.5 rounded-xl shadow-lg">
                          <Crown className="h-5 w-5 text-white" />
                        </div>
                      </motion.div>

                      {/* Text content with better hierarchy */}
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                            Your Plan
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
                              {summary.planLabel ||
                                (summary.pro ? "Pro" : "Free")}
                            </span>
                            {(summary.pro || summary.unlimited) && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              >
                                ✓ Active
                              </motion.span>
                            )}
                          </div>
                        </div>
                        {!summary.unlimited && summary.remaining !== null && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-1.5 flex items-center gap-2 text-sm"
                          >
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                              <span className="font-semibold text-foreground tabular-nums">
                                {summary.remaining}
                              </span>
                              <span className="text-muted-foreground">
                                searches left
                              </span>
                            </div>
                            {summary.cap && (
                              <span className="text-xs text-muted-foreground/60">
                                of {summary.cap}
                              </span>
                            )}
                          </motion.div>
                        )}
                        {summary.unlimited && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-1 text-sm text-muted-foreground"
                          >
                            <span className="font-medium text-primary">∞</span>{" "}
                            Unlimited searches
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-16 items-stretch">
            {plans.map((plan, i) => {
              const IconComponent = plan.icon;
              const price = plan.monthlyPrice;
              const isPaid = plan.name !== "Free";

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  whileHover={{
                    y: plan.popular ? -14 : -8,
                    scale: 1.02,
                  }}
                  className="relative group h-full"
                >
                  {/* Subtle outer glow */}
                  <motion.div
                    className={`absolute -inset-3 bg-gradient-to-r ${plan.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity`}
                    animate={
                      plan.popular
                        ? { opacity: [0.1, 0.2, 0.15, 0.25, 0.1] }
                        : {}
                    }
                    transition={
                      plan.popular ? { duration: 5, repeat: Infinity } : {}
                    }
                  />

                  {/* Popular badge */}
                  {plan.popular && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                    >
                      <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-xs font-semibold shadow-xl flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" /> Most popular
                      </div>
                    </motion.div>
                  )}

                  {/* Card */}
                  <div
                    className={`relative h-full flex flex-col rounded-3xl border bg-background/90 backdrop-blur-md transition-all duration-200 group-hover:shadow-xl ${
                      plan.popular
                        ? "border-primary/70 ring-1 ring-primary/40"
                        : "border-border/60 group-hover:border-primary/40"
                    }`}
                  >
                    {/* Gradient blob */}
                    <motion.div
                      className={`pointer-events-none absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-15 rounded-full blur-3xl`}
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 30, 0] }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="relative z-10 p-5 md:p-6 flex flex-col h-full">
                      {/* Icon + highlight */}
                      <div className="flex items-center justify-between mb-4">
                        <motion.div
                          className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${plan.color} shadow-lg`}
                          whileHover={{ rotate: 4, scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </motion.div>
                        {plan.highlight && (
                          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-background/90 border border-border/50 text-muted-foreground">
                            {plan.highlight}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div className="mb-3">
                        <h3
                          className={`text-lg md:text-xl font-semibold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}
                        >
                          {plan.name}
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="mb-4 flex items-baseline gap-1">
                        <span className="text-3xl md:text-4xl font-bold tracking-tight">
                          {price}
                        </span>
                        <span className="text-xs md:text-sm text-muted-foreground">
                          /{plan.period}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                      {/* Features – flex-1 + min-h keeps cards even and buttons aligned */}
                      <ul className="space-y-2.5 mb-5 flex-1 min-h-[170px]">
                        {plan.features.map((feature, idx) => (
                          <motion.li
                            key={feature}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            viewport={{ once: true }}
                            className="flex gap-2.5"
                          >
                            <Check
                              className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                plan.popular
                                  ? "text-primary"
                                  : "text-muted-foreground/80"
                              }`}
                            />
                            <span className="text-xs md:text-sm text-muted-foreground leading-snug">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* CTA – perfectly aligned across all cards */}
                      <div className="mt-auto">
                        {summary?.pro && !summary?.unlimited && isPaid ? (
                          <Button
                            size="lg"
                            className="w-full h-11 md:h-12 text-sm md:text-base font-medium magnetic-button transition-transform group-hover:translate-y-[-1px]"
                            variant={
                              summary.planLabel === plan.name
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handlePlanClick(plan.name, isPaid)}
                          >
                            {summary.planLabel === plan.name
                              ? "Current Plan ✓"
                              : "Manage Billing"}
                          </Button>
                        ) : (
                          <Button
                            size="lg"
                            className="w-full h-11 md:h-12 text-sm md:text-base font-medium magnetic-button transition-transform group-hover:translate-y-[-1px]"
                            variant={
                              plan.name === "Free"
                                ? "outline"
                                : plan.popular
                                ? "default"
                                : "secondary"
                            }
                            disabled={plan.disabled}
                            onClick={() => handlePlanClick(plan.name, isPaid)}
                          >
                            {plan.cta}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
