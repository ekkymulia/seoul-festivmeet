import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Chat room list page
export default async function ChatRoomsPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get all chat rooms
  const { data: chatRooms, error } = await supabase
    .from("chat_rooms")
    .select(`
      id,
      name,
      description,
      created_by,
      created_at,
      updated_at,
      chat_room_participants(count)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching chat rooms:", error);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat Rooms</h1>
        <Link href="/protected/chat/create">
          <Button>Create Chat Room</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading chat rooms: {error.message}
        </div>
      )}

      {chatRooms && chatRooms.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No chat rooms available.</p>
          <p className="text-gray-500 mt-2">Create a new chat room to get started!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chatRooms?.map((room) => (
          <Link href={`/protected/chat/${room.id}`} key={room.id}>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{room.name}</h2>
                <Badge variant="secondary">
                  {room.chat_room_participants[0].count} participants
                </Badge>
              </div>
              <p className="text-gray-600 flex-grow mb-2">
                {room.description || "No description"}
              </p>
              <div className="text-xs text-gray-500">
                Created {new Date(room.created_at).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}