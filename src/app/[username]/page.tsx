import Navigation from "@/components/header/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Metadata } from "next";
import { apiClient } from "@/utils/fetch";
import { getUrlImage } from "@/utils/getImage";
import { notFound } from "next/navigation";
import { Config } from "@/utils/getConfig";
import { CalendarDays, Link as LinkIcon, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import WriterProfileClient from "./WriterProfileClient";
import ProfileFollowActions from "@/components/writer/ProfileFollowActions";
import type { Writer } from "@/types/writer";
import { cookies } from "next/headers";

interface SuccessResponse {
  data: Writer;
  message: string;
  success: boolean;
}

const getWriter = async (username: string): Promise<Writer> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const { data } = await apiClient.get(`/v1/users/username/${username}`, {
      ...(token && {
        headers: { Authorization: `Bearer ${token}` },
      }),
    });
    const result = data as SuccessResponse;
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
      <div className="min-h-screen bg-linear-to-br from-background via-primary/3 to-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <CardHeader className="border-b border-border/50 bg-muted/15 pb-6 pt-6 sm:pt-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <Avatar className="h-20 w-20 shrink-0 ring-2 ring-border/60 ring-offset-2 ring-offset-background sm:h-24 sm:w-24">
                      <AvatarImage
                        src={
                          writer.image ? getUrlImage(writer.image) : undefined
                        }
                      />
                      <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                        {writer.first_name?.[0]}
                        {writer.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-1">
                      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
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

              <CardContent className="space-y-6 pt-6 sm:pt-8">
                {writer.profile?.bio && (
                  <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
                    {writer.profile.bio}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-4 sm:gap-8">
                  <div className="rounded-lg bg-muted/30 px-3 py-4 text-center sm:px-4">
                    <div className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                      {(writer.followers_count ?? 0).toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                      Followers
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/30 px-3 py-4 text-center sm:px-4">
                    <div className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                      {(writer.following_count ?? 0).toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                      Following
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/30 px-3 py-4 text-center sm:px-4">
                    <div className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                      {(writer.posts_count ?? 0).toLocaleString()}
                    </div>
                    <div className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                      Posts
                    </div>
                  </div>
                </div>

                <Separator className="bg-border/60" />

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/50 bg-muted/20 p-4 sm:p-5">
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <User
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden
                      />
                      Personal
                    </h2>
                    <dl className="space-y-3 text-sm">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                        <dt className="text-muted-foreground">Name</dt>
                        <dd className="font-medium text-foreground">
                          {writer.first_name} {writer.last_name}
                        </dd>
                      </div>
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                        <dt className="text-muted-foreground">Username</dt>
                        <dd className="font-medium text-foreground">
                          @{writer.username}
                        </dd>
                      </div>
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                        <dt className="text-muted-foreground">Joined</dt>
                        <dd className="flex items-center gap-1.5 font-medium text-foreground">
                          <CalendarDays
                            className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                            aria-hidden
                          />
                          {new Date(writer.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-lg border border-border/50 bg-muted/20 p-4 sm:p-5">
                    <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <LinkIcon
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden
                      />
                      Links
                    </h2>
                    {writer.profile?.website ? (
                      <a
                        href={writer.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        <LinkIcon className="h-4 w-4 shrink-0" aria-hidden />
                        Website
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No link added yet.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <WriterProfileClient username={params.username} />
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
