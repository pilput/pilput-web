"use client";

import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User as UserIcon, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getToken } from "@/utils/Auth";
import { apiClientApp } from "@/utils/fetch";
import { ErrorHandlerAPI } from "@/utils/ErrorHandler";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import Navigation from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import ProfileTab from "@/components/account/ProfileTab";
import SecurityTab from "@/components/account/SecurityTab";
import DangerZoneTab from "@/components/account/DangerZoneTab";
import { User } from "@/types/user";
import type { PasswordUpdateFormData } from "@/lib/validation";

export default function AccountPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [passwordLoading, setPasswordLoading] = React.useState(false);

  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUserProfile();
  }, [token, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClientApp.get("/v1/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.data);
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (data: { username: string; first_name: string; last_name: string }) => {
    setProfileLoading(true);
    try {
      const response = await apiClientApp.put("/v1/auth/profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.data);
    } catch (error) {
      ErrorHandlerAPI(error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (data: PasswordUpdateFormData) => {
    setPasswordLoading(true);
    try {
      await apiClientApp.patch(
        "/v1/auth/password",
        {
          old_password: data.old_password,
          new_password: data.new_password,
          confirm_password: data.confirm_password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      ErrorHandlerAPI(error);
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
      await apiClientApp.delete("/v1/auth/account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/");
    } catch (error) {
      ErrorHandlerAPI(error);
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
                    <UserIcon className="h-4 w-4" />
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
                      onProfileUpdate={fetchUserProfile}
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
