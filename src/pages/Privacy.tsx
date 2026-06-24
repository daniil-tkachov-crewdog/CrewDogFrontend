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
    title: "1. Information We Collect",
    content:
      "We collect information you provide direct to us, including when you create an account, run job searches, or contact us for support. This may include your name, email address, and the job descriptions you submit for analysis.",
  },
  {
    title: "2. How We Use Your Information",
    content: "We use the information we collect to:",
    list: [
      "Provide, maintain, and improve our services",
      "Process your job search requests",
      "Send you technical notices and support messages",
      "Respond to your comments and questions",
      "Monitor and analyze trends, usage, and activities",
    ],
  },
  {
    title: "3. Information Sharing",
    content:
      "We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf, such as hosting and data analysis.",
  },
  {
    title: "4. Data Security",
    content:
      "We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.",
  },
  {
    title: "5. Data Retention",
    content:
      "We retain your account information for as long as your account is active or as needed to provide you services. Search history may be deleted automatically after a specified period.",
  },
  {
    title: "6. Your Rights",
    content:
      "You have the right to access, update, or delete your personal information at any time through your account settings. You may also contact us to request deletion of your account.",
  },
  {
    title: "7. Changes to This Policy",
    content:
      "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.",
  },
  {
    title: "8. Contact Us",
    content:
      "If you have any questions about this privacy policy, please contact us through our support page.",
    hasLink: true,
  },
];

export default function Privacy() {
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
              Privacy &amp; security
            </span>
            <h1 className="text-[clamp(40px,8vw,76px)] font-bold leading-[0.98] tracking-[-0.03em]">
              Privacy <em className="not-italic text-[#FF5A1F]">policy.</em>
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
