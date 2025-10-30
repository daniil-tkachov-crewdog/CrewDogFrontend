import type { LucideIcon } from "lucide-react";

export type AccountUser = {
  name: string;
  email: string;
  plan: "Free" | "Premium" | string;
  quota: { used: number; total: number };
  subscriptionStatus: "active" | "paused" | "canceled" | string;
  renewalDate: string;
  memberSince: string;
  totalSearches: number;
  successRate: number;
  avatar?: string;
};

export type SearchItem = {
  id: number;
  date: string;
  company: string;
  status: "completed" | "failed" | "queued" | string;
  results: number;
  duration: string;
};

export type Achievement = {
  icon: LucideIcon;
  name: string;
  description: string;
  unlocked: boolean;
};

export type ActivityItem = {
  action: string;
  time: string;
  icon: LucideIcon;
};
