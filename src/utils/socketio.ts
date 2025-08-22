"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Config } from "./getCofig";

interface SocketOptions {
  token?: string;
  postId?: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isReconnecting: boolean;
  reconnect: () => void;
}

export const useSocket = (options: SocketOptions = {}): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const connectSocket = () => {
    // Clean up any existing connection
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const { token, postId } = options;

    socketRef.current = io(Config.wsbaseurl, {
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
        console.log("Socket connected successfully");
        setIsConnected(true);
        setIsReconnecting(false);

        // Join post room if postId is provided
        if (postId) {
          console.log("Joining post room:", postId);
          socketRef.current?.emit("joinPost", { post_id: postId });
          
          // Confirm room join
          socketRef.current?.on("joinedPost", (data) => {
            console.log("Successfully joined post room:", data);
          });
        }
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
        setIsReconnecting(false);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
        setIsReconnecting(false);
      });

      socketRef.current.on("error", (error) => {
        console.error("Socket error:", error);
        setIsConnected(false);
      });
    }
  };

  const reconnect = () => {
    if (options.token) {
      setIsReconnecting(true);
      connectSocket();
    }
  };

  useEffect(() => {
    if (options.token) {
      connectSocket();
    }

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
    reconnect,
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
