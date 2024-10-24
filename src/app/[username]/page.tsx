import Navigation from "@/components/header/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { axiosIntence2 } from "@/utils/fetch";
import { getUrlImage } from "@/utils/getImage";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  BookOpen,
  Heart,
  MessageSquare,
  Users,
  Edit2,
  MoreHorizontal,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface succesResponse {
  data: Writer;
  message: string;
  success: boolean;
}

const getWriter = async (username: string): Promise<Writer> => {
  try {
    const { data } = await axiosIntence2(`/writers/${username}`);
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={getUrlImage(writer.image)} />
                  <AvatarFallback className="text-lg">
                    {writer.first_name + " " + writer.last_name}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h1 className="text-2xl font-bold">{writer.username}</h1>
                  <p className="text-muted-foreground mt-1">{writer.profile.bio}</p>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    <span>Joined {writer.created_at}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Share Profile</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex space-x-6">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {/* {profile.followers.toLocaleString()} */}
                  </div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {/* {profile.following.toLocaleString()} */}
                  </div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="articles">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            {/* {profile.articles.map((article) => (
              <Card key={article.id}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    {article.preview}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      {article.date}
                    </span>
                    <span className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {article.likes} likes
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {article.comments} comments
                    </span>
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />5 min read
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))} */}
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Full profile information and extended bio would go here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle>Saved Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Bookmarked and saved articles would appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
