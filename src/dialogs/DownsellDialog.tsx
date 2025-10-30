import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function DownsellDialog({
  open,
  onOpenChange,
  onAccept,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAccept: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Special Offer - Stay for £2/month
          </DialogTitle>
          <DialogDescription>
            We'd love to keep you! How about staying with us for just £2/month
            instead?
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
          <Button variant="outline" onClick={onCancel}>
            Cancel Anyway
          </Button>
          <Button onClick={onAccept} className="flex-1">
            <Crown className="mr-2 h-4 w-4" />
            Accept Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
