"use client";
import { Config } from "@/utils/getCofig";
import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToken } from "@/utils/Auth";
import { getProfilePicture } from "@/utils/getImage";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, User } from "lucide-react";

interface CommentData {
  id: string;
  text: string;
  repies: CommentData;
  created_at: string;
  creator: any;
}

const Comment = ({ postId }: { postId: string }) => {
  const [comment, setcomment] = useState<string>("");
  const [comments, setcomments] = useState<Comment[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(Config.wsbaseurl + "/posts", {
      query: { post_id: postId, token: getToken() },
      extraHeaders: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (socketRef.current) {
      socketRef.current.on("newComment", (message: Comment[]) => {
        setcomments(message);
      });
    }
  }, []);

  function sendComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (socketRef.current) {
      socketRef.current.emit("sendComment", { text: comment });
      setcomment("");
    }
  }
  return (
    <div className="mt-12">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            💬 Comments
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live
        </div>
      </div>

      {/* Comments Feed */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No comments yet. Start the conversation! 🚀
            </p>
          </div>
        ) : (
          comments.map((data) => (
            <div key={data.id} className="flex gap-3 group animate-in slide-in-from-bottom-2 duration-300">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {data.creator?.first_name ? (
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={getProfilePicture(data.creator?.image)}
                    width={32}
                    height={32}
                    alt={`${data.creator?.first_name} ${data.creator?.last_name}`}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              {/* Message Bubble */}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 group-hover:bg-gray-100 dark:group-hover:bg-zinc-700 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {data.creator?.first_name ? 
                        `${data.creator.first_name} ${data.creator.last_name}` : 
                        'Anonymous'
                      }
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(data.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {data.text}
                  </p>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center gap-3 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-xs text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    👍 Like
                  </button>
                  <button className="text-xs text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    💬 Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
        <form onSubmit={sendComment} className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={comment}
                required
                onChange={(e) => setcomment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 pr-12 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!comment.trim()}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Comment;
