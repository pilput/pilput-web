import Navigation from "@/components/header/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Metadata } from "next";
import { apiClient } from "@/utils/fetch";
import { getUrlImage } from "@/utils/getImage";
import { notFound } from "next/navigation";
import { Config } from "@/utils/getConfig";
import {
  AtSign,
  CalendarDays,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  UsersRound,
} from "lucide-react";
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

const getWebsiteLabel = (website?: string | null) => {
  if (!website) {
    return null;
  }

  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/^www\./, "");
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
  const initials =
    `${writer.first_name?.[0] ?? ""}${writer.last_name?.[0] ?? ""}` ||
    writer.username?.[0]?.toUpperCase() ||
    "P";
  const joinedDate = new Date(writer.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const websiteLabel = getWebsiteLabel(writer.profile?.website);
  const stats = [
    {
      label: "Followers",
      value: writer.followers_count ?? 0,
      icon: UsersRound,
    },
    {
      label: "Following",
      value: writer.following_count ?? 0,
      icon: AtSign,
    },
    {
      label: "Posts",
      value: writer.posts_count ?? 0,
      icon: FileText,
    },
  ];
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
      <main className="min-h-screen bg-background">
        <div className="border-b border-border/60 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_30%),linear-gradient(180deg,var(--background),color-mix(in_oklab,var(--muted)_35%,transparent))]">
          <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <Card className="overflow-hidden border-border/70 bg-card/90 py-0 shadow-sm backdrop-blur">
                <CardHeader className="relative border-b border-border/60 p-0">
                  <div className="h-24 bg-linear-to-r from-primary/20 via-chart-2/15 to-chart-4/15 sm:h-32" />
                  <div className="px-5 pb-6 sm:px-8 sm:pb-8">
                    <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
                        <Avatar className="h-24 w-24 shrink-0 border-4 border-card bg-card shadow-md sm:h-28 sm:w-28">
                          <AvatarImage
                            src={
                              writer.image
                                ? getUrlImage(writer.image)
                                : undefined
                            }
                            alt={fullName || writer.username}
                          />
                          <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 space-y-2 pb-0.5">
                          <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                              {fullName || writer.username}
                            </h1>
                            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                              <AtSign className="h-3.5 w-3.5" aria-hidden />
                              {writer.username}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                              <CalendarDays
                                className="h-3.5 w-3.5"
                                aria-hidden
                              />
                              Joined {joinedDate}
                            </span>
                            {writer.profile?.website && websiteLabel && (
                              <a
                                href={writer.profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                              >
                                <LinkIcon
                                  className="h-3.5 w-3.5 shrink-0"
                                  aria-hidden
                                />
                                <span className="truncate">{websiteLabel}</span>
                                <ExternalLink
                                  className="h-3 w-3 shrink-0"
                                  aria-hidden
                                />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="sm:pb-1">
                        <ProfileFollowActions
                          writerId={writer.id}
                          profileUsername={writer.username}
                          initialIsFollowing={Boolean(writer.is_following)}
                          redirectPath={redirectPath}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
                  <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        About
                      </p>
                      {writer.profile?.bio ? (
                        <p className="max-w-3xl text-base leading-7 text-foreground/80">
                          {writer.profile.bio}
                        </p>
                      ) : (
                        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                          @{writer.username} has not added a bio yet.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-1">
                      {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                          <div
                            key={stat.label}
                            className="rounded-lg border border-border/60 bg-muted/25 px-3 py-3 sm:px-4"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                {stat.label}
                              </span>
                              <Icon
                                className="h-3.5 w-3.5 text-primary/70"
                                aria-hidden
                              />
                            </div>
                            <div className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-foreground">
                              {stat.value.toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <WriterProfileClient
              username={params.username}
              displayName={fullName || writer.username}
            />
          </div>
        </div>
      </main>
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
