import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Edit2, Mail, User } from "lucide-react";
import { toast } from "sonner";
import type { AccountUser } from "../data/account.types";

export default function ProfileInfo({ user }: { user: AccountUser }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  const handleSaveName = () => {
    // TODO: call API to update name
    toast.success("Name updated successfully!");
    setIsEditingName(false);
  };

  const handleSaveEmail = () => {
    // TODO: call API to update email (send verification)
    toast.success("Email updated — please verify.");
    setIsEditingEmail(false);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Profile Information</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <Card className="p-6 glass-card group">
          <Label className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name
          </Label>

          {isEditingName ? (
            <div className="space-y-3">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={user.name}
                className="h-12"
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveName} size="sm" className="flex-1">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingName(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">{user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>

        {/* Email */}
        <Card className="p-6 glass-card group">
          <Label className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>

          {isEditingEmail ? (
            <div className="space-y-3">
              <Input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder={user.email}
                type="email"
                className="h-12"
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveEmail} size="sm" className="flex-1">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingEmail(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium truncate">{user.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingEmail(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
