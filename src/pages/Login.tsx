import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Chrome, 
  Plane, 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Zap, 
  Users, 
  Mail,
  Lock,
  TrendingUp,
  Award,
  CheckCircle2,
  Star,
  Briefcase,
  Eye,
  EyeOff
} from "lucide-react";
import { useMockAuth } from "@/hooks/useMockAuth";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import loginBg1 from "@/assets/login-bg-1.jpg";
import loginBg2 from "@/assets/login-bg-2.jpg";
import loginBg3 from "@/assets/login-bg-3.jpg";
import loginBg4 from "@/assets/login-bg-4.jpg";

const backgroundImages = [loginBg1, loginBg2, loginBg3, loginBg4];

const stats = [
  { icon: Users, value: "50K+", label: "Active Users" },
  { icon: Briefcase, value: "10K+", label: "Job Listings" },
  { icon: Award, value: "95%", label: "Success Rate" },
];

const features = [
  { icon: Zap, text: "AI-Powered Job Matching" },
  { icon: Shield, text: "Secure & Private" },
  { icon: TrendingUp, text: "Career Growth Tools" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    text: "CrewDog helped me land my dream job in just 2 weeks!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Product Manager", 
    text: "The best job search platform I've ever used. Highly recommended!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    text: "Found multiple opportunities that perfectly matched my skills.",
    rating: 5,
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useMockAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/run");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter an email");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    login(email);
    toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
    navigate("/run");
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Background Carousel */}
      <Carousel
        setApi={setCarouselApi}
        className="absolute inset-0 w-full h-full"
        plugins={[
          Autoplay({
            delay: 6000,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {backgroundImages.map((image, index) => (
            <CarouselItem key={index} className="h-screen">
              <div className="relative h-full w-full">
                <motion.img
                  src={image}
                  alt={`Background ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
                
                {/* Animated Gradient Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/4 transform -translate-x-1/2 z-20 flex gap-3">
        {backgroundImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => carouselApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? "w-12 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Left Content Section */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-white w-full"
        >
          {/* Premium Logo */}
          <motion.div
            className="flex items-center gap-4 mb-12"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative group">
              <motion.div
                className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:bg-primary/50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
              <div className="relative bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-4 rounded-2xl shadow-2xl group-hover:shadow-primary/50 transition-all">
                <Plane className="h-10 w-10 text-white" />
              </div>
            </div>
            <div>
              <motion.h1 
                className="text-4xl font-bold tracking-wider bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                CREWDOG
              </motion.h1>
              <p className="text-sm text-white/60 tracking-wide">Career Platform</p>
            </div>
          </motion.div>

          {/* Main Heading with Enhanced Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <motion.h2 
              className="text-6xl lg:text-7xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              DISCOVER
              <br />
              <motion.span 
                className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent inline-block"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                YOUR CAREER
              </motion.span>
            </motion.h2>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all group-hover:border-primary/50">
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-3 mb-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 group cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-2 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                  <feature.icon className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
                </div>
                <span className="text-white/90 group-hover:text-white transition-colors">
                  {feature.text}
                </span>
                <CheckCircle2 className="h-4 w-4 text-green-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/90 mb-4 italic">"{testimonials[testimonialIndex].text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center text-white font-bold">
                      {testimonials[testimonialIndex].name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonials[testimonialIndex].name}</div>
                      <div className="text-white/60 text-sm">{testimonials[testimonialIndex].role}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="flex items-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="h-1 rounded-full bg-gradient-to-r from-primary via-purple-400 to-transparent"
                initial={{ scaleX: 0, width: 0 }}
                animate={{ scaleX: 1, width: 48 }}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Right Form Section */}
      <div className="relative z-10 w-full lg:w-[600px] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Enhanced Glass Card */}
          <motion.div 
            className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl overflow-hidden"
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          >
            {/* Animated Border Gradient */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login" : "signup"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <motion.div 
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {isLogin ? "Welcome Back!" : "Join CrewDog"}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {isLogin 
                        ? "Sign in to continue your job search" 
                        : "Start your career journey today"}
                    </p>
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, height: 0 }}
                      animate={{ opacity: 1, scale: 1, height: "auto" }}
                      exit={{ opacity: 0, scale: 0.9, height: 0 }}
                      className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-white text-sm backdrop-blur-sm flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Enhanced Email Field */}
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="email" className="text-white font-medium text-sm flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setEmailFocused(true)}
                          onBlur={() => setEmailFocused(false)}
                          className="h-12 bg-white/90 border-2 border-white/30 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary/50 transition-all pr-10"
                          required
                        />
                        <motion.div
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          animate={{
                            scale: emailFocused ? [1, 1.2, 1] : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Mail className={`h-5 w-5 transition-colors ${emailFocused ? "text-primary" : "text-gray-400"}`} />
                        </motion.div>
                        {emailFocused && (
                          <motion.div
                            className="absolute inset-0 rounded-md border-2 border-primary/50 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layoutId="focus-border"
                          />
                        )}
                      </div>
                    </motion.div>

                    {/* Enhanced Password Field */}
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="password" className="text-white font-medium text-sm flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        Password
                      </Label>
                      <div className="relative group">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setPasswordFocused(true)}
                          onBlur={() => setPasswordFocused(false)}
                          className="h-12 bg-white/90 border-2 border-white/30 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary/50 transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        {passwordFocused && (
                          <motion.div
                            className="absolute inset-0 rounded-md border-2 border-primary/50 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}
                      </div>
                    </motion.div>

                    {/* Confirm Password (Signup only) */}
                    {!isLogin && (
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label htmlFor="confirmPassword" className="text-white font-medium text-sm flex items-center gap-2">
                          <Lock className="h-4 w-4 text-primary" />
                          Confirm Password
                        </Label>
                        <div className="relative group">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-12 bg-white/90 border-2 border-white/30 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-primary/50 transition-all pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Forgot Password */}
                    {isLogin && (
                      <motion.div
                        className="text-right"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <button
                          type="button"
                          className="text-white/70 hover:text-primary text-sm underline transition-colors inline-flex items-center gap-1 group"
                        >
                          <Lock className="h-3 w-3 group-hover:rotate-12 transition-transform" />
                          Forgot password?
                        </button>
                      </motion.div>
                    )}

                    {/* Enhanced Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="relative w-full h-13 bg-gradient-to-r from-primary via-primary/90 to-primary text-white font-bold text-base shadow-2xl hover:shadow-primary/50 transition-all group overflow-hidden"
                          size="lg"
                        >
                          {/* Animated Background */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          <span className="relative flex items-center justify-center gap-2">
                            {isLogin ? "SIGN IN NOW" : "CREATE ACCOUNT"}
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-transparent px-4 text-white/50 text-xs uppercase font-semibold tracking-wider backdrop-blur-sm">
                          or continue with
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Google Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-12 bg-white/95 hover:bg-white border-2 border-white/40 text-gray-900 font-semibold backdrop-blur-sm group shadow-lg hover:shadow-xl transition-all"
                          size="lg"
                        >
                          <Chrome className="mr-3 h-5 w-5 text-blue-500 group-hover:rotate-12 transition-transform" />
                          <span>Continue with Google</span>
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>

                  {/* Toggle Login/Signup */}
                  <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-white/70 text-sm">
                      {isLogin ? "New to CrewDog? " : "Already have an account? "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setError("");
                          setConfirmPassword("");
                        }}
                        className="text-white font-bold hover:text-primary transition-colors inline-flex items-center gap-1 group ml-1"
                      >
                        <span className="underline">{isLogin ? "Create an Account" : "Sign In"}</span>
                        <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform text-primary" />
                      </button>
                    </p>
                  </motion.div>

                  {/* Trust Badges */}
                  <motion.div
                    className="mt-8 flex items-center justify-center gap-4 text-white/50 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified</span>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
