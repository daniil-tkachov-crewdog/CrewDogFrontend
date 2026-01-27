// src/pages/account.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle, History, Settings, User } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import DownsellModal from "@/components/account/DownsellModal";
import CancelSurveyModal from "@/components/account/CancelSurveyModal";
import SupportForm from "@/components/account/SupportForm";
import {
  accountAchievements,
  accountActivity,
  makeUser,
} from "@/data/account.mock";
import AccountHeader from "@/components/account/AccountHeader";
import ProfileInfo from "@/components/account/ProfileInfo";
import SubscriptionCard from "@/components/account/SubscriptionCard";
import AchievementsGrid from "@/components/account/AchievementsGrid";
import ActivityLog from "@/components/account/ActivityLog";
import SearchHistory from "@/components/account/SearchHistory";
import SecuritySection from "@/components/account/SecuritySection";
import NotificationsSection from "@/components/account/NotificationsSection";
import DataPrivacySection from "@/components/account/DataPrivacySection";
import {
  fetchAccountSummary,
  type NormalizedSummary,
} from "@/services/account";
import { cancelSubscription } from "@/services/billing";

export default function AccountPage() {
  const navigate = useNavigate();
  const { user: authUser, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "general" | "history" | "settings" | "support"
  >("general");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDownsellModal, setShowDownsellModal] = useState(false);
  const [summary, setSummary] = useState<NormalizedSummary | null>(null);

  const user = makeUser(authUser);

  const refreshSummary = async () => {
    try {
      const s = await fetchAccountSummary();
      setSummary(s);
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    refreshSummary();
    const onVis = () => {
      if (document.visibilityState === "visible") refreshSummary();
    };
    document.addEventListener("visibilitychange", onVis);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("gc-activity");
      bc.addEventListener("message", (e) => {
        if (e?.data?.type === "search_used") refreshSummary();
      });
    } catch {}
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      bc?.close();
    };
  }, []);

  const handleStartCancel = () => {
    if (summary?.pro || user.plan !== "Free") {
      setShowCancelModal(true);
    }
  };
  const handleCancelContinue = async () => {
    setShowCancelModal(false);

    // Check if user is platinum
    const planLabel = summary?.planLabel ?? user.plan;
    const isPlatinum = planLabel?.toLowerCase().includes("platinum");

    if (isPlatinum) {
      // Platinum users: show downsell modal with downgrade option
      setShowDownsellModal(true);
    } else {
      // Other pro users: call cancel API direct
      try {
        await cancelSubscription();
        toast.success(
          "Cancellation scheduled. You keep access and credits until your current period ends."
        );
        await refreshSummary();
      } catch (e: any) {
        toast.error(e?.message || "Cancel failed.");
      }
    }
  };
  const handleCancelFinalize = async () => {
    setShowDownsellModal(false);
    await refreshSummary();
    toast.success("Subscription cancelled successfully");
  };
  const handleAcceptDownsell = async () => {
    setShowDownsellModal(false);
    await refreshSummary();
    toast.success("Subscription downgraded to £2/month");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Topbar />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <main className="flex-1 py-12 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
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
            <button
              onClick={async () => {
                await signOut();
                toast.success("Logged out successfully");
                navigate("/");
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition group"
            >
              <svg
                className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16 17l5-5-5-5M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Logout
            </button>
          </motion.div>

          <AccountHeader user={user} summary={summary} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 glass-card">
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as typeof activeTab)}
              >
                <TabsList className="grid w-full grid-cols-4 mb-8 h-auto p-1 gap-2">
                  <TabsTrigger
                    value="general"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <History className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Activity</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="support"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Help</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-8">
                  <ProfileInfo user={user} />
                  <SubscriptionCard
                    user={user}
                    summary={summary}
                    onRefresh={refreshSummary}
                    onCancel={handleStartCancel}
                  />
                  {/* <AchievementsGrid achievements={accountAchievements} /> */}
                </TabsContent>

                <TabsContent value="history" className="space-y-8">
                  {/* <ActivityLog items={accountActivity} /> */}
                  {/* New SearchHistory fetches its own data */}
                  <SearchHistory />
                </TabsContent>

                <TabsContent value="settings" className="space-y-8">
                  <SecuritySection />
                  {/* <NotificationsSection />
                  <DataPrivacySection /> */}
                </TabsContent>

                <TabsContent value="support" className="space-y-8">
                  <SupportForm userEmail={user.email} />
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </main>

      <CancelSurveyModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        onContinue={handleCancelContinue}
      />
      <DownsellModal
        open={showDownsellModal}
        onOpenChange={setShowDownsellModal}
        onAccept={handleAcceptDownsell}
        onCancelAnyway={handleCancelFinalize}
      />

      <Footer />
    </div>
  );
}
