"use client";
import React, { useEffect, useState } from "react";
import Postlist from "@/components/post/Postlist";
import Postlistpulse from "@/components/post/postlistpulse";
import { axiosInstence } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import Navigation from "@/components/header/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Home, Tag, Bookmark, Heart, MessageCircle, Users, Trophy, Calendar, TrendingUp } from "lucide-react";

const postsPerPage = 10;

const Blog = () => {
  const [posts, setposts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const { data } = await axiosInstence.get("/v1/posts", {
          params: { limit: postsPerPage, offset: currentPage * postsPerPage },
        });

        setposts(data.data);
        if (data.metadata && data.metadata.totalItems) {
          setTotalPosts(data.metadata.totalItems);
        } else if (data.total) {
          setTotalPosts(data.total);
        }
      } catch (error) {
        toast.error("Error loading posts");
      }
      setIsLoading(false);
    }
    fetchPosts();
  }, [currentPage]);

  const sidebarItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Tag, label: "Tags", href: "/tags" },
    { icon: Trophy, label: "DEV Challenges", href: "/challenges", badge: "$10,000 in Prizes!" },
    { icon: Users, label: "DEV Showcase", href: "/showcase" },
    { icon: Calendar, label: "About", href: "/about" },
    { icon: MessageCircle, label: "Contact", href: "/contact" },
  ];

  const myTags = ["#go", "#javascript", "#webdev", "#react"];

  return (
    <>
      <Navigation />
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto flex gap-4 px-4 py-6">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-6">
              {/* Navigation Menu */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {sidebarItems.map((item, index) => (
                      <Link key={index} href={item.href} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                        <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              {/* Other Section */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Other</h3>
                  <nav className="space-y-2">
                    <Link href="/code-of-conduct" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Code of Conduct</span>
                    </Link>
                    <Link href="/privacy" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Privacy Policy</span>
                    </Link>
                    <Link href="/terms" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Terms of use</span>
                    </Link>
                  </nav>
                </CardContent>
              </Card>

              {/* My Tags */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">My Tags</h3>
                  <div className="space-y-2">
                    {myTags.map((tag, index) => (
                      <Link key={index} href={`/tags/${tag.slice(1)}`} className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
                {["relevant", "latest", "top"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post: Post) => <Postlist key={post.id} post={post} />)
              ) : !isLoading ? (
                <div className="text-center py-10 text-gray-500">No posts found</div>
              ) : null}
              {isLoading && <Postlistpulse />}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-6 space-y-4">
              {/* Active discussions */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Active discussions</h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <Link href="#" className="text-gray-900 dark:text-white hover:text-blue-600 font-medium">
                        10 best open source ChatGPT alternative that runs 100% locally
                      </Link>
                      <p className="text-gray-500 text-xs mt-1">11 comments</p>
                    </div>
                    <div className="text-sm">
                      <Link href="#" className="text-gray-900 dark:text-white hover:text-blue-600 font-medium">
                        zAgile: multimodal shell scripting with FO/S superpowers
                      </Link>
                      <p className="text-gray-500 text-xs mt-1">2 comments</p>
                    </div>
                    <div className="text-sm">
                      <Link href="#" className="text-gray-900 dark:text-white hover:text-blue-600 font-medium">
                        Vibe Coding is More Fun Than Actual Coding And That&apos;s Okay, Bro
                      </Link>
                      <p className="text-gray-500 text-xs mt-1">21 comments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What's happening this week */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-yellow-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">What&apos;s happening this week</h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Featured Launch 🚀</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Just Announced 🎉</p>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm">
                      <Link href="#" className="text-gray-900 dark:text-white hover:text-blue-600 font-medium">
                        Next-Gen PWAs at and ML Drive Personalized & Predictive Web Experiences
                      </Link>
                      <p className="text-gray-500 text-xs mt-1">1 comment</p>
                    </div>
                    <div className="text-sm">
                      <Link href="#" className="text-gray-900 dark:text-white hover:text-blue-600 font-medium">
                        AI Powered Content Buddy - Supercharge Your Writing with Storybook & GPT
                      </Link>
                      <p className="text-gray-500 text-xs mt-1">4 comments</p>
                    </div>
                    <div className="text-sm">
                      <Link href="#" className="text-gray-900 dark:text-white hover:text-blue-600 font-medium">
                        Five Programming Jokes You Didn&apos;t Know You Needed Today 😂🔥
                      </Link>
                      <p className="text-gray-500 text-xs mt-1">1 comment</p>
                    </div>
                    <div className="text-sm">
                      <Link href="#" className="text-gray-900 dark:text-white hover:text-blue-600 font-medium">
                        I Built a Simple Budgeting App Called Budget Buddy
                      </Link>
                      <p className="text-gray-500 text-xs mt-1">4 comments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
