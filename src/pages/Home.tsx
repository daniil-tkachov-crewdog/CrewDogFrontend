import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Target, Search, TrendingUp, CheckCircle2, Users, Zap, ArrowRight, Sparkles, BarChart3, Clock, Shield, Rocket, PlayCircle, Download } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import heroBg from "@/assets/hero-premium-bg.jpg";
import howItWorks from "@/assets/how-it-works.jpg";
import dashboardPreview from "@/assets/dashboard-preview.jpg";
import dataBg from "@/assets/data-bg.jpg";

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

// Chart data
const successRateData = [
  { month: "Jan", direct: 87, recruiter: 34 },
  { month: "Feb", direct: 89, recruiter: 31 },
  { month: "Mar", direct: 92, recruiter: 38 },
  { month: "Apr", direct: 94, recruiter: 35 },
  { month: "May", direct: 96, recruiter: 33 },
  { month: "Jun", direct: 94, recruiter: 36 }
];

const jobAnalysisData = [
  { name: "Week 1", jobs: 450 },
  { name: "Week 2", jobs: 780 },
  { name: "Week 3", jobs: 1200 },
  { name: "Week 4", jobs: 1560 }
];

const timeComparisonData = [
  { method: "Traditional", hours: 12 },
  { method: "With CrewDog", hours: 2 }
];

export default function Home() {
  const [counts, setCounts] = useState({ searches: 0, jobs: 0, success: 0 });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

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
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Topbar />
      
      <main className="flex-1">
        {/* Hero Section with Parallax */}
        <motion.section 
          ref={heroRef}
          style={{ y: smoothY, opacity, scale }}
          className="relative overflow-hidden min-h-screen flex items-center"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img src={heroBg} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-primary/20" />
          </div>

          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight 
                }}
                animate={{
                  y: [null, Math.random() * -500],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>
          
          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="max-w-5xl mx-auto text-center space-y-8"
            >
              <motion.div 
                variants={fadeInUp} 
                className="inline-block"
                whileHover={{ scale: 1.05 }}
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-sm font-medium mb-6 animate-glow-pulse">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>AI-Powered Job Intelligence Platform</span>
                </div>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp} 
                className="text-6xl md:text-8xl font-bold tracking-tight leading-tight"
              >
                Skip Recruiters.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary animate-shimmer bg-[length:200%_auto]">
                  Find Real Employers.
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp} 
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                Discover the actual hiring company behind every LinkedIn job post. Apply directly to decision makers and increase your success rate by <span className="text-primary font-bold">400%</span>.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp} 
                className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
              >
                <Link to="/run">
                  <Button size="lg" className="text-lg px-12 py-7 magnetic-button glow-effect group">
                    Start Free Search
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="text-lg px-12 py-7 group">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-8 pt-12 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Free Forever Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Instant Results</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>


        {/* Stats Section with Data Background */}
        <section className="relative py-24 border-y border-border/40 overflow-hidden">
          <div className="absolute inset-0">
            <img src={dataBg} alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Proven Results</h2>
              <p className="text-xl text-muted-foreground">Join thousands of successful job seekers</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-3 p-6 glass-card glow-effect"
              >
                <Rocket className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-5xl md:text-6xl font-bold text-primary">{counts.searches.toLocaleString()}+</div>
                <div className="text-muted-foreground font-medium">Searches Completed</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center space-y-3 p-6 glass-card glow-effect"
              >
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-5xl md:text-6xl font-bold text-primary">{counts.jobs.toLocaleString()}+</div>
                <div className="text-muted-foreground font-medium">Jobs Analyzed</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center space-y-3 p-6 glass-card glow-effect"
              >
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-5xl md:text-6xl font-bold text-primary">{counts.success}%</div>
                <div className="text-muted-foreground font-medium">Success Rate</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center space-y-3 p-6 glass-card glow-effect"
              >
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-5xl md:text-6xl font-bold text-primary">80%</div>
                <div className="text-muted-foreground font-medium">Time Saved</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium mb-6">
                <Shield className="h-4 w-4 text-primary" />
                <span>Premium Dashboard Experience</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Powerful Analytics at Your Fingertips
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get instant access to company intelligence, direct contacts, and actionable insights
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/50 to-primary-glow/50 rounded-2xl blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <img 
                  src={dashboardPreview} 
                  alt="Dashboard Preview" 
                  className="relative w-full rounded-2xl shadow-2xl border border-border/50"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to finding your dream job
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto mb-16"
            >
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-primary-glow/30 rounded-xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <img 
                  src={howItWorks} 
                  alt="How CrewDog Works" 
                  className="relative w-full rounded-xl shadow-xl border border-border/50"
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Paste LinkedIn URL",
                  description: "Copy any LinkedIn job posting URL and paste it into CrewDog's search bar. Works with any job listing.",
                  icon: Search,
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  step: "02",
                  title: "AI Analysis",
                  description: "Our advanced AI analyzes the job post in seconds, identifying the actual hiring company behind recruiter listings.",
                  icon: Sparkles,
                  color: "from-purple-500 to-pink-500"
                },
                {
                  step: "03",
                  title: "Get Direct Contacts",
                  description: "Receive company details, career page links, hiring manager profiles, and direct application methods instantly.",
                  icon: Target,
                  color: "from-green-500 to-emerald-500"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <Card className="p-8 h-full glass-card hover:shadow-2xl transition-all relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />
                    <div className="relative">
                      <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg">
                        <item.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Data Visualization Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                The Numbers Don't Lie
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how CrewDog transforms your job search success
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Success Rate Comparison Chart */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6 glass-card">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Success Rate Comparison
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={successRateData}>
                      <defs>
                        <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRecruiter" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="direct" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorDirect)" 
                        name="Direct Application"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="recruiter" 
                        stroke="hsl(var(--muted-foreground))" 
                        fillOpacity={1} 
                        fill="url(#colorRecruiter)" 
                        name="Via Recruiter"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Direct applications show <span className="text-primary font-bold">3x higher</span> success rate
                  </p>
                </Card>
              </motion.div>

              {/* Jobs Analyzed Chart */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6 glass-card">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Jobs Analyzed (Monthly)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={jobAnalysisData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar 
                        dataKey="jobs" 
                        fill="hsl(var(--primary))" 
                        radius={[8, 8, 0, 0]}
                        name="Jobs Analyzed"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Growing <span className="text-primary font-bold">250%</span> month over month
                  </p>
                </Card>
              </motion.div>

              {/* Time Saved Chart */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <Card className="p-6 glass-card">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Time Saved Per Job Search
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={timeComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis type="category" dataKey="method" stroke="hsl(var(--muted-foreground))" width={150} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar 
                        dataKey="hours" 
                        fill="hsl(var(--primary))" 
                        radius={[0, 8, 8, 0]}
                        name="Hours"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Save <span className="text-primary font-bold">10+ hours</span> on every job search
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What is CrewDog */}
        <section className="py-24">
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
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Card className="p-6 h-full glass-card hover:shadow-xl transition-all">
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
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Card className="p-6 h-full glass-card hover:shadow-xl transition-all">
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
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Card className="p-6 h-full glass-card hover:shadow-xl transition-all">
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
        <section className="py-24 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="container mx-auto px-4 relative z-10">
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

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { text: "Get past recruiter gatekeepers who filter out qualified candidates", icon: Shield },
                { text: "Apply directly to hiring managers and decision makers", icon: Target },
                { text: "Avoid having your details shared without consent", icon: CheckCircle2 },
                { text: "Skip the recruiter markup on your potential salary", icon: TrendingUp },
                { text: "Build direct relationships with employers", icon: Users },
                { text: "Increase response rates by 3-5x with direct applications", icon: Rocket }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="flex items-start gap-4 p-6 rounded-xl glass-card hover:shadow-lg transition-all"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-lg leading-relaxed pt-2">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-24">
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
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Card className="p-8 glass-card h-full hover:shadow-xl transition-all">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Company Intelligence</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Actual hiring company name</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Company website and career page</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Industry and size information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Recent hiring activity</span>
                    </li>
                  </ul>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Card className="p-8 glass-card h-full hover:shadow-xl transition-all">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Direct Contacts</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Hiring manager profiles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>HR contact information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Team lead connections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Alternative application methods</span>
                    </li>
                  </ul>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="max-w-4xl mx-auto p-12 md:p-16 text-center glass-card glow-effect relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-glow/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium mb-8">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Join 12,000+ Successful Job Seekers</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Ready to Find Real Opportunities?
                  </h2>
                  <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                    Start your first search free. No credit card required. Get instant access to company intelligence and direct contacts.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/run">
                      <Button size="lg" className="text-lg px-12 py-7 magnetic-button group">
                        Start Your Search Now
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link to="/pricing">
                      <Button size="lg" variant="outline" className="text-lg px-12 py-7">
                        View Pricing
                      </Button>
                    </Link>
                  </div>

                  <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Instant Results</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Cancel Anytime</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>100% Secure</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}