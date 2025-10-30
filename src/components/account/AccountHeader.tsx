import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Activity, Briefcase, Calendar, Crown, Target } from "lucide-react";
import type { AccountUser } from "../data/account.types";

export default function AccountHeader({ user }: { user: AccountUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="p-8 glass-card mb-8 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <motion.div className="relative group" whileHover={{ scale: 1.05 }}>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-1">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <motion.div
              className="absolute -inset-2 bg-primary/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              {user.plan !== "Free" && (
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Crown className="h-6 w-6 text-yellow-500" />
                </motion.div>
              )}
            </div>
            <p className="text-muted-foreground mb-4">{user.email}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="secondary" className="gap-1">
                <Calendar className="h-3 w-3" />
                Member since {user.memberSince}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3" />
                {user.totalSearches} searches
              </Badge>
              <Badge
                variant="outline"
                className="gap-1 bg-green-500/10 text-green-500 border-green-500/20"
              >
                <Target className="h-3 w-3" />
                {user.successRate}% success rate
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Searches", value: user.totalSearches, icon: Briefcase },
              { label: "Success", value: `${user.successRate}%`, icon: Target },
              { label: "Tier", value: user.plan, icon: Crown },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Card className="p-4 glass-card text-center hover:shadow-lg transition">
                  <s.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
