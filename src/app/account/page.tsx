"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCookie } from "cookies-next";
import { axiosInstance2, axiosInstance3 } from "@/utils/fetch";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import ProfileTab from "@/components/account/ProfileTab";
import SecurityTab from "@/components/account/SecurityTab";
import DangerZoneTab from "@/components/account/DangerZoneTab";
import { User as UserType } from "@/types/user";

interface UserProfile extends UserType {}

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
      const response = await axiosInstance3.get("/v1/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.data); // API returns data.data structure
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
      const response = await axiosInstance3.put("/v1/auth/profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data.data); // API returns data.data structure
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
      await axiosInstance3.patch(
        "/v1/auth/password",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

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
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    if (
      !confirm(
        "This will permanently delete all your data. Are you absolutely sure?",
      )
    ) {
      return;
    }

    try {
      await axiosInstance2.delete("/v1/auth/account", {
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
      <Navigation />
      <main className="min-h-screen py-12 sm:py-16 lg:py-20">
        {/* Standard background pattern */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] dark:bg-grid-slate-700/[0.06] bg-size-[36px_36px]" />

        {/* Main Content */}
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">
                Account Settings
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your account settings and preferences.
              </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">
                <TabsList className="flex flex-col items-stretch bg-muted/50 p-2 space-y-2 w-full rounded-lg border h-fit">
                  <TabsTrigger
                    value="profile"
                    className="w-full justify-start gap-3 text-sm font-medium px-4 py-3 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-muted/80 transition-all"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="w-full justify-start gap-3 text-sm font-medium px-4 py-3 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-muted/80 transition-all"
                  >
                    <Shield className="h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="danger"
                    className="w-full justify-start gap-3 text-sm font-medium px-4 py-3 rounded-md data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground data-[state=active]:shadow-sm hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Danger Zone
                  </TabsTrigger>
                </TabsList>

                <div className="pt-1">
                  <TabsContent value="profile" className="mt-0">
                    <ProfileTab
                      user={user}
                      onSubmit={handleProfileUpdate}
                      loading={profileLoading}
                    />
                  </TabsContent>

                  <TabsContent value="security" className="mt-0">
                    <SecurityTab
                      onSubmit={handlePasswordUpdate}
                      loading={passwordLoading}
                    />
                  </TabsContent>

                  <TabsContent value="danger" className="mt-0">
                    <DangerZoneTab onDeleteAccount={handleDeleteAccount} />
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
