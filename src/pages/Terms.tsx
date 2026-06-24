import { Link } from "react-router-dom";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useSpring } from "framer-motion";

const sections: Array<{
  title: string;
  content: string;
  list?: string[];
  hasLink?: boolean;
}> = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using CrewDog, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.",
  },
  {
    title: "2. Service Description",
    content:
      "CrewDog provides job search analysis services that help identify hiring companies behind job postings. Results are provided on a best-effort basis and accuracy may vary based on available information.",
  },
  {
    title: "3. User Accounts",
    content:
      "When you create an account with us, you must provide accurate and complete information.",
    list: [
      "Maintaining the security of your account and password",
      "All activities that occur under your account",
      "Notifying us immediately of any unauthorized use",
    ],
  },
  {
    title: "4. Acceptable Use",
    content: "You agree not to:",
    list: [
      "Use the service for any illegal purpose",
      "Attempt to gain unauthorized access to our systems",
      "Interfere with or disrupt the service",
      "Use automated systems to access the service excessively",
      "Share your account credentials with others",
    ],
  },
  {
    title: "5. Subscription and Payment",
    content:
      "Paid subscriptions are billed in advance on a monthly or annual basis. You may cancel your subscription at any time, but refunds are not provided for partial periods.",
  },
  {
    title: "6. Intellectual Property",
    content:
      "The service and its original content, features, and functionality are owned by CrewDog and are protected by international copyright, trademark, and other intellectual property laws.",
  },
  {
    title: "7. Disclaimer of Warranties",
    content:
      'The service is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. Results are provided for informational purposes and accuracy is not guaranteed.',
  },
  {
    title: "8. Limitation of Liability",
    content:
      "In no event shall CrewDog be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.",
  },
  {
    title: "9. Termination",
    content:
      "We may terminate or suspend your account immediately, without prior notice, for any breach of these terms. Upon termination, your right to use the service will cease immediately.",
  },
  {
    title: "10. Changes to Terms",
    content:
      "We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting the new terms on this page.",
  },
  {
    title: "11. Contact",
    content:
      "Questions about these terms should be sent to us through our support page.",
    hasLink: true,
  },
];

export default function Terms() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] text-[#0B0B0F] font-['Space_Grotesk',system-ui,sans-serif]">
      {/* Reading progress bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-[#FF5A1F]"
        style={{ scaleX }}
      />

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
              Legal
            </span>
            <h1 className="text-[clamp(40px,8vw,76px)] font-bold leading-[0.98] tracking-[-0.03em]">
              Terms of <em className="not-italic text-[#FF5A1F]">use.</em>
            </h1>
            <p className="mt-[26px] font-['IBM_Plex_Mono',monospace] text-[13px] tracking-[0.06em] text-[#C9C6CF]">
              Effective date: January 1, 2025
            </p>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 py-14">
        <div className="mx-auto w-full max-w-[800px] px-6">
          <Link
            to="/"
            className="mb-8 inline-block font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.06em] text-[#6F6C78] transition-colors hover:text-[#0B0B0F]"
          >
            ← Back to home
          </Link>

          <div className="space-y-4">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.04 }}
                className="rounded-md border border-[#E4E1D9] bg-white p-7 sm:p-8"
              >
                <h2 className="text-[20px] font-semibold tracking-[-0.01em] sm:text-[22px]">
                  {section.title}
                </h2>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#55525E]">
                  {section.content}
                  {section.hasLink && (
                    <>
                      {" "}
                      <Link
                        to="/support"
                        className="font-medium text-[#FF5A1F] hover:underline"
                      >
                        support page →
                      </Link>
                      .
                    </>
                  )}
                </p>
                {section.list && (
                  <ul className="mt-4 space-y-2.5">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-[2px] flex-shrink-0 font-['IBM_Plex_Mono',monospace] text-[#FF5A1F]">
                          ›
                        </span>
                        <span className="text-[15px] leading-[1.6] text-[#55525E]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
