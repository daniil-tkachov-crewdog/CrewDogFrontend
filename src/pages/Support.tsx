import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { sendSupportMessage } from "@/services/support";

const faqs = [
  {
    question: "How quickly will I get a response?",
    answer:
      "We typically respond to all inquiries within 24 hours during business days. For urgent issues, our live chat support is available during business hours for immediate assistance.",
  },
  {
    question: "What information should I include in my message?",
    answer:
      "Please include your account email, a detailed description of your issue or question, and any relevant screenshots. This helps us provide you with faster, more accurate support.",
  },
  {
    question: "Do you offer phone support?",
    answer:
      "Yes, phone support is available for Pro and Business plan subscribers during business hours (9 AM - 6 PM GMT, Monday to Friday).",
  },
  {
    question: "Can I schedule a demo or consultation?",
    answer:
      "Absolutely! Business plan subscribers can schedule dedicated consultation sessions. Contact us through this form or email us direct to arrange a convenient time.",
  },
];

const MONO_LABEL =
  "block font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.08em] text-[#6F6C78] mb-[10px]";
const INPUT =
  "w-full font-['Space_Grotesk',sans-serif] text-[15px] text-[#0B0B0F] bg-[#F4F2EE] border border-[#E4E1D9] rounded-[3px] px-[14px] py-[12px] transition-colors focus:outline-none focus:border-[#FF5A1F] disabled:opacity-50";

export default function Support() {
  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess(false);

    // bot check
    if (honeypot) return;

    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail || !trimmedMessage) {
      const msg = "Email and message are required.";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);
      await sendSupportMessage({
        email: trimmedEmail,
        message: trimmedMessage,
        topic: (topic as any) || "other",
      });

      setName("");
      setEmail("");
      setTopic("");
      setMessage("");
      setSuccess(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch (err: any) {
      const msg = err?.message || "Failed to send. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
              Support · Radar
            </span>
            <h1 className="max-w-[15ch] text-[clamp(40px,8vw,76px)] font-bold leading-[0.98] tracking-[-0.03em]">
              We're here to <em className="not-italic text-[#FF5A1F]">help.</em>
            </h1>
            <p className="mt-[26px] max-w-[54ch] text-[clamp(16px,2.2vw,19px)] leading-[1.6] text-[#C9C6CF]">
              Get in touch with our team. Most messages get a reply within 24
              hours on business days.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.08em] text-[#6F6C78]">
              <span>‹24h response</span>
              <span>100% secure</span>
              <span>Fast support</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 py-16">
        <div className="mx-auto grid w-full max-w-[1040px] grid-cols-1 gap-8 px-6 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-md border border-[#E4E1D9] bg-white p-7 sm:p-8">
            <span className="font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.16em] text-[#FF5A1F]">
              // send a message
            </span>
            <h2 className="mt-2 text-[24px] tracking-[-0.02em]">Contact support</h2>
            <p className="mt-2 text-[15px] leading-[1.6] text-[#55525E]">
              Fill out the form and we'll get back to you shortly.
            </p>

            {success && (
              <div className="mt-6 rounded-[4px] border border-[#FF5A1F]/40 bg-[#FF5A1F]/[0.06] px-4 py-3 font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.04em] text-[#FF5A1F]">
                ✓ Thanks for your message! We'll get back to you within 24 hours.
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-[4px] border border-red-300 bg-red-50 px-4 py-3 font-['IBM_Plex_Mono',monospace] text-[12px] text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Honeypot — hidden from users */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ position: "absolute", left: "-9999px" }}
                tabIndex={-1}
                aria-hidden="true"
              />

              <div>
                <label htmlFor="name" className={MONO_LABEL}>
                  Name (optional)
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={INPUT}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className={MONO_LABEL}>
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={INPUT}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="topic" className={MONO_LABEL}>
                  Subject
                </label>
                <select
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={loading}
                  className={INPUT + " cursor-pointer"}
                >
                  <option value="">Select a topic</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className={MONO_LABEL}>
                  Message *
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us how we can help..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={INPUT + " min-h-[150px] resize-y leading-[1.55]"}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[2px] bg-[#FF5A1F] px-[22px] py-[13px] font-['Space_Grotesk',sans-serif] text-[15px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-md border border-[#E4E1D9] bg-white p-6 sm:p-7">
              <span className="font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.16em] text-[#FF5A1F]">
                // quick answers
              </span>
              <div className="mt-4 divide-y divide-[#E4E1D9]">
                {faqs.map((faq, index) => (
                  <details key={index} className="group py-1">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-[15px] font-medium">
                      <span>{faq.question}</span>
                      <span className="flex-shrink-0 font-['IBM_Plex_Mono',monospace] text-[#FF5A1F] transition-transform group-open:rotate-90">
                        ›
                      </span>
                    </summary>
                    <p className="pb-3 text-[14px] leading-[1.6] text-[#55525E]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div className="rounded-md border border-[#E4E1D9] border-l-4 border-l-[#FF5A1F] bg-white p-6">
              <span className="font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.16em] text-[#6F6C78]">
                Average response time
              </span>
              <p className="mt-2 font-['IBM_Plex_Mono',monospace] text-[28px] font-semibold text-[#FF5A1F]">
                ‹ 24 hours
              </p>
              <p className="mt-1 text-[14px] text-[#55525E]">During business days</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
