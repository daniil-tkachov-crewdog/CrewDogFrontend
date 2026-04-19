import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { FileText, Search, UserPlus, MessageSquare } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HERO_IMAGE = "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?q=80&w=2000";

const HOW_IT_WORKS_STEPS = [
  {
    icon: <FileText className="h-5 w-5 text-white" />,
    title: "Find a job description you like",
    description: "Browse LinkedIn, job boards, or any career site and copy the job description for a role you're targeting.",
  },
  {
    icon: <Search className="h-5 w-5 text-white" />,
    title: "Paste it into CrewDog and run the search",
    description: "Drop the job description into CrewDog to get a list of relevant LinkedIn contacts — hiring managers, HR professionals, and decision-makers.",
    link: "/run",
    linkLabel: "Try it now →",
  },
  {
    icon: <UserPlus className="h-5 w-5 text-white" />,
    title: "Request a connection on LinkedIn",
    description: "Send connection requests to the contacts CrewDog surfaces. A short, personalised note goes a long way.",
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-white" />,
    title: "Message them",
    description: "Once connected, reach out directly. Going straight to the source beats any recruiter middleman.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={HERO_IMAGE}
              alt="Offshore oil rig"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/70 to-primary/40" />

          <div className="container mx-auto px-6 py-20 relative z-20">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="max-w-3xl space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white text-sm font-semibold">
                  <span>🚀</span>
                  <span>Skip the middleman. Apply smarter.</span>
                </div>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-extrabold leading-[1.1] text-white drop-shadow-lg"
              >
                Apply Direct Before<br />The Job Is Advertised
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-white/95 max-w-2xl drop-shadow"
              >
                CrewDog enables expats to connect directly with decision-makers on LinkedIn for international Oil &amp; Gas opportunities.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Link to="/run">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-orange hover:bg-orange-dark text-white shadow-[0_4px_20px_hsl(var(--orange-glow))] hover:-translate-y-0.5 transition-all"
                  >
                    Start Free Search
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 bg-transparent border-2 border-white/60 text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all"
                  >
                    Learn More
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-10 pt-4">
                {[
                  { value: "500+", label: "CVs Created" },
                  { value: "89%", label: "Interview Rate" },
                  { value: "4.8", label: "User Rating" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-4xl font-extrabold text-orange drop-shadow-sm">{stat.value}</span>
                    <span className="text-sm text-white/90">{stat.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Trust bar */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/20 opacity-75"
              >
                <span className="text-xs font-semibold text-white uppercase tracking-widest">
                  Trusted by professionals at leading Oil &amp; Gas companies
                </span>
                {["TOTAL", "Shell", "BP"].map((name) => (
                  <span key={name} className="text-white font-semibold text-sm">{name}</span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Three Ways to Win ── */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-primary text-sm font-semibold">
                <span>✨</span>
                <span>Three Ways to Win</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Your Complete Job Search Arsenal
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                AI-powered tools designed for international Oil &amp; Gas professionals
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 — AI Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative group rounded-2xl border border-border bg-card p-8 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60 group-hover:h-2 transition-all duration-300" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-3xl mb-6 shadow-[0_8px_20px_hsl(var(--shadow-ambient))]">
                  🔍
                </div>
                <h3 className="text-2xl font-bold mb-3">AI Search Assistant</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Paste any job description and discover the hiring company, decision-makers, and HR contacts on LinkedIn.
                </p>
                <Link to="/run">
                  <Button className="w-full">Try It Free</Button>
                </Link>
              </motion.div>

              {/* Card 2 — CV Co-Pilot */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative group rounded-2xl border border-border bg-card p-8 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange to-orange-dark group-hover:h-2 transition-all duration-300" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-3xl mb-6 shadow-[0_8px_20px_hsl(var(--orange-glow))]">
                  📄
                </div>
                <h3 className="text-2xl font-bold mb-3">CV Co-Pilot (Taylor)</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  AI-powered CV optimization for Oil &amp; Gas roles. Taylor analyzes your experience and tailors it for each position.
                </p>
                <a href="https://crewdogcv.ai" target="_blank" rel="noopener noreferrer">
                  <Button
                    className="w-full bg-orange hover:bg-orange-dark text-white shadow-[0_4px_20px_hsl(var(--orange-glow))]"
                  >
                    Build Your CV
                  </Button>
                </a>
              </motion.div>

              {/* Card 3 — Flying Squad */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative group rounded-2xl border border-border bg-card p-8 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange to-orange-dark group-hover:h-2 transition-all duration-300" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-3xl mb-6 shadow-[0_8px_20px_hsl(var(--orange-glow))]">
                  🚁
                </div>
                <h3 className="text-2xl font-bold mb-3">Flying Squad</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Pack your bags. Deploy to high-paying Oil &amp; Gas contracts in the UK and worldwide. Join the crew today.
                </p>
                <a href="https://crewdogcv.ai/" target="_blank" rel="noopener noreferrer">
                  <Button
                    className="w-full bg-orange hover:bg-orange-dark text-white shadow-[0_4px_20px_hsl(var(--orange-glow))]"
                  >
                    Join the Crew
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-primary text-sm font-semibold">
                <span>📋</span>
                <span>Simple Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">How It Works</h2>
            </motion.div>

            <div className="max-w-xl mx-auto">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <div key={index} className="relative flex gap-6">
                  {index < HOW_IT_WORKS_STEPS.length - 1 && (
                    <div className="absolute left-[23px] top-[52px] w-px h-[calc(100%-8px)] bg-gradient-to-b from-primary/40 to-transparent" />
                  )}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center relative z-10 shadow-[0_4px_12px_hsl(var(--shadow-ambient))]">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.05 }}
                    className="pb-10"
                  >
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">
                      Step {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold mt-1 mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    {step.link && (
                      <Link
                        to={step.link}
                        className="inline-block mt-3 text-sm font-medium text-primary hover:underline"
                      >
                        {step.linkLabel}
                      </Link>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="relative py-24 text-center overflow-hidden bg-gradient-to-r from-primary to-[hsl(217,91%,50%)]">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L0 0 0 40' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='1'/%3E%3C/svg%3E")`
            }}
          />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                Find roles before they are publicly advertised.
              </h2>
              <p className="text-xl text-white/95">
                Start your first search free. No credit card required.
              </p>
              <Link to="/run">
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 bg-orange hover:bg-orange-dark text-white shadow-[0_4px_20px_hsl(var(--orange-glow))] hover:-translate-y-0.5 transition-all"
                >
                  Start Your Search Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
