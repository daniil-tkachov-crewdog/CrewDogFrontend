import { Link } from "react-router-dom";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Lock, Shield, Eye, Database, Clock, UserCheck, Bell, Mail } from "lucide-react";
import faqHeroBg from "@/assets/faq-hero-bg.jpg";

export default function Privacy() {
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
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-primary/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
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
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent font-semibold">
                Privacy & Security
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-foreground via-primary to-cyan-400 bg-clip-text text-transparent">
                Privacy Policy
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
                icon: Database,
                title: "1. Information We Collect",
                content: "We collect information you provide directly to us, including when you create an account, run job searches, or contact us for support. This may include your name, email address, and the job descriptions you submit for analysis."
              },
              {
                icon: Eye,
                title: "2. How We Use Your Information",
                content: "We use the information we collect to:",
                list: [
                  "Provide, maintain, and improve our services",
                  "Process your job search requests",
                  "Send you technical notices and support messages",
                  "Respond to your comments and questions",
                  "Monitor and analyze trends, usage, and activities"
                ]
              },
              {
                icon: UserCheck,
                title: "3. Information Sharing",
                content: "We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf, such as hosting and data analysis."
              },
              {
                icon: Shield,
                title: "4. Data Security",
                content: "We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction."
              },
              {
                icon: Clock,
                title: "5. Data Retention",
                content: "We retain your account information for as long as your account is active or as needed to provide you services. Search history may be deleted automatically after a specified period."
              },
              {
                icon: UserCheck,
                title: "6. Your Rights",
                content: "You have the right to access, update, or delete your personal information at any time through your account settings. You may also contact us to request deletion of your account."
              },
              {
                icon: Bell,
                title: "7. Changes to This Policy",
                content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date."
              },
              {
                icon: Mail,
                title: "8. Contact Us",
                content: "If you have any questions about this privacy policy, please contact us through our support page.",
                hasLink: true
              }
            ].map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="relative group"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-cyan-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative glass-card p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="mt-1"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className="h-5 w-5 text-primary" />
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
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}