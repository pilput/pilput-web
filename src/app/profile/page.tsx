"use client";
import Link from "next/link";
import React from "react";
import { axiosInstance } from "../../utils/fetch";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { profileStore } from "@/stores/profilestorage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfilePicture } from "@/utils/getImage";

const Profile = () => {
  const router = useRouter();
  const { profile, refresh } = profileStore();

  if (!profile.id) {
    refresh();
    return (
      <div className="flex justify-center mb-10">
        <Card className="w-full max-w-2xl my-20">
          <CardContent className="pt-6">
            <div className="space-y-8 flex flex-col items-center">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function deletePicture() {
    const response = await axiosInstance.delete("/auth/profile/avatar");
    if (response.status >= 200 && response.status <= 299) {
      refresh();
    }
  }

  return (
    <div className="flex justify-center mb-10 px-4">
      <Card className="w-full max-w-2xl my-20">
        <CardHeader className="relative">
          <Link
            href="/update-profile"
            className="absolute right-6 top-6 transition-transform hover:scale-105"
          >
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={profile.image ? getProfilePicture(profile.image) : "https://placeimg.com/640/480/any"}
                  alt={profile.fullName || "Profile picture"}
                  className="object-cover"
                />
                <AvatarFallback>{profile.fullName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              {profile.image && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={deletePicture}
                    className="text-white hover:text-red-400"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight">{profile.fullName}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>

            <div className="w-full max-w-md space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  An artist of considerable range, Mike is the name taken by
                  Melbourne-raised, Brooklyn-based Nick Murphy writes, performs
                  and records all of his own music, giving it a warm.
                </p>
                <div className="pt-4">
                  <Link href="/">
                    <Button variant="link" className="text-primary">
                      Back to home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
