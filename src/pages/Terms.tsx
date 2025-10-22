import { Link } from "react-router-dom";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Scale, Shield, FileText, Sparkles } from "lucide-react";
import faqHeroBg from "@/assets/faq-hero-bg.jpg";

export default function Terms() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-purple-500/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: Math.random() * 400,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: [null, Math.random() * 400],
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
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Scale className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-semibold">
                Legal
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-foreground via-primary to-purple-400 bg-clip-text text-transparent">
                Terms of Use
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-foreground/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Effective date: January 1, 2025
            </motion.p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                title: "1. Acceptance of Terms",
                content: "By accessing and using CrewDog, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service."
              },
              {
                title: "2. Service Description",
                content: "CrewDog provides job search analysis services that help identify hiring companies behind job postings. Results are provided on a best-effort basis and accuracy may vary based on available information."
              },
              {
                title: "3. User Accounts",
                content: "When you create an account with us, you must provide accurate and complete information.",
                list: [
                  "Maintaining the security of your account and password",
                  "All activities that occur under your account",
                  "Notifying us immediately of any unauthorized use"
                ]
              },
              {
                title: "4. Acceptable Use",
                content: "You agree not to:",
                list: [
                  "Use the service for any illegal purpose",
                  "Attempt to gain unauthorized access to our systems",
                  "Interfere with or disrupt the service",
                  "Use automated systems to access the service excessively",
                  "Share your account credentials with others"
                ]
              },
              {
                title: "5. Subscription and Payment",
                content: "Paid subscriptions are billed in advance on a monthly or annual basis. You may cancel your subscription at any time, but refunds are not provided for partial periods."
              },
              {
                title: "6. Intellectual Property",
                content: "The service and its original content, features, and functionality are owned by CrewDog and are protected by international copyright, trademark, and other intellectual property laws."
              },
              {
                title: "7. Disclaimer of Warranties",
                content: "The service is provided \"as is\" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. Results are provided for informational purposes and accuracy is not guaranteed."
              },
              {
                title: "8. Limitation of Liability",
                content: "In no event shall CrewDog be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service."
              },
              {
                title: "9. Termination",
                content: "We may terminate or suspend your account immediately, without prior notice, for any breach of these terms. Upon termination, your right to use the service will cease immediately."
              },
              {
                title: "10. Changes to Terms",
                content: "We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting the new terms on this page."
              },
              {
                title: "11. Contact",
                content: "Questions about these terms should be sent to us through our support page.",
                hasLink: true
              }
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative glass-card p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="mt-1"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <FileText className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div className="flex-1 space-y-4">
                      <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        {section.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {section.content}
                        {section.hasLink && (
                          <>
                            {" "}
                            <Link to="/support" className="text-primary hover:underline font-medium">
                              support page
                            </Link>.
                          </>
                        )}
                      </p>
                      {section.list && (
                        <ul className="space-y-2 mt-4">
                          {section.list.map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3 text-muted-foreground"
                            >
                              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}