import { useAuth } from "@/auth/AuthProvider";
import { Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const bcRef = useRef<BroadcastChannel | null>(null);
  const refreshTimer = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const s = await fetchAccountSummary();
      setUsedServer(Number(s.used ?? 0));
      setCapServer(typeof s.cap === "number" ? Number(s.cap) : null);
      setUnlimitedServer(Boolean(s.unlimited));
      setIsAdminServer(Boolean((s as any).isAdmin));
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    refreshTimer.current = window.setTimeout(refresh, 1200);
    return () => {
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
    };
  }, [refresh]);

  useEffect(() => {
    try {
      const bc = new BroadcastChannel("gc-activity");
      bcRef.current = bc;
      bc.addEventListener("message", (e) => {
        if (
          e?.data?.type === "quota_changed" ||
          e?.data?.type === "search_used"
        ) {
          setTimeout(refresh, 350);
        }
      });
      return () => {
        try {
          bc.close();
        } catch {}
        bcRef.current = null;
      };
    } catch {}
  }, [refresh]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [refresh]);

  const isAdmin = useMemo(
    () => isAdminFromUser(user) || isAdminServer,
    [user, isAdminServer]
  );

  const hasUnlimited = isAdmin || unlimitedServer;

  const plan: Plan = useMemo(() => {
    if (isAdmin) return "Admin";
    if (hasUnlimited) return "Pro";

    // Try to read from user metadata first (if you ever set it)
    const metaPlan = readPlanFromMeta(user);
    if (metaPlan) return metaPlan;

    // Fallback: anything above free cap (3) is treated as a paid plan
    if ((capServer ?? 0) > 3) return "Pro";

    return "Free";
  }, [isAdmin, hasUnlimited, user, capServer]);

    const enforcedCap = hasUnlimited
      ? Infinity
      : Number.isFinite(capServer as any)
      ? (capServer as number)
      : plan === "Pro"
      ? 20 // safe default if server didn't send a cap
      : 3;


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
