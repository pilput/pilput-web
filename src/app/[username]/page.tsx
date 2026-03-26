import Navigation from "@/components/header/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Metadata } from "next";
import { axiosInstance3 } from "@/utils/fetch";
import { getUrlImage } from "@/utils/getImage";
import { notFound } from "next/navigation";
import { Config } from "@/utils/getConfig";
import { CalendarDays, Link as LinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import WriterProfileClient from "./WriterProfileClient";
import ProfileFollowActions from "@/components/writer/ProfileFollowActions";
import type { Writer } from "@/types/writer";
import { cookies } from "next/headers";

interface succesResponse {
  data: Writer;
  message: string;
  success: boolean;
}

const getWriter = async (username: string): Promise<Writer> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const { data } = await axiosInstance3.get(`/v1/users/username/${username}`, {
      ...(token && {
        headers: { Authorization: `Bearer ${token}` },
      }),
    });
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
  const redirectPath = `/${params.username}`;

  const baseUrl = Config.mainbaseurl;
  const profileUrl = `${baseUrl}/${params.username}`;
  const fullName = `${writer.first_name} ${writer.last_name}`.trim();
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName || writer.username,
    url: profileUrl,
    image: writer.image ? getUrlImage(writer.image) : `${baseUrl}/pilput.png`,
    description: writer.profile?.bio || `Writer and creator on pilput`,
    ...(writer.profile?.website && { sameAs: [writer.profile.website] }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
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
                      <AvatarImage
                      src={
                        writer.image ? getUrlImage(writer.image) : undefined
                      }
                    />
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

                  <ProfileFollowActions
                    writerId={writer.id}
                    profileUsername={writer.username}
                    initialIsFollowing={Boolean(writer.is_following)}
                    redirectPath={redirectPath}
                  />
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
                      {(writer.followers_count ?? 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {(writer.following_count ?? 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Following
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {(writer.posts_count ?? 0).toLocaleString()}
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

export async function generateMetadata(props: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const baseUrl = Config.mainbaseurl;

  try {
    const writer = await getWriter(params.username);
    const fullName = `${writer.first_name} ${writer.last_name}`.trim();
    const title = fullName
      ? `${fullName} (@${writer.username})`
      : `@${writer.username}`;
    const description =
      writer.profile?.bio ||
      `Read posts and updates from @${writer.username} on pilput.`;
    const profileImage = writer.image
      ? getUrlImage(writer.image)
      : `${baseUrl}/pilput.png`;
    const canonicalUrl = `/${params.username}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "profile",
        url: `${baseUrl}${canonicalUrl}`,
        title,
        description,
        images: [
          {
            url: profileImage,
            alt: title,
            width: 400,
            height: 400,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [profileImage],
      },
    };
  } catch {
    return {
      title: "Profile Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}
