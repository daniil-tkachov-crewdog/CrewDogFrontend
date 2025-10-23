import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Chrome, 
  Plus, 
  Mail,
  Lock,
  Eye,
  EyeOff,
  Apple
} from "lucide-react";
import { useMockAuth } from "@/hooks/useMockAuth";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useMockAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/run");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    login(email);
    toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
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
        <div className="w-full lg:w-1/2 p-16 flex flex-col justify-center bg-card/95 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center shadow-md">
              <Plus className="w-7 h-7 text-background" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">CrewDog</span>
          </div>

          {/* Welcome Message */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
              Welcome Back Creative!
            </h1>
            <p className="text-muted-foreground">
              We Are Happy To See You Again
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-3 mb-10">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3.5 px-8 rounded-full font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3.5 px-8 rounded-full font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-5 pr-12 h-14 rounded-full bg-muted/40 border border-muted hover:border-muted-foreground/20 focus:border-primary transition-colors"
              />
              <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-5 pr-12 h-14 rounded-full bg-muted/40 border border-muted hover:border-muted-foreground/20 focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-5 pr-12 h-14 rounded-full bg-muted/40 border border-muted hover:border-muted-foreground/20 focus:border-primary transition-colors"
                />
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </motion.div>
            )}

            {/* Remember Me & Forgot Password */}
            {isLogin && (
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="rounded-md"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer select-none"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              {isLogin ? "Login" : "Create Account"}
            </Button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-5 text-muted-foreground font-medium">OR</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3.5">
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 border-0 font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Apple className="w-5 h-5 mr-3" />
                Log in with Apple
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 rounded-full border-2 font-medium hover:bg-muted/30 transition-all"
              >
                <Chrome className="w-5 h-5 mr-3" />
                Log in with Google
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side - Blue Fluid Design */}
        <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#172554] overflow-hidden">
          {/* Animated Fluid Shapes - More dramatic and flowing */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Primary Large Fluid Wave */}
            <motion.div
              className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px]"
              style={{
                background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.5), transparent)",
                filter: "blur(80px)",
                borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
              }}
              animate={{
                x: [0, 60, 0],
                y: [0, 40, 0],
                scale: [1, 1.15, 1],
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Secondary Flowing Shape */}
            <motion.div
              className="absolute top-[30%] right-[5%] w-[500px] h-[500px]"
              style={{
                background: "radial-gradient(ellipse at center, rgba(96, 165, 250, 0.7), rgba(59, 130, 246, 0.4), transparent)",
                filter: "blur(70px)",
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
              }}
              animate={{
                x: [0, -50, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1],
                rotate: [0, -20, 0],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Tertiary Accent Wave */}
            <motion.div
              className="absolute bottom-[10%] right-[15%] w-[450px] h-[450px]"
              style={{
                background: "radial-gradient(ellipse at center, rgba(147, 197, 253, 0.6), rgba(96, 165, 250, 0.3), transparent)",
                filter: "blur(60px)",
                borderRadius: "50% 50% 30% 70% / 30% 70% 70% 30%",
              }}
              animate={{
                x: [0, 40, 0],
                y: [0, -40, 0],
                scale: [1, 1.18, 1],
                rotate: [0, 25, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Additional Flowing Accent 1 */}
            <motion.div
              className="absolute top-[20%] left-[10%] w-[350px] h-[350px]"
              style={{
                background: "radial-gradient(circle, rgba(191, 219, 254, 0.5), rgba(147, 197, 253, 0.3), transparent)",
                filter: "blur(50px)",
                borderRadius: "40% 60% 50% 50% / 60% 40% 60% 40%",
              }}
              animate={{
                x: [0, -30, 0],
                y: [0, 35, 0],
                scale: [1, 1.12, 1],
                rotate: [0, -15, 0],
              }}
              transition={{
                duration: 11,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Additional Flowing Accent 2 */}
            <motion.div
              className="absolute bottom-[25%] left-[5%] w-[400px] h-[400px]"
              style={{
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.4), rgba(37, 99, 235, 0.2), transparent)",
                filter: "blur(65px)",
                borderRadius: "70% 30% 40% 60% / 30% 60% 40% 70%",
              }}
              animate={{
                x: [0, 45, 0],
                y: [0, -35, 0],
                scale: [1, 1.14, 1],
                rotate: [0, 18, 0],
              }}
              transition={{
                duration: 13,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Glass Footer Text Box */}
          <div className="absolute bottom-10 left-10 right-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="backdrop-blur-xl bg-white/5 rounded-[1.75rem] p-6 border border-white/10 shadow-2xl"
            >
              <p className="text-white/70 text-xs leading-relaxed">
                <span className="text-white/90 font-medium">© 2025 CrewDog. All rights reserved.</span>
                <br />
                Unauthorized use or reproduction of any content or materials from this site is
                prohibited. For more information, visit our <span className="text-primary-foreground/90 font-medium">Terms of Service</span> and <span className="text-primary-foreground/90 font-medium">Privacy Policy</span>.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
