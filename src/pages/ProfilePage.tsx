import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Bell, Lock, User, Settings, CreditCard, Eye, EyeOff } from "lucide-react";

const ProfilePage = () => {
  const { currentUser, resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    
    setIsSubmitting(true);
    try {
      await resetPassword(currentUser.email);
      setNotificationMessage("Password reset email sent. Check your inbox.");
      setNotificationType("success");
      setShowNotification(true);
    } catch (error) {
      setNotificationMessage("Failed to send password reset email. Try again later.");
      setNotificationType("error");
      setShowNotification(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {showNotification && (
        <div className={`p-4 rounded-md ${
          notificationType === "success" ? "bg-green-50 text-green-700 border border-green-200" 
          : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          <div className="flex items-center justify-between">
            <p>{notificationMessage}</p>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input id="name" placeholder="Your full name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your.email@example.com" 
                defaultValue={currentUser?.email || ''} 
                disabled 
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
              <Input id="phone" placeholder="Your phone number" defaultValue="+1 (555) 123-4567" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
              <div className="relative">
                <Input 
                  id="current-password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
              <Input id="new-password" type={showPassword ? "text" : "password"} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</label>
              <Input id="confirm-password" type={showPassword ? "text" : "password"} placeholder="••••••••" />
            </div>
            <div className="pt-2">
              <Button variant="link" className="p-0 h-auto" onClick={handlePasswordReset} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Forgot your password?"}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Update Password</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive emails about account activity</p>
              </div>
              <div className="h-6 w-11 bg-primary rounded-full relative">
                <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white transform translate-x-0" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Transaction Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified about new transactions</p>
              </div>
              <div className="h-6 w-11 bg-primary rounded-full relative">
                <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white transform translate-x-0" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Communications</p>
                <p className="text-sm text-muted-foreground">Receive updates about new features</p>
              </div>
              <div className="h-6 w-11 bg-muted rounded-full relative">
                <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-foreground transform translate-x-0" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>Manage your connected payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                    <span className="text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 04/2025</p>
                  </div>
                </div>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Default</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">Add New Payment Method</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Preferences
          </CardTitle>
          <CardDescription>Manage general account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Currency</p>
              <p className="text-sm text-muted-foreground">Choose your preferred currency</p>
            </div>
            <select className="border rounded-md p-2">
              <option>USD - US Dollar</option>
              <option>EUR - Euro</option>
              <option>GBP - British Pound</option>
              <option>JPY - Japanese Yen</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Language</p>
              <p className="text-sm text-muted-foreground">Set application language</p>
            </div>
            <select className="border rounded-md p-2">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Date Format</p>
              <p className="text-sm text-muted-foreground">Choose how dates are displayed</p>
            </div>
            <select className="border rounded-md p-2">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage; 