import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Topbar } from "@/components/layout/Topbar";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { gaEvent } from "@/analytics/gtm";

export default function Success() {
  useEffect(() => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: "checkout_success" });
    try {
      gaEvent("checkout_success");
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="p-12 text-center glass-card">
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your subscription has been activated. You now have full access to
              all premium features.
            </p>

            <div className="space-y-3">
              <Link to="/run" className="block">
                <Button size="lg" className="w-full magnetic-button">
                  Start Searching
                </Button>
              </Link>
              <Link to="/account" className="block">
                <Button size="lg" variant="outline" className="w-full">
                  View Account
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
