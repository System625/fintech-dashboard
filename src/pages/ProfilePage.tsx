import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/useAuthStore";
import { GlitchText } from "@/components/ui/GlitchText";
import { Lock, User, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { auth } from "@/services/firebase";
import { toast } from "sonner";
import { format } from "date-fns";

const ProfilePage = () => {
  const { currentUser, resetPassword } = useAuthStore();
  const { subscription, isProUser, isLoading: subLoading } = useSubscription();

  // Personal info state — seeded from Firebase Auth
  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password reset state
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setIsSavingProfile(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    setIsResettingPassword(true);
    try {
      await resetPassword(currentUser.email);
      toast.success("Password reset email sent", {
        description: "Check your inbox and follow the link to reset your password.",
      });
    } catch {
      toast.error("Failed to send reset email. Try again later.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <GlitchText intensity="low" trigger="hover">Profile & Settings</GlitchText>
        </h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ── Personal Information ───────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your display name</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Display Name</label>
              <Input
                id="name"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input
                id="email"
                type="email"
                value={currentUser?.email ?? ""}
                disabled
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSaveProfile}
              disabled={isSavingProfile || !displayName.trim()}
              className="cyber-glow-blue"
            >
              <GlitchText intensity="low" trigger="hover">
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </GlitchText>
            </Button>
          </CardFooter>
        </Card>

        {/* ── Security ──────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We'll send a password reset link to{" "}
              <span className="font-medium text-foreground">{currentUser?.email}</span>.
              Follow the link to set a new password.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={handlePasswordReset}
              disabled={isResettingPassword}
              className="cyber-glow-pink cyber-border"
            >
              <GlitchText intensity="low" trigger="hover">
                {isResettingPassword ? "Sending..." : "Send Password Reset Email"}
              </GlitchText>
            </Button>
          </CardFooter>
        </Card>

        {/* ── Subscription ──────────────────────────────────────────── */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Subscription
            </CardTitle>
            <CardDescription>Your current plan and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : isProUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-sm px-3 py-1">
                    <Crown className="mr-1 h-3 w-3" /> Punk Pro
                  </Badge>
                  <span className="text-sm text-muted-foreground capitalize">{subscription.status}</span>
                </div>
                {subscription.currentPeriodEnd && (
                  <p className="text-sm text-muted-foreground">
                    Renews {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  To cancel your subscription, contact support.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Free — Punk Starter</Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>1 account · 50 transactions/month</li>
                  <li>2 savings goals · 3 bills</li>
                  <li>Basic charts only · No CSV export</li>
                </ul>
                <Button onClick={() => setShowUpgrade(true)} className="cyber-glow-blue">                  
                  <GlitchText intensity="low" trigger="hover">
                    Upgrade to Punk Pro 
                  </GlitchText>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
};

export default ProfilePage;
