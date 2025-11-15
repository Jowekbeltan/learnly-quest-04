import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Globe, 
  HelpCircle, 
  Info,
  Moon,
  Sun,
  LogOut,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user, signOut, profile, refreshProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Account Management States
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [lessonReminders, setLessonReminders] = useState(true);

  // General Preferences
  const [language, setLanguage] = useState("en");
  const [vibration, setVibration] = useState(true);

  // Privacy Settings
  const [shareProgress, setShareProgress] = useState(true);
  const [showProfile, setShowProfile] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("user_preferences" as any)
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const prefs = data as any;
        setEmailNotifications(prefs.email_notifications);
        setPushNotifications(prefs.push_notifications);
        setAchievementAlerts(prefs.achievement_alerts);
        setLessonReminders(prefs.lesson_reminders);
        setShareProgress(prefs.share_progress);
        setShowProfile(prefs.show_profile);
        setTwoFactorAuth(prefs.two_factor_auth);
        setLanguage(prefs.language);
        setVibration(prefs.vibration);
      } else {
        // Create default preferences if none exist
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  const createDefaultPreferences = async () => {
    try {
      const { error } = await supabase
        .from("user_preferences" as any)
        .insert({
          user_id: user?.id,
          email_notifications: true,
          push_notifications: true,
          achievement_alerts: true,
          lesson_reminders: true,
          share_progress: true,
          show_profile: true,
          two_factor_auth: false,
          language: "en",
          vibration: true,
        } as any);

      if (error) throw error;
    } catch (error) {
      console.error("Error creating default preferences:", error);
    }
  };

  const updatePreference = async (field: string, value: any) => {
    try {
      const { error } = await supabase
        .from("user_preferences" as any)
        .update({ [field]: value } as any)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Saved",
        description: "Preference updated successfully",
      });
    } catch (error) {
      console.error("Error updating preference:", error);
      toast({
        title: "Error",
        description: "Failed to save preference",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName })
        .eq("user_id", user?.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-hero-gradient rounded-lg flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences</p>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="account" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="help" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Help</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">About</span>
              </TabsTrigger>
            </TabsList>

            {/* Account Management */}
            <TabsContent value="account" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>
                  <Button onClick={handleUpdateProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button onClick={handleChangePassword}>Change Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your account session</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleSignOut} variant="destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={(value) => {
                        setEmailNotifications(value);
                        updatePreference("email_notifications", value);
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={(value) => {
                        setPushNotifications(value);
                        updatePreference("push_notifications", value);
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Achievement Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when you earn achievements</p>
                    </div>
                    <Switch
                      checked={achievementAlerts}
                      onCheckedChange={(value) => {
                        setAchievementAlerts(value);
                        updatePreference("achievement_alerts", value);
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Lesson Reminders</Label>
                      <p className="text-sm text-muted-foreground">Reminders to complete daily lessons</p>
                    </div>
                    <Switch
                      checked={lessonReminders}
                      onCheckedChange={(value) => {
                        setLessonReminders(value);
                        updatePreference("lesson_reminders", value);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance */}
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>Customize the look and feel of the app</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Theme Mode</Label>
                    <div className="flex gap-3">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        onClick={() => setTheme("light")}
                        className="flex-1"
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        onClick={() => setTheme("dark")}
                        className="flex-1"
                      >
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        onClick={() => setTheme("system")}
                        className="flex-1"
                      >
                        System
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Text Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy & Security */}
            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Share Progress</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your learning progress</p>
                    </div>
                    <Switch
                      checked={shareProgress}
                      onCheckedChange={(value) => {
                        setShareProgress(value);
                        updatePreference("share_progress", value);
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                    </div>
                    <Switch
                      checked={showProfile}
                      onCheckedChange={(value) => {
                        setShowProfile(value);
                        updatePreference("show_profile", value);
                      }}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch
                      checked={twoFactorAuth}
                      onCheckedChange={(value) => {
                        setTwoFactorAuth(value);
                        updatePreference("two_factor_auth", value);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* General Preferences */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Preferences</CardTitle>
                  <CardDescription>Configure basic app settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select 
                      value={language} 
                      onValueChange={(value) => {
                        setLanguage(value);
                        updatePreference("language", value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Vibration</Label>
                      <p className="text-sm text-muted-foreground">Enable haptic feedback</p>
                    </div>
                    <Switch
                      checked={vibration}
                      onCheckedChange={(value) => {
                        setVibration(value);
                        updatePreference("vibration", value);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Help & Support */}
            <TabsContent value="help" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>Get help and learn more about LearnlyQuest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Frequently Asked Questions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    User Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Privacy Policy
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Terms of Service
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* About */}
            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About LearnlyQuest</CardTitle>
                  <CardDescription>App information and version details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Version</Label>
                    <p className="text-sm text-muted-foreground">1.0.0</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Developer</Label>
                    <p className="text-sm text-muted-foreground">LearnlyQuest Team</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Last Updated</Label>
                    <p className="text-sm text-muted-foreground">January 2025</p>
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full">
                    Check for Updates
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
