import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chrome,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import loginPageImage from "@/assets/Login_page_image.png";
import { useAuth } from "@/auth/AuthProvider";

export default function Login() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const from = sp.get("from") ?? "/run";

  const { user, signInWithPassword, signUpWithPassword, signInWithGoogle } =
    useAuth();

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
    if (user) navigate("/run", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address",
      });
      return;
    }
    if (!password || password.length < 6) {
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

    try {
      setIsLoading(true);
      if (isLogin) {
        await signInWithPassword(email, password);
        toast.success("Welcome back!", {
          description: `Logged in as ${email}`,
          icon: <CheckCircle2 className="w-5 h-5" />,
        });
      } else {
        await signUpWithPassword(email, password);
        toast.success("Verify your email", {
          description: "We’ve sent you a verification link.",
        });
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(isLogin ? "Login failed" : "Registration failed", {
        description: err?.message ?? "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle(`${window.location.origin}${from}`);
    } catch (err: any) {
      toast.error("Google sign-in failed", {
        description: err?.message ?? "Something went wrong",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted/20 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-screen bg-card shadow-[0_20px_80px_rgba(0,0,0,0.15)] overflow-hidden flex"
      >
        {/* Left: Form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center bg-card/95 backdrop-blur-sm overflow-hidden">
          <div className="w-full max-w-[480px] mx-auto space-y-[clamp(1rem,2vh,2rem)]">
            <motion.div
              className="flex items-center gap-3 mb-[clamp(1rem,2vh,1.5rem)]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={() => navigate("/")}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-foreground rounded-xl flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 text-background" />
              </motion.button>
              <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                CrewDog
              </span>
            </motion.div>

            <motion.div
              className="mb-[clamp(1rem,2vh,1.5rem)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-bold text-foreground mb-2 tracking-tight">
                {isLogin ? "Welcome Back!" : "Start Your Journey"}
              </h1>
              <p className="text-[clamp(0.875rem,1.5vw,1rem)] text-muted-foreground flex items-center gap-2">
                {isLogin
                  ? "Sign in to continue your career search"
                  : "Create an account to find your dream job"}
                <Sparkles className="w-4 h-4 text-primary" />
              </p>
            </motion.div>

            <motion.div
              className="flex gap-2 mb-[clamp(1rem,2vh,1.5rem)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-[clamp(0.625rem,1.5vh,0.875rem)] px-4 rounded-full text-[clamp(0.875rem,1.5vw,1rem)] font-medium transition-all duration-300 ${
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
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-[clamp(0.625rem,1.5vh,0.875rem)] px-4 rounded-full text-[clamp(0.875rem,1.5vw,1rem)] font-medium transition-all duration-300 ${
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

            <form
              onSubmit={handleSubmit}
              className="space-y-[clamp(0.875rem,1.5vh,1.25rem)]"
            >
              {/* EMAIL */}
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
                  autoComplete="email"
                  inputMode="email"
                  className="pl-5 pr-12 h-[clamp(2.75rem,6vh,3.5rem)] rounded-full bg-muted/40 border border-muted hover:border-muted-foreground/20 focus:border-primary transition-all duration-300 text-[clamp(0.875rem,1.5vw,1rem)]"
                  disabled={isLoading}
                />
                {/* anchored icon (no scale, no pointer events) */}
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <Mail
                    className={`w-5 h-5 transition-colors ${
                      emailFocused ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </span>
              </motion.div>

              {/* PASSWORD */}
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
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="pl-5 pr-12 h-[clamp(2.75rem,6vh,3.5rem)] rounded-full bg-muted/40 border border-muted hover:border-muted-foreground/20 focus:border-primary transition-all duration-300 text-[clamp(0.875rem,1.5vw,1rem)]"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showPassword ? "hide" : "show"}
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      className={passwordFocused ? "text-primary" : ""}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </motion.div>

              {/* CONFIRM PASSWORD (Sign Up only) */}
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
                      autoComplete="new-password"
                      className="pl-5 pr-12 h-[clamp(2.75rem,6vh,3.5rem)] rounded-full bg-muted/40 border border-muted hover:border-muted-foreground/20 focus:border-primary transition-all duration-300 text-[clamp(0.875rem,1.5vw,1rem)]"
                      disabled={isLoading}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember + Forgot */}
              <AnimatePresence mode="wait">
                {isLogin && (
                  <motion.div
                    className="flex items-center justify-between py-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="flex items-center gap-2.5"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(c) => setRememberMe(!!c)}
                        className="rounded-md"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="remember"
                        className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-muted-foreground cursor-pointer select-none"
                      >
                        Remember me
                      </label>
                    </motion.div>
                    <motion.button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-primary hover:underline font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Forgot Password?
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[clamp(2.75rem,6vh,3.5rem)] rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-[clamp(0.875rem,1.5vw,1rem)] font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Processing...
                    </motion.div>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      {isLogin ? "Login" : "Create Account"}{" "}
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.div>
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              {/* Divider */}
              <motion.div
                className="relative my-[clamp(1rem,2vh,1.5rem)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted/50" />
                </div>
                <div className="relative flex justify-center text-[clamp(0.75rem,1.5vw,0.875rem)]">
                  <span className="bg-card px-4 text-muted-foreground font-medium">
                    OR
                  </span>
                </div>
              </motion.div>

              {/* Google */}
              <motion.div
                className="space-y-[clamp(0.75rem,1.5vh,1rem)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogle}
                    disabled={isLoading}
                    className="w-full h-[clamp(2.75rem,6vh,3.5rem)] rounded-full border-2 text-[clamp(0.875rem,1.5vw,1rem)] font-medium hover:bg-muted/30 transition-all disabled:opacity-50"
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    Log in with Google
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </div>
        </div>

        {/* Right: Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <img
              src={loginPageImage}
              alt="Login page visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/30 via-transparent to-[#172554]/30" />
          </motion.div>
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
