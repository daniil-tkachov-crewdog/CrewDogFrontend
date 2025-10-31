// src/features/run/QuotaBadge.tsx
import { useAuth } from "@/auth/AuthProvider";
import { Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { fetchAccountSummary } from "@/services/account";

type Plan = "Admin" | "Pro" | "Free";

function isAdminFromUser(user: any) {
  const app = user?.app_metadata ?? {};
  const u = user?.user_metadata ?? {};
  const role = (app.role ?? u.role ?? user?.role)?.toString().toLowerCase();
  return role === "admin" || app.isAdmin === true || u.isAdmin === true;
}

function readPlanFromMeta(user: any): Plan | null {
  const app = user?.app_metadata ?? {};
  const u = user?.user_metadata ?? {};
  const raw = (app.plan ?? u.plan ?? user?.plan ?? app.tier ?? u.tier ?? "")
    .toString()
    .toLowerCase();
  if (!raw) return null;
  if (raw.includes("admin")) return "Admin";
  if (raw.includes("pro") || raw.includes("premium") || raw.includes("paid"))
    return "Pro";
  if (raw.includes("free")) return "Free";
  return null;
}

export default function QuotaBadge() {
  const { user } = useAuth();

  const [usedServer, setUsedServer] = useState<number>(0);
  const [capServer, setCapServer] = useState<number | null>(null);
  const [unlimitedServer, setUnlimitedServer] = useState<boolean>(false);
  const [isAdminServer, setIsAdminServer] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await fetchAccountSummary(); // NormalizedSummary
        if (!mounted) return;
        setUsedServer(Number(s.used ?? 0));
        setCapServer(typeof s.cap === "number" ? Number(s.cap) : null);
        setUnlimitedServer(Boolean(s.unlimited));
        setIsAdminServer(Boolean(s.isAdmin)); // ✅ use normalized flag
      } catch {
        // non-blocking
      } finally {
        if (mounted) setLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Admin detection (instant from user meta; also from server once loaded)
  const isAdmin = useMemo(
    () => isAdminFromUser(user) || isAdminServer,
    [user, isAdminServer]
  );

  // Unlimited condition
  const hasUnlimited = isAdmin || unlimitedServer;

  // Determine plan label with explicit priority:
  // 1) Admin always labeled "Admin"
  // 2) If unlimited (but not admin), label "Pro"
  // 3) Else infer from meta/server hints
  const plan: Plan = useMemo(() => {
    if (isAdmin) return "Admin";
    if (hasUnlimited) return "Pro";
    const metaPlan = readPlanFromMeta(user);
    if (metaPlan) return metaPlan;
    if ((capServer ?? 0) >= 25) return "Pro";
    return "Free";
  }, [isAdmin, hasUnlimited, user, capServer]);

  // Enforced caps by requirement (only used when NOT unlimited)
  const enforcedCap = hasUnlimited ? Infinity : plan === "Pro" ? 25 : 3;

  // Used display
  const usedDisplay = hasUnlimited
    ? usedServer
    : Math.max(
        0,
        Math.min(
          usedServer ?? 0,
          Number.isFinite(enforcedCap)
            ? (enforcedCap as number)
            : Number.MAX_SAFE_INTEGER
        )
      );

  const color =
    plan === "Admin"
      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
      : "bg-muted text-muted-foreground";

  const Icon = plan === "Admin" ? Crown : Sparkles;

  // Optional: don't render until first fetch completes to avoid a Pro flicker
  if (!loaded && !isAdminFromUser(user)) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`glass-card px-3 py-2 rounded-full shadow-lg ${color}`}
      >
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Icon className="h-4 w-4" />
          <span>{plan}</span>
          {hasUnlimited ? (
            <span>• ∞</span>
          ) : (
            <span>
              • {usedDisplay}/{Number.isFinite(enforcedCap) ? enforcedCap : "∞"}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
