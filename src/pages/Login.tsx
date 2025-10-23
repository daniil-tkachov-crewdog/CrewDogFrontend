import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Chrome, Plus, Mail, Lock, Eye, EyeOff, Apple, CheckCircle2, Sparkles } from "lucide-react";
import { useMockAuth } from "@/hooks/useMockAuth";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import blueFluidBg from "@/assets/blue-fluid-bg.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useMockAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/run");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation with toasts
    if (!email) {
      toast.error("Email is required", {
        description: "Please enter your email address",
      });
      return;
    }

    if (!email.includes("@")) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address",
      });
      return;
    }

    if (!password) {
      toast.error("Password is required", {
        description: "Please enter your password",
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters",
      });
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure your passwords match",
      });
      return;
    }

    setIsLoading(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1500));

    login(email);

    toast.success(isLogin ? "Welcome back!" : "Account created!", {
      description: isLogin ? `Logged in as ${email}` : "Your account has been created successfully",
      icon: <CheckCircle2 className="w-5 h-5" />,
    });

    setIsLoading(false);
    navigate("/run");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 relative overflow-hidden">
      {/* Subtle ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted/20 via-transparent to-transparent" />

      {/* Main Card Container - Full Screen */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-screen bg-card shadow-[0_20px_80px_rgba(0,0,0,0.15)] overflow-hidden flex"
      >
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center bg-card/95 backdrop-blur-sm overflow-y-auto">
          {/* Logo with animation */}
          <motion.div
            className="flex items-center gap-3 mb-8 md:mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 bg-foreground rounded-xl flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-background" />
            </motion.div>
            <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">CrewDog</span>
          </motion.div>

          {/* Welcome Message with animation */}
          <motion.div
            className="mb-8 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 md:mb-3 tracking-tight">
              {isLogin ? "Welcome Back!" : "Start Your Journey"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground flex items-center gap-2">
              {isLogin ? "Sign in to continue your career search" : "Create an account to find your dream job"}
              <Sparkles className="w-4 h-4 text-primary" />
            </p>
          </motion.div>

          {/* Tab Switcher with animation */}
          <motion.div
            className="flex gap-2 sm:gap-3 mb-8 md:mb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              onClick={() => {
                setIsLogin(true);
                toast.info("Switched to Sign In");
              }}
              className={`flex-1 py-3 sm:py-3.5 px-4 sm:px-8 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign in
            </motion.button>
            <motion.button
              onClick={() => {
                setIsLogin(false);
                toast.info("Switched to Sign Up");
              }}
              className={`flex-1 py-3 sm:py-3.5 px-4 sm:px-8 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </motion.button>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Email Input with animation */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="pl-5 pr-12 h-12 sm:h-14 rounded-full bg-muted/40 border border-muted hover:border-muted-foreground/20 focus:border-primary transition-all duration-300 text-sm sm:text-base"
                disabled={isLoading}
              />
              <motion.div
                animate={{
                  scale: emailFocused ? 1.1 : 1,
                  color: emailFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5" />
              </motion.div>
            </motion.div>

            {/* Password Input with animation */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="pl-5 pr-12 h-12 sm:h-14 rounded-full bg-muted/40 border border-muted hover:border-muted-foreground/20 focus:border-primary transition-all duration-300 text-sm sm:text-base"
                disabled={isLoading}
              />
              <motion.button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                  toast.info(showPassword ? "Password hidden" : "Password visible");
                }}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  color: passwordFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showPassword ? "hide" : "show"}
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* Confirm Password (Sign Up only) with animation */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden"
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-5 pr-12 h-12 sm:h-14 rounded-full bg-muted/40 border border-muted hover:border-muted-foreground/20 focus:border-primary transition-all duration-300 text-sm sm:text-base"
                    disabled={isLoading}
                  />
                  <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remember Me & Forgot Password with animation */}
            <AnimatePresence mode="wait">
              {isLogin && (
                <motion.div
                  className="flex items-center justify-between py-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.02 }}>
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => {
                        setRememberMe(checked as boolean);
                        toast.success(checked ? "Remember me enabled" : "Remember me disabled");
                      }}
                      className="rounded-md"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="remember"
                      className="text-xs sm:text-sm text-muted-foreground cursor-pointer select-none"
                    >
                      Remember me
                    </label>
                  </motion.div>
                  <motion.button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs sm:text-sm text-primary hover:underline font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Forgot Password?
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button with loading state */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 sm:h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Processing...
                  </motion.div>
                ) : (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    {isLogin ? "Login" : "Create Account"}
                    <motion.div initial={{ x: 0 }} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      →
                    </motion.div>
                  </motion.span>
                )}
              </Button>
            </motion.div>

            {/* Divider with animation */}
            <motion.div
              className="relative my-6 sm:my-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted/50" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="bg-card px-4 sm:px-5 text-muted-foreground font-medium">OR</span>
              </div>
            </motion.div>

            {/* Social Login Buttons with animations */}
            <motion.div
              className="space-y-3 sm:space-y-3.5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    toast.info("Google Sign In", {
                      description: "Coming soon!",
                    })
                  }
                  disabled={isLoading}
                  className="w-full h-12 sm:h-14 rounded-full border-2 text-sm sm:text-base font-medium hover:bg-muted/30 transition-all disabled:opacity-50"
                >
                  <Chrome className="w-5 h-5 mr-2 sm:mr-3" />
                  Log in with Google
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </div>

        {/* Right Side - Blue Fluid Background Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          {/* Background Image */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <img src={blueFluidBg} alt="Blue Fluid Background" className="w-full h-full object-cover" />
            {/* Overlay gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/30 via-transparent to-[#172554]/30" />
          </motion.div>
          {/* Floating particles overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -60, -20],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
