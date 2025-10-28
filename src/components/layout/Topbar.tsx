import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, User, Sparkles, Zap, Search, Menu, X, Moon, Sun } from "lucide-react";
import { useMockAuth } from "@/hooks/useMockAuth";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export const Topbar = () => {
  const { isAuthenticated, user } = useMockAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(var(--background), 0.8)", "rgba(var(--background), 0.95)"]
  );
  
  const headerBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(8px)", "blur(16px)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-xl"
      style={{ 
        backgroundColor: headerBackground,
        backdropFilter: headerBlur,
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
      
      {/* Glow effect on scroll */}
      <motion.div 
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="container mx-auto px-4 h-20 flex items-center justify-between relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group relative">
          <motion.div 
            className="relative p-2.5 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-lg group-hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Plane className="h-6 w-6 text-primary-foreground" />
            
            {/* Animated glow ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(var(--primary), 0.3)",
                  "0 0 40px rgba(var(--primary), 0.5)",
                  "0 0 20px rgba(var(--primary), 0.3)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Sparkle effect */}
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full opacity-0 group-hover:opacity-100"
              animate={{ 
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
          
          <motion.div
            className="relative"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              CrewDog
            </span>
            <motion.div
              className="absolute -top-2 -right-7"
              animate={{ 
                y: [0, -3, 0],
                rotate: [0, 10, -10, 0],
              }}
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
        <nav className="hidden md:flex items-center gap-6">
          {/* Theme Toggle */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative group overflow-hidden"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>
          
          {isAuthenticated ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/run">
                  <Button variant="ghost" className="relative group overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Run Search
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/account">
                  <Button variant="ghost" className="relative group overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <User className="h-4 w-4 text-primary-foreground" />
                      </motion.div>
                      {user?.name}
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login">
                  <Button variant="ghost" className="relative group overflow-hidden">
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
                <Link to="/run">
                  <Button className="relative group overflow-hidden px-6">
                    <span className="relative z-10 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Get Started
                    </span>
                    
                    {/* Animated gradient background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]"
                      animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
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
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 rounded-lg glass-card"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
          >
            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute left-8 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="ml-6">Toggle Theme</span>
          </Button>
          
          {isAuthenticated ? (
            <>
              <Link to="/run" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Run Search
                </Button>
              </Link>
              <Link to="/account" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  {user?.name}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full">Login</Button>
              </Link>
              <Link to="/run" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">
                  <Zap className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
};