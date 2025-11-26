"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Shield, Bell, AlertTriangle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCookie } from "cookies-next";
import { axiosInstence2 } from "@/utils/fetch";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { toast } from "react-hot-toast";

import ProfileTab from "@/components/account/ProfileTab";
import SecurityTab from "@/components/account/SecurityTab";
import NotificationsTab from "@/components/account/NotificationsTab";
import DangerZoneTab from "@/components/account/DangerZoneTab";

interface UserProfile {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface EmailPreferences {
  newsletter: boolean;
  notifications: boolean;
  marketing: boolean;
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      message: string;
    };
  };
  request?: any;
  message?: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState<EmailPreferences>({
    newsletter: true,
    notifications: true,
    marketing: false,
  });

  const router = useRouter();
  const token = getCookie("token");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUserProfile();
  }, [token, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstence2.get("/v1/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error("Failed to load profile information");
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error: ApiError): string => {
    if (error.response) {
      if (error.response.status === 401) {
        return "Unauthorized. Please login again.";
      } else if (error.response.data?.message) {
        return error.response.data.message;
      }
    } else if (error.message) {
      return error.message;
    }
    return "An error occurred";
  };

  const handleProfileUpdate = async (data: any) => {
    setProfileLoading(true);
    try {
      const response = await axiosInstence2.put("/v1/auth/profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setUser(response.data);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = getErrorMessage(apiError);
      toast.error(errorMessage);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      await axiosInstence2.put("/v1/auth/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("Password updated successfully!");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = getErrorMessage(apiError);
      toast.error(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    if (!confirm("This will permanently delete all your data. Are you absolutely sure?")) {
      return;
    }

    try {
      await axiosInstence2.delete("/v1/auth/account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = getErrorMessage(apiError);
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen">
        {/* Background gradient matching hero section */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.06),transparent_50%)]" />
        </div>
        
        {/* Separate Header Section */}
        <div className="relative z-10 container mx-auto px-4 pt-8 pb-6">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-4">Account Settings</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
              Manage your account settings and preferences with full control over your profile and privacy.
            </p>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="relative z-10 container mx-auto px-4 pb-8">
          <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
            <Tabs defaultValue="profile" className="w-full max-w-2xl">
              <TabsList className="grid w-full grid-cols-4 bg-background/80 backdrop-blur-md border border-border/50 shadow-lg">
                <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="danger" className="flex items-center gap-2 data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Zone
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <ProfileTab
                  user={user}
                  onSubmit={handleProfileUpdate}
                  loading={profileLoading}
                />
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <SecurityTab
                  onSubmit={handlePasswordUpdate}
                  loading={passwordLoading}
                />
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <NotificationsTab
                  preferences={emailPreferences}
                  onPreferencesChange={setEmailPreferences}
                  onSave={() => toast.success("Email preferences saved!")}
                />
              </TabsContent>

              {/* Danger Zone Tab */}
              <TabsContent value="danger">
                <DangerZoneTab onDeleteAccount={handleDeleteAccount} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </ErrorBoundary>
  );
}
