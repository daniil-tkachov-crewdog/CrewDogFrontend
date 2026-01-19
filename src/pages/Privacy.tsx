import { Link } from "react-router-dom";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowLeft, Lock, Shield, Eye, Database, Clock, UserCheck, Bell, Mail, CheckCircle2, Sparkles } from "lucide-react";
import faqHeroBg from "@/assets/faq-hero-bg.png";

export default function Privacy() {
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll();
  
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary z-50 origin-left"
        style={{ scaleX }}
      />
      
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
          {[...Array(20)].map((_, i) => (
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

        {/* Floating Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
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
              <span className="bg-gradient-to-r from-white via-primary to-cyan-400 bg-clip-text text-transparent">
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
                color: "from-blue-500 to-cyan-500",
                title: "1. Information We Collect",
                content: "We collect information you provide directly to us, including when you create an account, run job searches, or contact us for support. This may include your name, email address, and the job descriptions you submit for analysis."
              },
              {
                icon: Eye,
                color: "from-purple-500 to-pink-500",
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
                color: "from-green-500 to-emerald-500",
                title: "3. Information Sharing",
                content: "We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf, such as hosting and data analysis."
              },
              {
                icon: Shield,
                color: "from-primary to-cyan-500",
                title: "4. Data Security",
                content: "We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction."
              },
              {
                icon: Clock,
                color: "from-orange-500 to-red-500",
                title: "5. Data Retention",
                content: "We retain your account information for as long as your account is active or as needed to provide you services. Search history may be deleted automatically after a specified period."
              },
              {
                icon: UserCheck,
                color: "from-indigo-500 to-purple-500",
                title: "6. Your Rights",
                content: "You have the right to access, update, or delete your personal information at any time through your account settings. You may also contact us to request deletion of your account."
              },
              {
                icon: Bell,
                color: "from-yellow-500 to-orange-500",
                title: "7. Changes to This Policy",
                content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date."
              },
              {
                icon: Mail,
                color: "from-cyan-500 to-blue-500",
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
                  className="relative group"
                >
                  {/* Animated gradient background on hover */}
                  <motion.div 
                    className={`absolute -inset-4 bg-gradient-to-r ${section.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity`}
                    initial={false}
                    whileHover={{ scale: 1.05 }}
                  />
                  
                  {/* Animated border gradient */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${section.color} opacity-20`} />
                  </motion.div>

                  <motion.div 
                    className="relative glass-card p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all overflow-hidden"
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Decorative corner elements */}
                    <motion.div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.color} opacity-5 rounded-bl-full`}
                      initial={{ scale: 0, rotate: 0 }}
                      whileHover={{ scale: 1, rotate: 10 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.div
                      className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${section.color} opacity-5 rounded-tr-full`}
                      initial={{ scale: 0, rotate: 0 }}
                      whileHover={{ scale: 1, rotate: -10 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    />

                    <div className="flex items-start gap-4">
                      <motion.div
                        className={`mt-1 p-3 rounded-xl bg-gradient-to-br ${section.color} shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <IconComponent className="h-5 w-5 text-white" />
                      </motion.div>
                      <div className="flex-1 space-y-4">
                        <h2 className={`text-xl md:text-2xl font-semibold bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                          {section.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {section.content}
                          {section.hasLink && (
                            <>
                              {" "}
                              <Link to="/support" className="text-primary hover:underline font-medium inline-flex items-center gap-1 group/link">
                                support page
                                <motion.span
                                  animate={{ x: [0, 3, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  →
                                </motion.span>
                              </Link>.
                            </>
                          )}
                        </p>
                        {section.list && (
                          <ul className="space-y-3 mt-4">
                            {section.list.map((item, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ x: 4 }}
                                className="flex items-start gap-3 text-muted-foreground group/item"
                              >
                                <motion.div
                                  whileHover={{ scale: 1.2, rotate: 360 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <CheckCircle2 className={`h-4 w-4 bg-gradient-to-br ${section.color} bg-clip-text text-transparent mt-0.5 flex-shrink-0`} />
                                </motion.div>
                                <span className="group-hover/item:text-foreground transition-colors">{item}</span>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
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