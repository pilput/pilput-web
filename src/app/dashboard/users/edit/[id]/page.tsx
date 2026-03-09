"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authStore } from "@/stores/userStore";
import type { User } from "@/types/user";
import { getToken, RemoveToken } from "@/utils/Auth";
import { axiosInstance3 } from "@/utils/fetch";

interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

interface UserForm {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  is_super_admin: "admin" | "user";
  password: string;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const auth = authStore((state) => state.data);
  const userId = useMemo(() => params?.id as string | undefined, [params]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<UserForm>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    is_super_admin: "user",
    password: "",
  });

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance3.get(`/v1/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const response = data as UserResponse | User;
        const user = "success" in response ? response.data : response;

        setForm({
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          username: user.username ?? "",
          email: user.email ?? "",
          is_super_admin: user.is_super_admin ? "admin" : "user",
          password: "",
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            RemoveToken();
            router.push("/login");
            return;
          }
          if (error.response?.status === 403) {
            router.push("/forbidden");
            return;
          }
        }
        toast.error("Failed to fetch user details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router, userId]);

  const onChange = (field: keyof UserForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!userId) return;

    if (!form.username.trim() || !form.email.trim()) {
      toast.error("Username and email are required");
      return;
    }

    const payload: Record<string, string | boolean> = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      is_super_admin: form.is_super_admin === "admin",
    };

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    setIsSaving(true);
    const toastId = toast.loading("Updating user...");

    try {
      await axiosInstance3.put(`/v1/users/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      toast.success("User updated successfully", { id: toastId });
      router.push("/dashboard/users");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          RemoveToken();
          router.push("/login");
          return;
        }
        if (error.response?.status === 403) {
          router.push("/forbidden");
          return;
        }
      }
      toast.error("Failed to update user", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => router.push("/dashboard/users")}> 
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to users
        </Button>
        {auth?.is_super_admin && (
          <p className="text-xs text-muted-foreground">Super admin only area</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
          <CardDescription>
            Update profile information, role, and password for this account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex min-h-40 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading user data...
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    value={form.first_name}
                    onChange={(event) => onChange("first_name", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    value={form.last_name}
                    onChange={(event) => onChange("last_name", event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={(event) => onChange("username", event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => onChange("email", event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={form.is_super_admin}
                  onValueChange={(value: "admin" | "user") => onChange("is_super_admin", value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New password (optional)</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(event) => onChange("password", event.target.value)}
                  placeholder="Leave empty to keep existing password"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/users")}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
