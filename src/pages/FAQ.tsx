import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, ChevronRight, HelpCircle, Sparkles, Zap, Shield } from "lucide-react";
import faqHeroBg from "@/assets/faq-hero-bg.png";

const faqs = [
  {
    question: "How does CrewDog work?",
    answer: "CrewDog uses advanced AI to analyze job descriptions from LinkedIn and other platforms to identify the actual hiring company behind recruiter posts. Our system cross-references multiple data sources to trace company information, find direct application routes, and provide contact details for hiring managers and HR personnel."
  },
  {
    question: "What information do I need to provide?",
    answer: "You can provide either a LinkedIn job URL or paste the complete job description. For best results, ensure the description is at least 300 characters and includes location information (city, state, or country). The more detailed the job posting, the more accurate our results will be."
  },
  {
    question: "How accurate are the results?",
    answer: "Our AI achieves over 90% accuracy by cross-referencing multiple data sources including company databases, LinkedIn profiles, and public records. However, results depend on the quality and completeness of the job description provided. We continuously improve our algorithms based on user feedback."
  },
  {
    question: "What's included in the free plan?",
    answer: "The free plan includes 3 job searches per month. Each search provides company identification, official website links, career page URLs, and basic contact information. You also get access to search history for 30 days and email support."
  },
  {
    question: "Can I search for jobs outside my country?",
    answer: "Yes! CrewDog works with job postings from any location worldwide. Our system is designed to handle international job markets and can identify companies across different regions, as long as location information is included in the job description."
  },

  {
    question: "Is my data secure and private?",
    answer: "Absolutely. We take data security seriously and are fully GDPR compliant. We don't share your searches with third parties, don't sell your data, and only store job descriptions temporarily to process your request. Your search history is private and can be deleted at any time from your account."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through our secure payment processor Stripe. All transactions are encrypted and we never store your payment information on our servers."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees, and you'll continue to have access to paid features until the end of your current billing period."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied with CrewDog within the first week, contact our support team and we'll process a full refund, no questions asked."
  },
  {
    question: "How do I upgrade or downgrade my plan?",
    answer: "You can change your plan at any time from your account settings. When upgrading, you'll have immediate access to additional features. When downgrading, changes take effect at the start of your next billing cycle."
  },
  {
    question: "What if I get incorrect results?",
    answer: "If the results do not look correct, we recommend refining your search criteria or running the search again. Small adjustments often improve accuracy and relevance"
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { scrollY } = useScroll();
  
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden border-b border-border/40">
        {/* Background Image with Overlay */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${faqHeroBg})`,
              filter: 'brightness(0.4)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * 600,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: [null, Math.random() * 600],
                x: [null, Math.random() * window.innerWidth],
                scale: [null, Math.random() * 0.5 + 0.5],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="max-w-3xl mx-auto text-center space-y-8"
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
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent font-semibold">
                Help Center
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent">
                How can we
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent animate-glow-pulse">
                help you?
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome to our Help Center! Here, you'll find answers to frequently asked questions, 
              helpful guides, and useful tips to assist you in getting the most out of CrewDog.
            </motion.p>

            {/* Premium Search Bar */}
            <motion.div 
              className="relative max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan-400/20 rounded-2xl blur-xl" />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-16 pl-14 pr-5 text-base glass-card border-2 border-primary/30 rounded-2xl focus:border-primary/60 transition-all shadow-xl"
                />
                <motion.div
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="h-5 w-5 text-primary" />
                </motion.div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-8 pt-8"
            >
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-foreground/70">Instant Answers</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4"
            >
              <div className="lg:sticky lg:top-24 space-y-6">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-cyan-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative glass-card p-6 rounded-2xl border border-primary/20">
                    <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </motion.div>
                      Support
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
                      FAQs
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Have questions? We've got answers! Check out our Frequently Asked Questions (FAQs) 
                      to find quick solutions to common queries. Save time and get the information you need 
                      right here.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Link 
                    to="/support" 
                    className="group inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <span>Contact Support</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </Link>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-4 pt-6"
                >
                  <div className="glass-card p-4 rounded-xl border border-border/50">
                    <div className="text-2xl font-bold text-primary mb-1">12</div>
                    <div className="text-xs text-muted-foreground">Questions</div>
                  </div>
                  <div className="glass-card p-4 rounded-xl border border-border/50">
                    <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                    <div className="text-xs text-muted-foreground">Support</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* FAQ List */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {filteredFaqs.length > 0 ? (
                  <motion.div
                    key="faq-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {filteredFaqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01, y: -2 }}
                      >
                        <button
                          onClick={() => setExpandedId(expandedId === index ? null : index)}
                          className="relative w-full text-left p-6 rounded-2xl glass-card border border-border hover:border-primary/50 transition-all group overflow-hidden"
                        >
                          {/* Hover gradient effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {/* Animated corner accent */}
                          <motion.div
                            className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />

                          <div className="relative flex items-center justify-between gap-4">
                            <span className="font-semibold text-lg pr-4 group-hover:text-primary transition-colors">
                              {faq.question}
                            </span>
                            <motion.div
                              animate={{ 
                                rotate: expandedId === index ? 90 : 0,
                                scale: expandedId === index ? 1.1 : 1
                              }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                              className="flex-shrink-0"
                            >
                              <ChevronRight 
                                className={`h-6 w-6 transition-colors ${
                                  expandedId === index ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                                }`}
                              />
                            </motion.div>
                          </div>
                          
                          <AnimatePresence>
                            {expandedId === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <motion.div
                                  initial={{ y: -10 }}
                                  animate={{ y: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="relative"
                                >
                                  <div className="mt-4 pt-4 border-t border-border/50">
                                    <p className="text-muted-foreground leading-relaxed">
                                      {faq.answer}
                                    </p>
                                  </div>
                                  
                                  {/* Decorative gradient line */}
                                  <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="mt-4 h-1 bg-gradient-to-r from-primary via-cyan-400 to-transparent rounded-full"
                                  />
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-16 glass-card rounded-2xl p-8 border border-primary/20"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Search className="h-16 w-16 text-primary mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try different keywords or{" "}
                      <Link to="/support" className="text-primary hover:underline font-medium">
                        contact support
                      </Link>
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => setSearchQuery("")}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                      >
                        Clear Search
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}