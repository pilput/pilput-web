"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, User, Link as LinkIcon } from "lucide-react";
import PostsUser from "@/components/writer/posts";

interface Writer {
  first_name: string;
  last_name: string;
  username: string;
  image?: string;
  created_at: string;
  profile?: {
    bio?: string;
    website?: string;
  };
}

interface WriterProfileClientProps {
  writer: Writer;
  username: string;
}

export default function WriterProfileClient({ writer, username }: WriterProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  return (
    <div className="space-y-6">
      {/* Navigation Pills */}
      <div className="flex justify-center">
        <div className="bg-muted/50 backdrop-blur-sm rounded-full p-1 border border-border/50">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'posts'
                  ? 'bg-background text-foreground shadow-sm border border-border/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Posts
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'about'
                  ? 'bg-background text-foreground shadow-sm border border-border/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <User className="w-4 h-4" />
              About
            </button>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/95">
        <CardContent className="p-8">
          {activeTab === 'posts' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Latest Posts
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Explore {writer.first_name}&apos;s writing
                    </p>
                  </div>
                </div>
              </div>
              <PostsUser username={username} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <User className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    About {writer.first_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get to know the writer
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bio Section */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {writer.profile?.bio ? (
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {writer.profile.bio}
                      </p>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-dashed border-border/50">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <p className="text-muted-foreground italic">
                          No bio available yet. {writer.first_name} hasn&apos;t added a bio to their profile.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Cards */}
                <div className="space-y-4">
                  {/* Personal Info Card */}
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Personal Info
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Full Name</span>
                          <span className="font-medium text-right">{writer.first_name} {writer.last_name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Username</span>
                          <span className="font-medium text-right">@{writer.username}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Joined</span>
                          <span className="font-medium text-right">
                            {new Date(writer.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Card */}
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        Contact & Links
                      </h4>
                      <div className="space-y-2">
                        {writer.profile?.website ? (
                          <a
                            href={writer.profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors text-sm group"
                          >
                            <LinkIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            <span className="font-medium">Visit Website</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <LinkIcon className="w-4 h-4" />
                            <span>No website added</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
