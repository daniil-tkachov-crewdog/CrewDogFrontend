import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shield } from "lucide-react";
import { useState } from "react";

export default function CancelSurveyDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (reason: string, other?: string) => void;
}) {
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOtherReason, setCancelOtherReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            We're sorry to see you go
          </DialogTitle>
          <DialogDescription>
            Help us improve by letting us know why you're cancelling
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={cancelReason}
          onValueChange={setCancelReason}
          className="space-y-3"
        >
          {[
            { value: "found_job", label: "I found a job" },
            { value: "price_high", label: "Too expensive" },
            { value: "irrelevant_results", label: "Results weren't relevant" },
            { value: "just_testing", label: "Just testing the service" },
            { value: "other", label: "Other" },
          ].map((reason) => (
            <div
              key={reason.value}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value={reason.value} id={reason.value} />
              <Label htmlFor={reason.value} className="cursor-pointer flex-1">
                {reason.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <AnimatePresence>
          {cancelReason === "other" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Textarea
                placeholder="Please tell us more..."
                value={cancelOtherReason}
                onChange={(e) => setCancelOtherReason(e.target.value)}
                className="mt-4"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Subscription
          </Button>
          <Button
            variant="destructive"
            disabled={!cancelReason}
            onClick={() => {
              onSubmit(cancelReason, cancelOtherReason);
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
