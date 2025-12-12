"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Config } from "./getConfig";

interface SocketOptions {
  token?: string;
  postId?: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isReconnecting: boolean;
}

export const useSocket = (options: SocketOptions = {}): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!options.token) {
      return;
    }

    const connectSocket = () => {
      if (socketRef.current) {
        console.log("Cleaning up existing socket connection");
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      const { token, postId } = options;

      console.log("Attempting to connect to WebSocket:", {
        url: Config.wsbaseurl + "/ws/posts",
        token: token ? "present" : "missing",
        postId: postId || "none",
      });

      socketRef.current = io(Config.wsbaseurl + "/ws/posts", {
        query: {
          ...(postId && { post_id: postId }),
          ...(token && { token }),
        },
        auth: {
          ...(token && { token }),
        },
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
        upgrade: true,
        rememberUpgrade: true,
      });

      if (socketRef.current) {
        socketRef.current.on("connect", () => {
          console.log("✅ Socket connected successfully");
          console.log("Socket ID:", socketRef.current?.id);
          setIsConnected(true);
          setIsReconnecting(false);

          if (postId) {
            console.log("🔗 Joining post room:", postId);
            socketRef.current?.emit("joinPost", { post_id: postId });

            socketRef.current?.on("joinedPost", (data) => {
              console.log("✅ Successfully joined post room:", data);
            });
          }
        });

        socketRef.current.on("connect_error", (error) => {
          console.error("❌ Socket connection error:", error);
          console.error("Error details:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
          });
          setIsConnected(false);
          setIsReconnecting(false);
        });

        socketRef.current.on("disconnect", (reason) => {
          console.log("🔌 Socket disconnected:", reason);
          setIsConnected(false);
          setIsReconnecting(false);
        });

        socketRef.current.on("error", (error) => {
          console.error("⚠️ Socket error:", error);
          setIsConnected(false);
        });

        socketRef.current.on("reconnect", (attemptNumber) => {
          console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
          setIsConnected(true);
          setIsReconnecting(false);
        });

        socketRef.current.on("reconnect_attempt", (attemptNumber) => {
          console.log("🔄 Socket reconnection attempt:", attemptNumber);
          setIsReconnecting(true);
        });

        socketRef.current.on("reconnect_error", (error) => {
          console.error("❌ Socket reconnection error:", error);
          setIsReconnecting(false);
        });

        socketRef.current.on("reconnect_failed", () => {
          console.error("❌ Socket reconnection failed");
          setIsReconnecting(false);
        });
      }
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [options.token, options.postId]);

  return {
    socket: socketRef.current,
    isConnected,
    isReconnecting,
  };
};

// Legacy export for backward compatibility
const useSocketLegacy = (url: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  return socket;
};

export default useSocketLegacy;
