import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Sparkles, Zap, Menu, X, Moon, Sun } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/auth/AuthProvider";
import crewDogLogo from "@/assets/CrewDog-App-Logo.png";

export const Topbar = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const activePath = useMemo(() => location.pathname, [location.pathname]);
  const isActive = (path: string) =>
    activePath === path ? "text-foreground" : "text-foreground/80";

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
      style={{ opacity: headerOpacity as any }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50 pointer-events-none" />

      {/* Glow effect on scroll */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center group relative"
          aria-label="Go to homepage"
        >
          <motion.img
            src={crewDogLogo}
            alt="CrewDog Logo"
            className="h-36 w-36 object-contain"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          />

          <motion.div
            className="relative -ml-8"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              CrewDog
            </span>
            <motion.div
              className="absolute -top-2 -right-7"
              animate={{ y: [0, -3, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </motion.div>

            {/* Underline effect */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Theme Toggle */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative group overflow-hidden"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>

          {/* Always show Account */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/account" aria-label="Account">
              <Button
                variant="ghost"
                className={`relative group overflow-hidden ${isActive(
                  "/account"
                )}`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <User className="h-4 w-4 text-primary-foreground" />
                  </motion.div>
                  {isAuthenticated ? user?.name || user?.email : "Account"}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </Link>
          </motion.div>

          {/* For guests, keep Login and Get Started */}
          {!isAuthenticated && (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" aria-label="Login">
                  <Button
                    variant="ghost"
                    className={`relative group overflow-hidden ${isActive(
                      "/login"
                    )}`}
                  >
                    <span className="relative z-10">Login</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link to="/run" aria-label="Get Started">
                  <Button className="relative group overflow-hidden px-6">
                    <span className="relative z-10 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Get Started
                    </span>

                    {/* Animated gradient background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]"
                      animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </Button>
                </Link>

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-secondary blur-xl opacity-50 -z-10"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-lg glass-card"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        id="mobile-menu"
        className="md:hidden overflow-hidden"
        initial={false}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-6 space-y-4 border-t border-border/40">
          {/* Theme Toggle Mobile */}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute left-8 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="ml-6">Toggle Theme</span>
          </Button>

          {/* Always show Account in mobile */}
          <Link to="/account">
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              {isAuthenticated ? user?.name || user?.email : "Account"}
            </Button>
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/run">
                <Button className="w-full">
                  <Zap className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </>
          ) : null}
        </div>
      </motion.div>
    </motion.header>
  );
};
