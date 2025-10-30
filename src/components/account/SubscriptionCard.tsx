import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle2, Crown, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { AccountUser } from "../data/account.types";

export default function SubscriptionCard({
  user,
  onCancel,
}: {
  user: AccountUser;
  onCancel: () => void;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Crown className="h-5 w-5 text-primary" />
        <h3 className="text-2xl font-bold">Subscription</h3>
      </div>

      <Card className="p-8 glass-card relative overflow-hidden group hover:shadow-xl transition-all">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-primary to-purple-500">
                  {user.plan}
                </Badge>
                {user.plan !== "Free" && (
                  <Badge
                    variant="outline"
                    className="gap-1 text-green-500 border-green-500/20"
                  >
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
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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

          <div className="flex gap-3">
            <Link to="/pricing" className="flex-1">
              <Button className="w-full group" size="lg">
                <Crown className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                {user.plan === "Free" ? "Upgrade Plan" : "Change Plan"}
              </Button>
            </Link>
            {user.plan !== "Free" && (
              <Button variant="outline" size="lg" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
