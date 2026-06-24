import { useState } from "react";
import { Link } from "react-router-dom";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How does CrewDog work?",
    answer:
      "CrewDog uses advanced AI to analyze job descriptions from LinkedIn and other platforms to identify the actual hiring company behind recruiter posts. Our system cross-references multiple data sources to trace company information, find direct application routes, and provide contact details for hiring managers and HR personnel.",
  },
  {
    question: "What information do I need to provide?",
    answer:
      "You can provide either a LinkedIn job URL or paste the complete job description. For best results, ensure the description is at least 300 characters and includes location information (city, state, or country). The more detailed the job posting, the more accurate our results will be.",
  },
  {
    question: "How accurate are the results?",
    answer:
      "Our AI achieves over 90% accuracy by cross-referencing multiple data sources including company databases, LinkedIn profiles, and public records. However, results depend on the quality and completeness of the job description provided. We continuously improve our algorithms based on user feedback.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes 3 job searches per month. Each search provides company identification, official website links, career page URLs, and basic contact information. You also get access to search history for 30 days and email support.",
  },
  {
    question: "Can I search for jobs outside my country?",
    answer:
      "Yes! CrewDog works with job postings from any location worldwide. Our system is designed to handle international job markets and can identify companies across different regions, as long as location information is included in the job description.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. We take data security seriously and are fully GDPR compliant. We don't share your searches with third parties, don't sell your data, and only store job descriptions temporarily to process your request. Your search history is private and can be deleted at any time from your account.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through our secure payment processor Stripe. All transactions are encrypted and we never store your payment information on our servers.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees, and you'll continue to have access to paid features until the end of your current billing period.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied with CrewDog within the first week, contact our support team and we'll process a full refund, no questions asked.",
  },
  {
    question: "How do I upgrade or downgrade my plan?",
    answer:
      "You can change your plan at any time from your account settings. When upgrading, you'll have immediate access to additional features. When downgrading, changes take effect at the start of your next billing cycle.",
  },
  {
    question: "What if I get incorrect results?",
    answer:
      "If the results do not look correct, we recommend refining your search criteria or running the search again. Small adjustments often improve accuracy and relevance.",
  },
];

export default function FAQ() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] text-[#0B0B0F] font-['Space_Grotesk',system-ui,sans-serif]">
      <Topbar />

      {/* ── Hero ── */}
      <header className="relative overflow-hidden bg-[#0B0B0F] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-20 h-[520px] w-[520px] rounded-full border border-[#FF5A1F]/20 max-[720px]:right-[-220px] max-[720px]:opacity-50"
        >
          <div className="absolute inset-20 rounded-full border border-[#FF5A1F]/[0.14]" />
          <div className="absolute inset-[170px] rounded-full border border-[#FF5A1F]/10" />
        </div>

        <div className="mx-auto w-full max-w-[1040px] px-6 py-[72px] pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-7 block font-['IBM_Plex_Mono',monospace] text-[13px] uppercase tracking-[0.22em] text-[#FF5A1F]">
              Help centre · Radar
            </span>
            <h1 className="max-w-[14ch] text-[clamp(40px,8vw,76px)] font-bold leading-[0.98] tracking-[-0.03em]">
              How can we <em className="not-italic text-[#FF5A1F]">help?</em>
            </h1>
            <p className="mt-[26px] max-w-[54ch] text-[clamp(16px,2.2vw,19px)] leading-[1.6] text-[#C9C6CF]">
              Answers to the questions recruiters ask most — how Radar reads an
              advert, what's in each plan, and how your data is handled.
            </p>
          </motion.div>
        </div>
      </header>

      {/* ── FAQ content ── */}
      <main className="flex-1 py-16">
        <div className="mx-auto grid w-full max-w-[1040px] grid-cols-1 gap-10 px-6 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-md border border-[#E4E1D9] bg-white p-6">
                <span className="font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.16em] text-[#FF5A1F]">
                  // support
                </span>
                <h2 className="mt-3 text-[28px] tracking-[-0.02em]">FAQs</h2>
                <p className="mt-3 text-[15px] leading-[1.6] text-[#55525E]">
                  Have questions? Check the common ones here for a quick answer —
                  or reach out and we'll help directly.
                </p>
                <Link
                  to="/support"
                  className="mt-5 inline-block rounded-[2px] bg-[#FF5A1F] px-[20px] py-[11px] text-[14px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5"
                >
                  Contact support →
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { v: String(faqs.length), l: "Questions" },
                  { v: "24/7", l: "Support" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="rounded-[4px] border border-[#E4E1D9] bg-white px-5 py-4 text-center"
                  >
                    <div className="font-['IBM_Plex_Mono',monospace] text-[22px] font-semibold text-[#0B0B0F]">
                      {s.v}
                    </div>
                    <div className="mt-1 font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.08em] text-[#6F6C78]">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* FAQ list */}
          <div className="lg:col-span-8">
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const open = expandedId === index;
                return (
                  <div
                    key={index}
                    className={
                      "overflow-hidden rounded-md border bg-white transition-colors " +
                      (open ? "border-[#FF5A1F]" : "border-[#E4E1D9]")
                    }
                  >
                    <button
                      onClick={() => setExpandedId(open ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                      aria-expanded={open}
                    >
                      <span className="text-[17px] font-semibold tracking-[-0.01em]">
                        {faq.question}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 90 : 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className={
                          "flex-shrink-0 font-['IBM_Plex_Mono',monospace] text-[20px] " +
                          (open ? "text-[#FF5A1F]" : "text-[#6F6C78]")
                        }
                      >
                        ›
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[#E4E1D9] px-6 pb-6 pt-4">
                            <p className="text-[15px] leading-[1.6] text-[#55525E]">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
