import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Target, Search, TrendingUp, CheckCircle2, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [counts, setCounts] = useState({ searches: 0, jobs: 0, success: 0 });

  useEffect(() => {
    const targets = { searches: 12847, jobs: 45023, success: 94 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        searches: Math.floor(targets.searches * progress),
        jobs: Math.floor(targets.jobs * progress),
        success: Math.floor(targets.success * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LDEzMCwyNDYsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          
          <div className="container mx-auto px-4 py-20 md:py-32 relative">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-block">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium mb-6">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Skip the middleman. Apply smarter.</span>
                </div>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight">
                The LinkedIn Job
                <span className="block text-primary">Recommendation Engine</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Find the real employer behind recruiter posts. Stop wasting time on middlemen and apply directly to decision makers.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link to="/run">
                  <Button size="lg" className="text-lg px-8 py-6 magnetic-button glow-effect">
                    Start Free Search
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center space-y-2"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary">{counts.searches.toLocaleString()}+</div>
                <div className="text-muted-foreground">Searches Completed</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center space-y-2"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary">{counts.jobs.toLocaleString()}+</div>
                <div className="text-muted-foreground">Jobs Analyzed</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-2"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary">{counts.success}%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </motion.div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              * Demo statistics for illustration purposes
            </p>
          </div>
        </section>

        {/* What is CrewDog */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center space-y-6 mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold">What is CrewDog?</h2>
              <p className="text-xl text-muted-foreground">
                CrewDog analyzes LinkedIn job posts to identify the actual hiring company behind recruiter listings. 
                Get direct application routes and skip the middleman entirely.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 h-full glass-card hover:shadow-xl transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Intelligent Analysis</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes job descriptions to trace the real employer, even when posts are made by third-party recruiters.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 h-full glass-card hover:shadow-xl transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Direct Routes</h3>
                  <p className="text-muted-foreground">
                    Get company websites, career pages, and hiring manager contacts to bypass recruiters and apply directly.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 h-full glass-card hover:shadow-xl transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Higher Success</h3>
                  <p className="text-muted-foreground">
                    Direct applications have significantly higher response rates than going through third-party recruiters.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Use CrewDog */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center space-y-6 mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold">Why Job Hunters Use CrewDog</h2>
              <p className="text-xl text-muted-foreground">
                Stop losing opportunities to recruiter filters and middlemen fees
              </p>
            </motion.div>

            <div className="max-w-2xl mx-auto space-y-4">
              {[
                "Get past recruiter gatekeepers who filter out qualified candidates",
                "Apply directly to hiring managers and decision makers",
                "Avoid having your details shared without consent",
                "Skip the recruiter markup on your potential salary",
                "Build direct relationships with employers",
                "Increase response rates by 3-5x with direct applications"
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl glass-card"
                >
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center space-y-6 mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold">What You Get</h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive intelligence to bypass recruiters and connect directly
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="p-6 glass-card">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Company Intelligence
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Actual hiring company name</li>
                  <li>• Company website and career page</li>
                  <li>• Industry and size information</li>
                  <li>• Recent hiring activity</li>
                </ul>
              </Card>

              <Card className="p-6 glass-card">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Direct Contacts
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Hiring manager profiles</li>
                  <li>• HR contact information</li>
                  <li>• Team lead connections</li>
                  <li>• Alternative application methods</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto p-12 text-center glass-card glow-effect">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Real Opportunities?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start your first search free. No credit card required.
              </p>
              <Link to="/run">
                <Button size="lg" className="text-lg px-12 py-6 magnetic-button">
                  Start Your Search Now
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}