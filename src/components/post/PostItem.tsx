import Link from "next/link";
import { Eye, Heart, MessageCircle, Calendar, User } from "lucide-react";
import type { Post } from "@/types/post";
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
    <Link href={`/${post.creator.username}/${post.slug}`} className="block h-full">
      <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group flex flex-col overflow-hidden">
        <CardHeader className="space-y-3 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.created_at}>{formattedDate}</time>
            </div>
            {post.tags?.[0] && (
              <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 font-normal bg-primary/5 text-primary border-primary/10 hover:bg-primary/10">
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

        <CardFooter className="pt-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Avatar className="h-5 w-5 border border-border/50">
              <AvatarImage src={getProfilePicture(post.creator?.image)} alt={post.creator.username} />
              <AvatarFallback className="text-[10px]">
                {post.creator.first_name?.[0] || post.creator.username[0]}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium hover:text-foreground transition-colors">
              {post.creator.username}
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
                <span>{post.likes_count || 0}</span>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PostItem;
