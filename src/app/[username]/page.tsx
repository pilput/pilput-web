import Navigation from "@/components/header/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { axiosInstance2 } from "@/utils/fetch";
import { getUrlImage } from "@/utils/getImage";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Users,
  Edit2,
  MoreHorizontal,
  Link as LinkIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import WriterProfileClient from "./WriterProfileClient";

interface succesResponse {
  data: Writer;
  message: string;
  success: boolean;
}

const getWriter = async (username: string): Promise<Writer> => {
  try {
    const { data } = await axiosInstance2(`/v1/writers/${username}`);
    const result = data as succesResponse;
    return result.data;
  } catch {
    throw notFound();
  }
};

export default async function page(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;
  const writer = await getWriter(params.username);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-linear-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Header Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/10 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-background">
                      <AvatarImage src={getUrlImage(writer.image)} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {writer.first_name?.[0]}
                        {writer.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        {writer.first_name} {writer.last_name}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        @{writer.username}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer">
                          <Users className="w-4 h-4 mr-2" />
                          Share Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-600">
                          Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {writer.profile?.bio && (
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {writer.profile.bio}
                  </p>
                )}

                {/* Additional Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      Joined{" "}
                      {new Date(writer.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>

                  {writer.profile?.website && (
                    <div className="flex items-center gap-1.5">
                      <LinkIcon className="w-4 h-4" />
                      <a
                        href={writer.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline transition-colors"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {/* {profile.followers?.toLocaleString() || '0'} */}0
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {/* {profile.following?.toLocaleString() || '0'} */}0
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Following
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {/* {profile.posts?.toLocaleString() || '0'} */}0
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Posts
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <WriterProfileClient writer={writer} username={params.username} />
          </div>
        </div>
      </div>
    </>
  );
}
