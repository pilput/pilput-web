"use client"

import * as React from "react"
import { Trophy, Eye, Heart, ExternalLink } from "lucide-react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { postsStore } from "@/stores/posts-store"

export default function TopPostsWidget() {
  const { analytics, analyticsLoading } = postsStore()

  const topPosts = React.useMemo(() => {
    if (!analytics || !analytics.top_posts) return []
    return analytics.top_posts
  }, [analytics])

  // Get max view count to calculate relative widths
  const maxViews = React.useMemo(() => {
    if (topPosts.length === 0) return 1
    return Math.max(...topPosts.map((p) => p.view_count), 1)
  }, [topPosts])

  return (
    <Card className="glass-card border-glow-hover shadow-premium hover:shadow-premium-hover rounded-2xl overflow-hidden h-full flex flex-col justify-between transition-all duration-300">
      <CardHeader className="border-b border-border/50 py-5">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Top Performing Posts
        </CardTitle>
        <CardDescription className="text-sm">
          Your most popular published articles by view count
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 flex-1 flex flex-col justify-start">
        {analyticsLoading ? (
          <div className="space-y-4 w-full">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[60%] rounded" />
                  <Skeleton className="h-4 w-[20%] rounded" />
                </div>
                <Skeleton className="h-2 w-full rounded" />
              </div>
            ))}
          </div>
        ) : topPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm text-center">
            <p>No published articles found.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Start writing to see performance analytics here!</p>
          </div>
        ) : (
          <div className="space-y-5 w-full">
            {topPosts.map((post) => {
              const percent = (post.view_count / maxViews) * 100
              return (
                <div key={post.id} className="space-y-2 group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <Link 
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        className="font-medium text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1 group-hover:underline"
                      >
                        <span className="truncate">{post.title}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <p className="text-[10px] font-mono text-muted-foreground/80 truncate">
                        /{post.slug}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2.5 shrink-0 text-xs text-muted-foreground tabular-nums">
                      <span className="flex items-center gap-1" title={`${post.view_count} Views`}>
                        <Eye className="h-3.5 w-3.5" />
                        {post.view_count.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1" title={`${post.like_count} Likes`}>
                        <Heart className="h-3.5 w-3.5 text-rose-500" />
                        {post.like_count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
