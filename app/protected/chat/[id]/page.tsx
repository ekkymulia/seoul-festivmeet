"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";

// Types
interface ChatRoom {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_details: {
    username: string;
    avatar_url: string;
  };
}

interface User {
  id: string;
  email: string;
}

// Chat room page

export default function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isParticipant, setIsParticipant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      setUser(user);
    };

    fetchUser();
  }, [router, supabase]);

  // Fetch chat room data and messages
  useEffect(() => {
    if (!user) return;

    const fetchChatRoom = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch chat room details
        const response = await fetch(`/api/chat-rooms/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Chat room not found");
          }
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch chat room");
        }

        const { data, isParticipant } = await response.json();
        setChatRoom(data);
        setIsParticipant(isParticipant);

        // Fetch messages if user is a participant
        if (isParticipant) {
          const messagesResponse = await fetch(`/api/chat-rooms/${id}/messages`);
          
          if (!messagesResponse.ok) {
            const errorData = await messagesResponse.json();
            throw new Error(errorData.error || "Failed to fetch messages");
          }

          const { data: messagesData } = await messagesResponse.json();
          setMessages(messagesData || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRoom();
  }, [id, user, supabase]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user || !isParticipant) return;

    const channel = supabase
      .channel(`chat_room_${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${id}`
        },
        (payload) => {
          // Fetch the complete message with user profile
          const fetchNewMessage = async () => {
            const { data, error } = await supabase
              .from('chat_messages')
              .select(`
                id,
                content,
                created_at,
                user_id,
                user_details:ref_id (
                  username,
                  avatar_url
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (!error && data) {
              setMessages(prev => [...prev, data]);
            }
          };

          fetchNewMessage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user, isParticipant, supabase]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join chat room
  const handleJoin = async () => {
    try {
      const response = await fetch(`/api/chat-rooms/${id}/participants`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join chat room");
      }

      setIsParticipant(true);
      
      // Fetch messages after joining
      const messagesResponse = await fetch(`/api/chat-rooms/${id}/messages`);
      if (messagesResponse.ok) {
        const { data: messagesData } = await messagesResponse.json();
        setMessages(messagesData || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  // Leave chat room
  const handleLeave = async () => {
    try {
      const response = await fetch(`/api/chat-rooms/${id}/participants`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to leave chat room");
      }

      setIsParticipant(false);
      setMessages([]);
      router.push("/protected/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !isParticipant) return;

    try {
      const response = await fetch(`/api/chat-rooms/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setNewMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 w-full flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Error</h1>
          <Link href="/protected/chat">
            <Button variant="outline">Back to Chat Rooms</Button>
          </Link>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!chatRoom) {
    return (
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chat Room Not Found</h1>
          <Link href="/protected/chat">
            <Button variant="outline">Back to Chat Rooms</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{chatRoom.name}</h1>
          {chatRoom.description && (
            <p className="text-gray-600">{chatRoom.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {isParticipant ? (
            <Button variant="destructive" onClick={handleLeave}>
              Leave Room
            </Button>
          ) : (
            <Button onClick={handleJoin}>Join Room</Button>
          )}
          <Link href="/protected/chat">
            <Button variant="outline">Back to Chat Rooms</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isParticipant ? (
        <>
          <div className="flex-1 border rounded-lg p-4 overflow-y-auto h-[60vh] flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                No messages yet. Be the first to send a message!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.user_id === user?.id
                      ? "items-end"
                      : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.user_id === user?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.user_details?.username || "Unknown user"} •{" "}
                    {new Date(message.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              Send
            </Button>
          </form>
        </>
      ) : (
        <div className="flex-1 border rounded-lg p-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              You need to join this chat room to see messages and participate.
            </p>
            <Button onClick={handleJoin}>Join Chat Room</Button>
          </div>
        </div>
      )}
    </div>
  );
}