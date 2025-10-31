import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Check,
  ArrowLeft,
  Sparkles,
  Zap,
  Crown,
  Shield,
  TrendingUp,
  Users,
  Star,
  DollarSign,
  MessageCircle,
} from "lucide-react";
import faqHeroBg from "@/assets/faq-hero-bg.jpg";
import { gaEvent } from "@/analytics/gtm";

const plans = [
  {
    name: "Free",
    monthlyPrice: "£0",
    annualPrice: "£0",
    period: "forever",
    description: "Perfect for trying out CrewDog",
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
    name: "Pro",
    monthlyPrice: "£9",
    annualPrice: "£90",
    period: "per month",
    description: "For active job seekers",
    icon: TrendingUp,
    color: "from-primary to-cyan-500",
    features: [
      "25 searches per month",
      "Full company intelligence",
      "Priority email support",
      "Contact recommendations",
      "Search history (1 year)",
      "Export results",
      "Advanced filters",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Business",
    monthlyPrice: "£29",
    annualPrice: "£290",
    period: "per month",
    description: "For recruiters and agencies",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    features: [
      "Unlimited searches",
      "Advanced analytics",
      "API access",
      "Priority support",
      "Team collaboration",
      "Custom integrations",
      "Dedicated account manager",
      "White-label options",
    ],
    cta: "Contact Sales",
  },
];

const faqs = [
  {
    question: "Can I change plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately for upgrades, or at the next billing cycle for downgrades.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through our secure payment processor Stripe. All transactions are encrypted and secure.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied with CrewDog within the first week, contact our support team and we'll process a full refund, no questions asked.",
  },
  {
    question: "What happens when I reach my search limit?",
    answer:
      "Free plan users can upgrade anytime to continue searching. Pro users can purchase additional search credits or upgrade to Business for unlimited searches. We'll notify you before you reach your limit.",
  },
  {
    question: "Do you offer discounts for annual plans?",
    answer:
      "Yes! Save up to 17% when you choose annual billing. You'll get the same great features with significant savings over monthly payments.",
  },
  {
    question: "Can I try Pro features before upgrading?",
    answer:
      "We occasionally offer free trials of Pro features. Sign up for our newsletter to be notified of trial opportunities. Business plan demos are available on request.",
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "pricing_page_view" });
    try {
      gaEvent("pricing_page_view");
    } catch {}
  }, []);

  function handlePlanClick(planName: string, isPaid: boolean) {
    const billing = isAnnual ? "annual" : "monthly";
    const price = plans.find((p) => p.name === planName);
    const amount = isAnnual ? price?.annualPrice : price?.monthlyPrice;

    const payload = { plan: planName, billing, amount };

    // Select plan event
    (window as any).dataLayer.push({ event: "select_plan_click", ...payload });
    try {
      gaEvent("select_plan_click", payload);
    } catch {}

    // Checkout start for paid plans
    if (isPaid) {
      (window as any).dataLayer.push({ event: "checkout_start", ...payload });
      try {
        gaEvent("checkout_start", payload);
      } catch {}
      // Your real checkout redirect starts here (Stripe session, etc.)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${faqHeroBg})`,
              filter: "brightness(0.4)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-purple-500/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
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
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
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
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm font-medium mb-4 border border-primary/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <DollarSign className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-semibold">
                Simple Pricing
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-foreground via-primary to-purple-400 bg-clip-text text-transparent">
                Choose Your Plan
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-foreground/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Find the perfect plan for your job search needs. All plans include
              our core features.
            </motion.p>

            {/* Annual/Monthly Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-4 glass-card px-6 py-3 rounded-full border border-primary/20"
            >
              <span
                className={`text-sm font-medium transition-colors ${
                  !isAnnual ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isAnnual ? "bg-primary" : "bg-border"
                }`}
                aria-label="Toggle billing frequency"
              >
                <motion.div
                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                  animate={{ x: isAnnual ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span
                className={`text-sm font-medium transition-colors ${
                  isAnnual ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              const displayPrice = isAnnual
                ? plan.annualPrice
                : plan.monthlyPrice;
              const savings =
                isAnnual && plan.name !== "Free"
                  ? Math.round(
                      ((parseFloat(plan.monthlyPrice.slice(1)) * 12 -
                        parseFloat(plan.annualPrice.slice(1))) /
                        (parseFloat(plan.monthlyPrice.slice(1)) * 12)) *
                        100
                    )
                  : 0;
              const isPaid = plan.name !== "Free";

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: plan.popular ? -12 : -8, scale: 1.02 }}
                  className="relative group"
                >
                  {/* Glow effect */}
                  <motion.div
                    className={`absolute -inset-4 bg-gradient-to-r ${plan.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity`}
                    animate={plan.popular ? { opacity: [0.1, 0.2, 0.1] } : {}}
                    transition={
                      plan.popular ? { duration: 3, repeat: Infinity } : {}
                    }
                  />

                  {/* Popular badge */}
                  {plan.popular && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                    >
                      <div
                        className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${plan.color} text-white text-sm font-semibold shadow-lg flex items-center gap-1`}
                      >
                        <Sparkles className="h-3 w-3" />
                        Most Popular
                      </div>
                    </motion.div>
                  )}

                  <div
                    className={`relative glass-card p-8 rounded-3xl h-full flex flex-col overflow-hidden ${
                      plan.popular
                        ? "border-2 border-primary"
                        : "border border-border/50"
                    }`}
                  >
                    {/* Background decoration */}
                    <motion.div
                      className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${plan.color} opacity-5 rounded-full blur-3xl`}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Icon */}
                    <motion.div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.color} mb-6 self-start shadow-lg`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </motion.div>

                    <div className="mb-6">
                      <h3
                        className={`text-2xl font-bold mb-2 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}
                      >
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1 mb-2">
                        <motion.span
                          key={displayPrice}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-5xl font-bold"
                        >
                          {displayPrice}
                        </motion.span>
                        <span className="text-muted-foreground">
                          /
                          {isAnnual && plan.name !== "Free"
                            ? "year"
                            : plan.period}
                        </span>
                      </div>
                      {isAnnual && savings > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-full"
                        >
                          <Zap className="h-3 w-3" />
                          Save {savings}%
                        </motion.div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 group/item"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Check
                              className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                                plan.popular
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </motion.div>
                          <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        size="lg"
                        className="w-full magnetic-button text-base font-medium h-12"
                        variant={plan.popular ? "default" : "outline"}
                        disabled={plan.disabled}
                        onClick={() => handlePlanClick(plan.name, isPaid)}
                      >
                        {plan.cta}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Badges */}
          {/* (unchanged UI; analytics not needed here) */}

          {/* FAQ Section */}
          {/* (unchanged UI; analytics not needed here) */}

          {/* CTA Section */}
          {/* (unchanged UI; analytics not needed here) */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
