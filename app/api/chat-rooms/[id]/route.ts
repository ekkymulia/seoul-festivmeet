import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/chat-rooms/:id - Get details of a specific chat room
export async function GET(
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

  // Get chat room details
  const { data, error } = await supabase
    .from("chat_rooms")
    .select(`
      id,
      name,
      description,
      created_by,
      created_at,
      updated_at,
      chat_room_participants(
        user_id
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.code === "PGRST116" ? 404 : 500 }
    );
  }

  // Check if user is a participant
  const isParticipant = data.chat_room_participants.some(
    (participant: { user_id: string }) => participant.user_id === user.id
  );

  return NextResponse.json({ data, isParticipant });
}

// PUT /api/chat-rooms/:id - Update a chat room
export async function PUT(
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

  try {
    // Get request body
    const { name, description } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Room name is required" },
        { status: 400 }
      );
    }

    // Check if user is the creator of the chat room
    const { data: chatRoom, error: chatRoomError } = await supabase
      .from("chat_rooms")
      .select("created_by")
      .eq("id", id)
      .single();

    if (chatRoomError) {
      return NextResponse.json(
        { error: chatRoomError.message },
        { status: chatRoomError.code === "PGRST116" ? 404 : 500 }
      );
    }

    if (chatRoom.created_by !== user.id) {
      return NextResponse.json(
        { error: "Only the creator can update the chat room" },
        { status: 403 }
      );
    }

    // Update chat room
    const { data, error } = await supabase
      .from("chat_rooms")
      .update({
        name,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

// DELETE /api/chat-rooms/:id - Delete a chat room
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

  // Check if user is the creator of the chat room
  const { data: chatRoom, error: chatRoomError } = await supabase
    .from("chat_rooms")
    .select("created_by")
    .eq("id", id)
    .single();

  if (chatRoomError) {
    return NextResponse.json(
      { error: chatRoomError.message },
      { status: chatRoomError.code === "PGRST116" ? 404 : 500 }
    );
  }

  if (chatRoom.created_by !== user.id) {
    return NextResponse.json(
      { error: "Only the creator can delete the chat room" },
      { status: 403 }
    );
  }

  // Delete chat room (cascade will delete participants and messages)
  const { error } = await supabase
    .from("chat_rooms")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}