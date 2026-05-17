import Link from "next/link";
import { Bookmark, Calendar, Eye, Heart } from "lucide-react";
import { getPostBookmarkCount, getPostLikesCount, type Post } from "@/types/post";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfilePicture } from "@/utils/getImage";

const PostItem = ({ post, showStats = true }: { post: Post; showStats?: boolean }) => {
  const plaintext = post.body.replace(/(<([^>]+)>)/gi, " ");
  const formattedDate = new Date(post.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Link href={`/${post.user.username}/${post.slug}`} className="block h-full">
      <Card className="group flex h-full flex-col overflow-hidden border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
        <CardHeader className="space-y-3 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.created_at}>{formattedDate}</time>
            </div>
            {post.tags?.[0] && (
              <Badge variant="secondary" className="h-5 rounded-md border border-primary/10 bg-primary/8 px-2 py-0 text-[10px] font-semibold text-primary hover:bg-primary/10">
                {post.tags[0].name}
              </Badge>
            )}
          </div>
          
          <CardTitle className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {post.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pb-3 grow">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {plaintext}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Avatar className="h-5 w-5 border border-border/50">
              <AvatarImage src={getProfilePicture(post.user?.image)} alt={post.user.username} />
              <AvatarFallback className="text-[10px]">
                {post.user.first_name?.[0] || post.user.username[0]}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium transition-colors group-hover:text-foreground">
              {post.user.username}
            </span>
          </div>
          
          {showStats && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1" title="Views">
                <Eye className="h-3.5 w-3.5" />
                <span>{post.view_count}</span>
              </div>
              <div className="flex items-center space-x-1 group-hover:text-red-500/70 transition-colors" title="Likes">
                <Heart className="h-3.5 w-3.5" />
                <span>{getPostLikesCount(post)}</span>
              </div>
              <div className="flex items-center space-x-1" title="Bookmarks">
                <Bookmark className="h-3.5 w-3.5" />
                <span>{getPostBookmarkCount(post)}</span>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PostItem;
