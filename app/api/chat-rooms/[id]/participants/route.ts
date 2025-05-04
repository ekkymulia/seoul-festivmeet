import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST /api/chat-rooms/:id/participants - Join a chat room
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id } = params;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Check if chat room exists
  const { data: chatRoom, error: chatRoomError } = await supabase
    .from("chat_rooms")
    .select("id")
    .eq("id", id)
    .single();

  if (chatRoomError) {
    return NextResponse.json(
      { error: "Chat room not found" },
      { status: 404 }
    );
  }

  // Check if user is already a participant
  const { data: existingParticipant, error: existingParticipantError } = await supabase
    .from("chat_room_participants")
    .select()
    .eq("room_id", id)
    .eq("user_id", user.id)
    .single();

  if (existingParticipant) {
    return NextResponse.json(
      { error: "You are already a participant in this chat room" },
      { status: 400 }
    );
  }

  // Join chat room
  const { data, error } = await supabase
    .from("chat_room_participants")
    .insert({
      room_id: id,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}

// DELETE /api/chat-rooms/:id/participants - Leave a chat room
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id } = params;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Check if user is a participant
  const { data: participant, error: participantError } = await supabase
    .from("chat_room_participants")
    .select()
    .eq("room_id", id)
    .eq("user_id", user.id)
    .single();

  if (participantError) {
    return NextResponse.json(
      { error: "You are not a participant in this chat room" },
      { status: 400 }
    );
  }

  // Check if user is the creator of the chat room
  const { data: chatRoom, error: chatRoomError } = await supabase
    .from("chat_rooms")
    .select("created_by")
    .eq("id", id)
    .single();

  if (!chatRoomError && chatRoom.created_by === user.id) {
    return NextResponse.json(
      { error: "The creator cannot leave the chat room. Delete the room instead." },
      { status: 400 }
    );
  }

  // Leave chat room
  const { error } = await supabase
    .from("chat_room_participants")
    .delete()
    .eq("room_id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}