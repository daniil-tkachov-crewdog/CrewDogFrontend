import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMockAuth } from "@/hooks/useMockAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  History, 
  Settings, 
  HelpCircle,
  LogOut,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Account() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, logout } = useMockAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDownsellModal, setShowDownsellModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOtherReason, setCancelOtherReason] = useState("");
  const [expandedHistory, setExpandedHistory] = useState<number[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // User data from auth
  const user = {
    name: authUser?.name || "User",
    email: authUser?.email || "",
    plan: authUser?.plan || "Free",
    quota: { used: 2, total: 3 },
    subscriptionStatus: "active",
    renewalDate: "February 1, 2025"
  };

  const searchHistory = [
    {
      id: 1,
      date: "2025-01-15",
      company: "TechCorp Industries",
      status: "completed"
    },
    {
      id: 2,
      date: "2025-01-10",
      company: "Digital Solutions Ltd",
      status: "completed"
    }
  ];

  const handleCancelSubscription = () => {
    if (user.plan === "Free") return;
    setShowCancelModal(true);
  };

  const handleContinueCancel = () => {
    setShowCancelModal(false);
    setShowDownsellModal(true);
  };

  const handleFinalCancel = () => {
    setShowDownsellModal(false);
    // Cancel subscription logic here
    console.log("Subscription cancelled");
  };

  const handleKeepSubscription = () => {
    setShowDownsellModal(false);
    // Downgrade to £2 plan logic here
    console.log("Downgraded to £2 plan");
  };

  const toggleHistory = (id: number) => {
    setExpandedHistory(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <Link to="/run" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Tool
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => {
                logout();
                toast.success("Logged out successfully");
                navigate("/");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 glass-card">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="general">
                    <User className="mr-2 h-4 w-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <History className="mr-2 h-4 w-4" />
                    History
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="support">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Support
                  </TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Account Information</h2>
                    
                    <div className="space-y-4 mb-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg">{user.name}</span>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg">{user.email}</span>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Subscription</h3>
                      <Card className="p-6 bg-muted/50">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                              {user.plan}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {user.plan === "Free" ? "Free plan - limited features" : `Active subscription`}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Monthly quota</span>
                            <span className="font-medium">{user.quota.used}/{user.quota.total} searches</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${(user.quota.used / user.quota.total) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Resets on {user.renewalDate}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Link to="/pricing" className="flex-1">
                            <Button className="w-full" variant="default">
                              Upgrade Plan
                            </Button>
                          </Link>
                          {user.plan !== "Free" && (
                            <Button 
                              variant="outline" 
                              onClick={handleCancelSubscription}
                            >
                              Cancel Subscription
                            </Button>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Search History</h2>
                  
                  {searchHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No search history yet</p>
                      <Link to="/run" className="mt-4 inline-block">
                        <Button>Run Your First Search</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchHistory.map((item) => (
                        <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow">
                          <button
                            onClick={() => toggleHistory(item.id)}
                            className="w-full flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-left">
                                <p className="font-medium">{item.company}</p>
                                <p className="text-sm text-muted-foreground">{item.date}</p>
                              </div>
                            </div>
                            {expandedHistory.includes(item.id) ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </button>
                          
                          {expandedHistory.includes(item.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-border"
                            >
                              <p className="text-sm text-muted-foreground mb-2">Full search details would appear here</p>
                              <Button size="sm" variant="outline">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            </motion.div>
                          )}
                        </Card>
                      ))}
                      
                      <div className="flex items-center justify-center gap-4 pt-4">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <span className="text-sm text-muted-foreground">Page 1 of 1</span>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      <Button type="submit">Update Password</Button>
                    </form>
                  </Card>
                </TabsContent>

                {/* Support Tab */}
                <TabsContent value="support" className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
                  
                  <Card className="p-6">
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="supportEmail">Email</Label>
                        <Input 
                          id="supportEmail" 
                          type="email" 
                          value={user.email}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supportMessage">Message</Label>
                        <Textarea 
                          id="supportMessage" 
                          placeholder="How can we help you?"
                          className="min-h-[150px]"
                        />
                      </div>
                      <Button type="submit">Send Message</Button>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Cancel Survey Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>We're sorry to see you go</DialogTitle>
            <DialogDescription>
              Help us improve by letting us know why you're cancelling
            </DialogDescription>
          </DialogHeader>
          
          <RadioGroup value={cancelReason} onValueChange={setCancelReason}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="found_job" id="found_job" />
              <Label htmlFor="found_job">I found a job</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price_high" id="price_high" />
              <Label htmlFor="price_high">Too expensive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="irrelevant_results" id="irrelevant_results" />
              <Label htmlFor="irrelevant_results">Results weren't relevant</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="just_testing" id="just_testing" />
              <Label htmlFor="just_testing">Just testing the service</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>

          {cancelReason === "other" && (
            <Textarea
              placeholder="Please tell us more..."
              value={cancelOtherReason}
              onChange={(e) => setCancelOtherReason(e.target.value)}
              className="mt-4"
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Keep Subscription
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleContinueCancel}
              disabled={!cancelReason}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Downsell Modal */}
      <Dialog open={showDownsellModal} onOpenChange={setShowDownsellModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Special Offer - Stay for £2/month</DialogTitle>
            <DialogDescription>
              We'd love to keep you! How about staying with us for just £2/month instead?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="text-center">
                <p className="text-2xl font-bold mb-2">£2/month</p>
                <p className="text-sm text-muted-foreground">Limited time offer</p>
              </div>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleFinalCancel}>
              Cancel Anyway
            </Button>
            <Button onClick={handleKeepSubscription}>
              Keep Subscription at £2/month
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}