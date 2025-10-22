import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMockAuth } from "@/hooks/useMockAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  History, 
  Settings, 
  HelpCircle,
  LogOut,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Camera,
  Crown,
  Sparkles,
  TrendingUp,
  Calendar,
  Mail,
  Bell,
  Shield,
  Lock,
  Zap,
  Award,
  Target,
  CheckCircle2,
  Activity,
  Download,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Clock,
  Globe,
  CreditCard,
  Users,
  Briefcase,
  Star,
  Gift
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Account() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, logout } = useMockAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDownsellModal, setShowDownsellModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOtherReason, setCancelOtherReason] = useState("");
  const [expandedHistory, setExpandedHistory] = useState<number[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const user = {
    name: authUser?.name || "User",
    email: authUser?.email || "",
    plan: authUser?.plan || "Free",
    quota: { used: 2, total: 3 },
    subscriptionStatus: "active",
    renewalDate: "February 1, 2025",
    memberSince: "January 2024",
    totalSearches: 47,
    successRate: 92,
    avatar: ""
  };

  const searchHistory = [
    {
      id: 1,
      date: "2025-01-15",
      company: "TechCorp Industries",
      status: "completed",
      results: 23,
      duration: "2.3s"
    },
    {
      id: 2,
      date: "2025-01-10",
      company: "Digital Solutions Ltd",
      status: "completed",
      results: 18,
      duration: "1.8s"
    },
    {
      id: 3,
      date: "2025-01-05",
      company: "Innovation Labs",
      status: "completed",
      results: 31,
      duration: "2.1s"
    }
  ];

  const achievements = [
    { icon: Star, name: "First Search", description: "Completed your first job search", unlocked: true },
    { icon: Target, name: "10 Searches", description: "Reached 10 successful searches", unlocked: true },
    { icon: Award, name: "Power User", description: "Used the platform for 30 days", unlocked: false },
    { icon: Crown, name: "Premium Member", description: "Upgraded to premium", unlocked: false },
  ];

  const activityLog = [
    { action: "Searched for jobs at TechCorp", time: "2 hours ago", icon: Briefcase },
    { action: "Updated profile information", time: "1 day ago", icon: User },
    { action: "Upgraded to Premium", time: "3 days ago", icon: Crown },
  ];

  const handleCancelSubscription = () => {
    if (user.plan === "Free") return;
    setShowCancelModal(true);
  };

  const handleContinueCancel = () => {
    setShowCancelModal(false);
    setShowDownsellModal(true);
  };

  const handleFinalCancel = () => {
    setShowDownsellModal(false);
    toast.success("Subscription cancelled successfully");
  };

  const handleKeepSubscription = () => {
    setShowDownsellModal(false);
    toast.success("Subscription downgraded to £2/month");
  };

  const toggleHistory = (id: number) => {
    setExpandedHistory(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    toast.success("Name updated successfully!");
  };

  const handleSaveEmail = () => {
    setIsEditingEmail(false);
    toast.success("Email updated successfully! Please verify your new email.");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password updated successfully!");
  };

  const handleExportData = () => {
    toast.success("Your data export has been initiated. Check your email!");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion initiated. You'll receive a confirmation email.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background relative overflow-hidden">
      <Topbar />
      
      {/* Tech Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        {/* Scan lines */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
          animate={{
            y: ['-100%', '200%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
      
      {/* Floating Holographic Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
              background: `radial-gradient(circle, hsl(var(--primary) / ${Math.random() * 0.15}) 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0.5,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      
      {/* Particle System */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
            }}
            animate={{
              y: -20,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Link 
              to="/run" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => {
                logout();
                toast.success("Logged out successfully");
                navigate("/");
              }}
              className="group"
            >
              <LogOut className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              Logout
            </Button>
          </motion.div>

          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 glass-card mb-8 relative overflow-hidden border-2 border-primary/20">
              {/* Holographic Background Effect */}
              <div className="absolute inset-0">
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, transparent 50%, hsl(var(--primary) / 0.15) 100%)',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
                
                {/* Tech Corner Accents */}
                <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/30" />
                <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-primary/30" />
                <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-primary/30" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/30" />
                
                {/* Animated Pulse Lines */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                {/* Enhanced Avatar */}
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Outer ring animation */}
                  <motion.div
                    className="absolute -inset-4 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--primary) / 0.5), hsl(var(--primary)), hsl(var(--primary) / 0.5), hsl(var(--primary)))',
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  
                  {/* Middle ring */}
                  <motion.div
                    className="absolute -inset-3 rounded-full bg-background"
                  />
                  
                  {/* Gradient border */}
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-bold relative overflow-hidden group-hover:bg-gradient-to-br group-hover:from-background group-hover:to-primary/10 transition-all">
                      {user.name.charAt(0).toUpperCase()}
                      
                      {/* Scan effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
                        initial={{ y: '-100%' }}
                        whileHover={{ y: '100%' }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                  
                  <motion.button 
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full p-2.5 shadow-lg group-hover:shadow-primary/50 border border-primary/20"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera className="h-4 w-4" />
                  </motion.button>
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute -inset-6 bg-primary/20 rounded-full blur-2xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>

                {/* Enhanced User Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                    <motion.h1 
                      className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground"
                      style={{ backgroundSize: '200% auto' }}
                      animate={{
                        backgroundPosition: ['0% center', '200% center', '0% center'],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                      }}
                    >
                      {user.name}
                    </motion.h1>
                    {user.plan !== "Free" && (
                      <motion.div
                        className="relative"
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Crown className="h-7 w-7 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            boxShadow: [
                              '0 0 10px rgba(234,179,8,0.5)',
                              '0 0 20px rgba(234,179,8,0.8)',
                              '0 0 10px rgba(234,179,8,0.5)',
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-5 flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all">
                      <Calendar className="h-3.5 w-3.5" />
                      Member since {user.memberSince}
                    </Badge>
                    <Badge variant="outline" className="gap-1.5 px-3 py-1.5 hover:border-primary/40 transition-all">
                      <Activity className="h-3.5 w-3.5" />
                      {user.totalSearches} searches
                    </Badge>
                    <Badge variant="outline" className="gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20 transition-all">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {user.successRate}% success rate
                    </Badge>
                  </div>
                </div>

                {/* Enhanced Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Searches", value: user.totalSearches, icon: Briefcase, color: "from-blue-500 to-cyan-500" },
                    { label: "Success", value: `${user.successRate}%`, icon: Target, color: "from-green-500 to-emerald-500" },
                    { label: "Tier", value: user.plan, icon: Crown, color: "from-yellow-500 to-orange-500" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.08, y: -8 }}
                      className="relative"
                    >
                      <Card className="p-5 glass-card hover:shadow-2xl hover:shadow-primary/20 transition-all group cursor-pointer border border-primary/10 relative overflow-hidden">
                        {/* Animated gradient background */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                        />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className={`mx-auto mb-3 w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-0.5 group-hover:scale-110 transition-transform`}>
                            <div className="w-full h-full rounded-xl bg-background/95 flex items-center justify-center">
                              <stat.icon className="h-6 w-6 bg-clip-text text-transparent bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
                            </div>
                          </div>
                          <div className="text-3xl font-bold mb-1 text-center">{stat.value}</div>
                          <div className="text-xs text-muted-foreground text-center font-medium">{stat.label}</div>
                        </div>
                        
                        {/* Corner accents */}
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 glass-card border-2 border-primary/20 relative overflow-hidden">
              {/* Tech background effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)_/_0.05),transparent_70%)]" />
              
              <div className="relative z-10">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-10 h-auto p-1.5 gap-3 bg-muted/30 backdrop-blur-xl border border-primary/10">
                    {[
                      { value: "general", icon: User, label: "Profile", gradient: "from-blue-500 to-cyan-500" },
                      { value: "history", icon: History, label: "Activity", gradient: "from-purple-500 to-pink-500" },
                      { value: "settings", icon: Settings, label: "Settings", gradient: "from-orange-500 to-red-500" },
                      { value: "support", icon: HelpCircle, label: "Help", gradient: "from-green-500 to-emerald-500" },
                    ].map((tab, index) => (
                      <motion.div
                        key={tab.value}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TabsTrigger 
                          value={tab.value}
                          className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:text-white transition-all h-12 group overflow-hidden"
                          style={{
                            backgroundImage: activeTab === tab.value 
                              ? `linear-gradient(to right, var(--tw-gradient-stops))` 
                              : 'none',
                          }}
                        >
                          {/* Hover gradient */}
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                          />
                          
                          {/* Content */}
                          <div className="relative z-10 flex items-center gap-2">
                            <tab.icon className="h-4 w-4" />
                            <span className="hidden sm:inline font-medium">{tab.label}</span>
                          </div>
                          
                          {/* Active indicator */}
                          {activeTab === tab.value && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute bottom-0 left-0 right-0 h-1 bg-white/50"
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </TabsTrigger>
                      </motion.div>
                    ))}
                  </TabsList>

                  {/* General Tab */}
                  <TabsContent value="general" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Profile Information */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-6">
                        <User className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Profile Information</h2>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <Card className="p-6 glass-card hover:shadow-lg transition-all group">
                          <Label className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Full Name
                          </Label>
                          {isEditingName ? (
                            <div className="space-y-3">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder={user.name}
                                className="h-12"
                              />
                              <div className="flex gap-2">
                                <Button onClick={handleSaveName} size="sm" className="flex-1">
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                                <Button onClick={() => setIsEditingName(false)} variant="outline" size="sm">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-medium">{user.name}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setIsEditingName(true);
                                  setEditName(user.name);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Card>

                        {/* Email */}
                        <Card className="p-6 glass-card hover:shadow-lg transition-all group">
                          <Label className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Address
                          </Label>
                          {isEditingEmail ? (
                            <div className="space-y-3">
                              <Input
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                placeholder={user.email}
                                type="email"
                                className="h-12"
                              />
                              <div className="flex gap-2">
                                <Button onClick={handleSaveEmail} size="sm" className="flex-1">
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                                <Button onClick={() => setIsEditingEmail(false)} variant="outline" size="sm">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-medium truncate">{user.email}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setIsEditingEmail(true);
                                  setEditEmail(user.email);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Card>
                      </div>
                    </div>

                    {/* Subscription Section */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Crown className="h-5 w-5 text-primary" />
                        <h3 className="text-2xl font-bold">Subscription</h3>
                      </div>
                      <Card className="p-8 glass-card relative overflow-hidden group hover:shadow-xl transition-all">
                        {/* Animated Background */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent"
                          animate={{
                            backgroundPosition: ["0% 0%", "100% 100%"],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-primary to-purple-500">
                                  {user.plan}
                                </Badge>
                                {user.plan !== "Free" && (
                                  <Badge variant="outline" className="gap-1 text-green-500 border-green-500/20">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Active
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground">
                                {user.plan === "Free" 
                                  ? "Upgrade to unlock unlimited features" 
                                  : "Thanks for being a premium member!"}
                              </p>
                            </div>
                            {user.plan !== "Free" && (
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Sparkles className="h-6 w-6 text-yellow-500" />
                              </motion.div>
                            )}
                          </div>

                          {/* Usage Stats */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium">Monthly Quota</span>
                              <span className="text-sm font-bold">
                                {user.quota.used} / {user.quota.total} searches
                              </span>
                            </div>
                            <div className="relative">
                              <Progress 
                                value={(user.quota.used / user.quota.total) * 100} 
                                className="h-3"
                              />
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{
                                  x: ["-100%", "200%"],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Resets on {user.renewalDate}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {user.quota.total - user.quota.used} remaining
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <Link to="/pricing" className="flex-1">
                              <Button className="w-full group" size="lg">
                                <Crown className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                                {user.plan === "Free" ? "Upgrade Plan" : "Change Plan"}
                              </Button>
                            </Link>
                            {user.plan !== "Free" && (
                              <Button 
                                variant="outline" 
                                onClick={handleCancelSubscription}
                                size="lg"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Achievements */}
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Award className="h-5 w-5 text-primary" />
                        <h3 className="text-2xl font-bold">Achievements</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {achievements.map((achievement, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                          >
                            <Card className={`p-4 glass-card transition-all ${
                              achievement.unlocked 
                                ? "border-primary/50 bg-primary/5" 
                                : "opacity-50 grayscale"
                            }`}>
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${
                                  achievement.unlocked 
                                    ? "bg-primary/20 text-primary" 
                                    : "bg-muted text-muted-foreground"
                                }`}>
                                  <achievement.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1">{achievement.name}</h4>
                                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                </div>
                                {achievement.unlocked && (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Activity Log */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Clock className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Recent Activity</h2>
                      </div>
                      <Card className="p-6 glass-card">
                        <div className="space-y-4">
                          {activityLog.map((activity, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                            >
                              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <activity.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{activity.action}</p>
                                <p className="text-sm text-muted-foreground">{activity.time}</p>
                              </div>
                              <ChevronDown className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                          ))}
                        </div>
                      </Card>
                    </div>

                    {/* Search History */}
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <History className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Search History</h2>
                      </div>
                      
                      {searchHistory.length === 0 ? (
                        <Card className="p-12 glass-card text-center">
                          <History className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                          <h3 className="text-xl font-semibold mb-2">No searches yet</h3>
                          <p className="text-muted-foreground mb-6">Start your first job search to see it here</p>
                          <Link to="/run">
                            <Button size="lg">
                              <Briefcase className="mr-2 h-4 w-4" />
                              Run Your First Search
                            </Button>
                          </Link>
                        </Card>
                      ) : (
                        <div className="space-y-3">
                          {searchHistory.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card className="glass-card hover:shadow-lg transition-all overflow-hidden">
                                <button
                                  onClick={() => toggleHistory(item.id)}
                                  className="w-full p-6 flex items-center justify-between group"
                                >
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                      <Briefcase className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="text-left flex-1">
                                      <p className="font-semibold text-lg mb-1">{item.company}</p>
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          {item.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Target className="h-3 w-3" />
                                          {item.results} results
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Zap className="h-3 w-3" />
                                          {item.duration}
                                        </span>
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                      {item.status}
                                    </Badge>
                                  </div>
                                  <motion.div
                                    animate={{ rotate: expandedHistory.includes(item.id) ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                  </motion.div>
                                </button>
                                
                                <AnimatePresence>
                                  {expandedHistory.includes(item.id) && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="px-6 pb-6"
                                    >
                                      <Separator className="mb-4" />
                                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div className="p-4 rounded-lg bg-muted/50">
                                          <p className="text-sm text-muted-foreground mb-1">Total Results</p>
                                          <p className="text-2xl font-bold">{item.results}</p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-muted/50">
                                          <p className="text-sm text-muted-foreground mb-1">Search Duration</p>
                                          <p className="text-2xl font-bold">{item.duration}</p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                          <ExternalLink className="mr-2 h-4 w-4" />
                                          View Full Report
                                        </Button>
                                        <Button variant="outline" size="sm">
                                          <Download className="mr-2 h-4 w-4" />
                                          Export
                                        </Button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Security Settings */}
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Shield className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Security</h2>
                      </div>
                      
                      <Card className="p-6 glass-card">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Lock className="h-5 w-5" />
                          Change Password
                        </h3>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                              <Input 
                                id="currentPassword" 
                                type={showPassword ? "text" : "password"}
                                className="pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" />
                          </div>
                          <Button type="submit" className="w-full">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Update Password
                          </Button>
                        </form>
                      </Card>
                    </div>

                    {/* Notification Preferences */}
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Bell className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Notifications</h2>
                      </div>

                      <Card className="p-6 glass-card space-y-6">
                        {[
                          { 
                            label: "Email Notifications", 
                            description: "Receive updates about your job searches",
                            checked: emailNotifications,
                            onChange: setEmailNotifications,
                            icon: Mail
                          },
                          { 
                            label: "Push Notifications", 
                            description: "Get notified about new opportunities",
                            checked: pushNotifications,
                            onChange: setPushNotifications,
                            icon: Bell
                          },
                          { 
                            label: "Marketing Emails", 
                            description: "Receive promotional content and offers",
                            checked: marketingEmails,
                            onChange: setMarketingEmails,
                            icon: Gift
                          },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <item.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{item.label}</p>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                            </div>
                            <Switch
                              checked={item.checked}
                              onCheckedChange={(checked) => {
                                item.onChange(checked);
                                toast.success(`${item.label} ${checked ? "enabled" : "disabled"}`);
                              }}
                            />
                          </motion.div>
                        ))}
                      </Card>
                    </div>

                    {/* Data & Privacy */}
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Shield className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Data & Privacy</h2>
                      </div>

                      <Card className="p-6 glass-card space-y-4">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={handleExportData}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export My Data
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-destructive hover:text-destructive"
                          onClick={handleDeleteAccount}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </Card>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Support Tab */}
                <TabsContent value="support" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl font-bold">Contact Support</h2>
                    </div>
                    
                    <Card className="p-8 glass-card">
                      <form 
                        className="space-y-6"
                        onSubmit={(e) => {
                          e.preventDefault();
                          toast.success("Message sent! We'll get back to you soon.");
                        }}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="supportEmail" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </Label>
                          <Input 
                            id="supportEmail" 
                            type="email" 
                            value={user.email}
                            disabled
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Subject
                          </Label>
                          <Select>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technical">Technical Issue</SelectItem>
                              <SelectItem value="billing">Billing Question</SelectItem>
                              <SelectItem value="feature">Feature Request</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supportMessage">Message</Label>
                          <Textarea 
                            id="supportMessage" 
                            placeholder="Describe your issue or question..."
                            className="min-h-[200px] resize-none"
                          />
                        </div>
                        <Button type="submit" size="lg" className="w-full">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      </form>

                      <Separator className="my-8" />

                      <div className="text-center">
                        <h3 className="font-semibold mb-4">Need immediate help?</h3>
                        <div className="flex flex-col gap-3">
                          <Link to="/faq">
                            <Button variant="outline" className="w-full">
                              <HelpCircle className="mr-2 h-4 w-4" />
                              View FAQs
                            </Button>
                          </Link>
                          <Link to="/support">
                            <Button variant="outline" className="w-full">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Visit Support Center
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Cancel Survey Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              We're sorry to see you go
            </DialogTitle>
            <DialogDescription>
              Help us improve by letting us know why you're cancelling
            </DialogDescription>
          </DialogHeader>
          
          <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="space-y-3">
            {[
              { value: "found_job", label: "I found a job" },
              { value: "price_high", label: "Too expensive" },
              { value: "irrelevant_results", label: "Results weren't relevant" },
              { value: "just_testing", label: "Just testing the service" },
              { value: "other", label: "Other" },
            ].map((reason) => (
              <div key={reason.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={reason.value} id={reason.value} />
                <Label htmlFor={reason.value} className="cursor-pointer flex-1">
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <AnimatePresence>
            {cancelReason === "other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Textarea
                  placeholder="Please tell us more..."
                  value={cancelOtherReason}
                  onChange={(e) => setCancelOtherReason(e.target.value)}
                  className="mt-4"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Keep Subscription
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleContinueCancel}
              disabled={!cancelReason}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Downsell Modal */}
      <Dialog open={showDownsellModal} onOpenChange={setShowDownsellModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Special Offer - Stay for £2/month
            </DialogTitle>
            <DialogDescription>
              We'd love to keep you! How about staying with us for just £2/month instead?
            </DialogDescription>
          </DialogHeader>
          
          <Card className="p-6 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/5 border-primary/20">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                £2/month
              </motion.div>
              <Badge variant="outline" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Limited time offer
              </Badge>
              <p className="text-sm text-muted-foreground">
                Keep all premium features at 60% off
              </p>
            </div>
          </Card>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleFinalCancel}>
              Cancel Anyway
            </Button>
            <Button onClick={handleKeepSubscription} className="flex-1">
              <Crown className="mr-2 h-4 w-4" />
              Accept Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
