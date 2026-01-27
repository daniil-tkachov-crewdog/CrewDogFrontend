import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  Send,
  HeadphonesIcon,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendSupportMessage } from "@/services/support";
import faqHeroBg from "@/assets/faq-hero-bg.png";

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

export default function Support() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // if you have userEmail, set it as initial state here
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

    // basic validation to mirror SupportForm behavior
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
        // optional: name can be ignored by backend if not expected
      });

      // reset fields similar to SupportForm
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-cyan-500/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        {/* Ambient particles */}
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

        <div className="container mx-auto px-4 py-16 md:py-20 relative">
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
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <HeadphonesIcon className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent font-semibold">
                24/7 Support
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-white via-primary to-cyan-400 bg-clip-text text-transparent">
                We're Here to Help
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-foreground/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Get in touch with our support team. We're committed to helping you
              succeed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-8 pt-4"
            >
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">&lt;24h Response</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">Fast Support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-cyan-400/20 rounded-2xl blur-xl opacity-50" />
              <div className="relative glass-card p-8 rounded-2xl border border-primary/20">
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Send us a Message
                </h2>
                <p className="text-muted-foreground mb-6">
                  Fill out the form below and we'll get back to you shortly.
                </p>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>
                      Thank you for your message! We'll get back to you within
                      24 hours.
                    </span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot field - hidden from users */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ position: "absolute", left: "-9999px" }}
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name (optional)
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 glass-card border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 glass-card border-border/50 focus:border-primary/50 transition-colors"
                      required
                      disabled={loading}
                    />
                  </motion.div>

                  {/* Subject/Topic to mirror SupportForm */}
                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Label htmlFor="topic" className="text-sm font-medium">
                      Subject
                    </Label>
                    <Select
                      value={topic}
                      onValueChange={setTopic}
                      disabled={loading}
                    >
                      <SelectTrigger
                        id="topic"
                        className="h-11 glass-card border-border/50 focus:border-primary/50"
                      >
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">
                          Technical Issue
                        </SelectItem>
                        <SelectItem value="billing">
                          Billing Question
                        </SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[150px] glass-card border-border/50 focus:border-primary/50 transition-colors resize-none"
                      required
                      disabled={loading}
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 magnetic-button text-base font-medium"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="mr-2"
                          >
                            <Sparkles className="h-4 w-4" />
                          </motion.div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* FAQ Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="glass-card p-6 rounded-2xl border border-border/50">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Answers
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.details
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <summary className="font-medium cursor-pointer list-none flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="text-sm">{faq.question}</span>
                        <motion.span
                          className="text-primary group-open:rotate-180 transition-transform flex-shrink-0 ml-2"
                          animate={{ rotate: 0 }}
                        >
                          ▼
                        </motion.span>
                      </summary>
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="px-3 pb-3 pt-2 text-sm text-muted-foreground"
                      >
                        {faq.answer}
                      </motion.p>
                    </motion.details>
                  ))}
                </div>
              </div>

              {/* Response Time Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative group"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative glass-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg"
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Clock className="h-5 w-5 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Average Response Time
                      </h4>
                      <p className="text-2xl font-bold text-primary mb-1">
                        &lt; 24 hours
                      </p>
                      <p className="text-sm text-muted-foreground">
                        During business days
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to="/">
              <Button variant="outline" size="lg" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
