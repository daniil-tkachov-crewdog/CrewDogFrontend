// src/features/run/QuotaBadge.tsx
import { useAuth } from "@/auth/AuthProvider";
import { Crown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchAccountSummary } from "@/services/account";

function isAdminUser(user: any) {
  const app = user?.app_metadata ?? {};
  const u = user?.user_metadata ?? {};
  const role = app.role ?? u.role ?? user?.role;
  return (
    role === "ADMIN" ||
    role === "admin" ||
    app.isAdmin === true ||
    u.isAdmin === true
  );
}

export default function QuotaBadge() {
  const { user } = useAuth();
  const [cap, setCap] = useState<number>(0);
  const [used, setUsed] = useState<number>(0);
  const [unlimited, setUnlimited] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await fetchAccountSummary();
        if (!mounted) return;
        setCap(s.cap ?? 0);
        setUsed(s.used ?? 0);
        setUnlimited(Boolean(s.unlimited));
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const admin = isAdminUser(user);
  const plan = admin ? "Admin" : unlimited ? "Pro" : "Free";
  const hasUnlimited = admin || unlimited;

  const color =
    plan === "Admin"
      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
      : "bg-muted text-muted-foreground";
  const Icon = plan === "Admin" ? Crown : Sparkles;

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
              • {used}/{cap}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
