// src/pages/account.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, History, Settings, User } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import DownsellModal from "@/components/account/DownsellModal";
import CancelSurveyModal from "@/components/account/CancelSurveyModal";
import SupportForm from "@/components/account/SupportForm";
import { makeUser } from "@/data/account.mock";
import AccountHeader from "@/components/account/AccountHeader";
import ProfileInfo from "@/components/account/ProfileInfo";
import SubscriptionCard from "@/components/account/SubscriptionCard";
import SearchHistory from "@/components/account/SearchHistory";
import SecuritySection from "@/components/account/SecuritySection";
import BullhornSection from "@/components/account/BullhornSection";
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

  const tabCls =
    "flex items-center justify-center gap-2 rounded-[3px] border px-3 py-[10px] font-['IBM_Plex_Mono',monospace] text-[12px] uppercase tracking-[0.08em] transition-colors data-[state=active]:border-[#FF5A1F] data-[state=active]:bg-[#FF5A1F] data-[state=active]:text-[#0B0B0F] data-[state=inactive]:border-[#E4E1D9] data-[state=inactive]:text-[#6F6C78] data-[state=inactive]:hover:border-[#FF5A1F]";

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F2EE] text-[#0B0B0F] font-['Space_Grotesk',system-ui,sans-serif]">
      <Topbar />

      <main className="flex-1 py-14">
        <div className="mx-auto w-full max-w-[1040px] px-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              to="/run"
              className="font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.06em] text-[#6F6C78] transition-colors hover:text-[#0B0B0F]"
            >
              ← Back to dashboard
            </Link>
            <button
              onClick={async () => {
                await signOut();
                toast.success("Logged out successfully");
                navigate("/");
              }}
              className="font-['IBM_Plex_Mono',monospace] text-[12px] tracking-[0.06em] text-[#6F6C78] transition-colors hover:text-[#FF5A1F]"
            >
              Logout →
            </button>
          </div>

          <AccountHeader user={user} summary={summary} />

          <div className="mt-6 rounded-md border border-[#E4E1D9] bg-white px-6 py-7 sm:px-8">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            >
              <TabsList className="mb-8 grid h-auto w-full grid-cols-4 gap-2 bg-transparent p-0">
                <TabsTrigger value="general" className={tabCls}>
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="history" className={tabCls}>
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">Activity</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className={tabCls}>
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
                <TabsTrigger value="support" className={tabCls}>
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Help</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-10">
                <ProfileInfo user={user} />
                <SubscriptionCard
                  user={user}
                  summary={summary}
                  onRefresh={refreshSummary}
                  onCancel={handleStartCancel}
                />
              </TabsContent>

              <TabsContent value="history" className="space-y-8">
                <SearchHistory />
              </TabsContent>

              <TabsContent value="settings" className="space-y-8">
                <BullhornSection />
                <SecuritySection />
              </TabsContent>

              <TabsContent value="support" className="space-y-8">
                <SupportForm userEmail={user.email} />
              </TabsContent>
            </Tabs>
          </div>
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
