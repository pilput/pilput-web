"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Camera } from "lucide-react";
import { User } from "@/types/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getProfilePicture } from "@/utils/getImage";
import { toast } from "sonner";
import { apiClientApp } from "@/utils/fetch";
import { getCookie } from "cookies-next";

interface ProfileFormData {
  username: string;
  first_name: string;
  last_name: string;
}

interface UserProfile extends User {}

interface ProfileTabProps {
  user: UserProfile | null;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  loading: boolean;
  onProfileUpdate?: () => void;
}

export default function ProfileTab({ user, onSubmit, loading, onProfileUpdate }: ProfileTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    mode: "onBlur",
    defaultValues: {
      username: user?.username || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    },
  });

  const onFormSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    await onSubmit(data);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const token = getCookie("token");
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await apiClientApp.post("/v1/users/me/image", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile picture updated successfully!");
      onProfileUpdate?.();
      setPreviewImage(null);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload profile picture");
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const avatarUrl = previewImage || (user?.image ? getProfilePicture(user.image) : undefined);

  return (
    <Card className="bg-background/80 backdrop-blur-md border border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Profile Information</CardTitle>
        <CardDescription className="text-muted-foreground">
          Update your personal information and profile details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={avatarUrl}
                    alt={user?.username || "Profile picture"}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg">
                    {user?.first_name?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                    disabled={isUploading}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {user?.image ? "Change Picture" : "Upload Picture"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, GIF, or WebP. Max 5MB.
                </p>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-muted/50"
            />
            <p className="text-sm text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              {...register("username", {
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "Username can only contain letters, numbers, and underscores",
                },
              })}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                placeholder="First name"
                {...register("first_name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                placeholder="Last name"
                {...register("last_name")}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
