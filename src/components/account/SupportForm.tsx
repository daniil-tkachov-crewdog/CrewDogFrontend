import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SupportForm({ userEmail }: { userEmail: string }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Contact Support</h2>
      </div>

      <Card className="p-8 glass-card">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent! We'll get back to you soon.");
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="supportEmail" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="supportEmail"
              type="email"
              value={userEmail}
              disabled
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Subject
            </Label>
            <Select>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="billing">Billing Question</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportMessage">Message</Label>
            <Textarea
              id="supportMessage"
              placeholder="Describe your issue or question..."
              className="min-h-[200px] resize-none"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </form>

        <div className="mt-8 text-center">
          <h3 className="font-semibold mb-2">Need immediate help?</h3>
          {/* ✅ plain text instead of DialogDescription */}
          <p className="text-sm text-muted-foreground">
            Check our FAQs or visit the support center.
          </p>
        </div>
      </Card>
    </section>
  );
}
