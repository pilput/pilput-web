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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Profile Header with Cover */}
          <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-r from-card to-card/95">
            {/* Cover Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
              <div className="absolute inset-0 bg-black/10" />
            </div>

            <CardContent className="relative pt-0 pb-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12 px-6">
                <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-2 ring-white/20">
                      <AvatarImage src={getUrlImage(writer.image)} />
                      <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {writer.first_name?.[0]}
                        {writer.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-background rounded-full"></div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        {writer.first_name} {writer.last_name}
                      </h1>
                      <p className="text-muted-foreground font-medium">
                        @ {writer.username}
                      </p>
                    </div>

                    {writer.profile?.bio && (
                      <p className="text-muted-foreground max-w-md leading-relaxed">
                        {writer.profile.bio}
                      </p>
                    )}

                    {/* Additional Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-1" />
                        <span>
                          Joined{" "}
                          {new Date(writer.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                            }
                          )}
                        </span>
                      </div>

                      {writer.profile?.website && (
                        <div className="flex items-center">
                          <LinkIcon className="w-4 h-4 mr-1" />
                          <a
                            href={writer.profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline transition-colors"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button className="shadow-md hover:shadow-lg transition-shadow">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shadow-md hover:shadow-lg transition-shadow"
                      >
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

              <Separator className="my-6" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 px-6">
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl font-bold text-foreground group-hover:text-blue-500 transition-colors">
                    {/* {profile.followers?.toLocaleString() || '0'} */}0
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Followers
                  </div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl font-bold text-foreground group-hover:text-blue-500 transition-colors">
                    {/* {profile.following?.toLocaleString() || '0'} */}0
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Following
                  </div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl font-bold text-foreground group-hover:text-blue-500 transition-colors">
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
    </>
  );
}
