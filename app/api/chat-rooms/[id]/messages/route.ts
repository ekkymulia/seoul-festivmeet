import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/chat-rooms/:id/messages - Get messages from a chat room
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

  // Check if user is a participant in the chat room
  const { data: participant, error: participantError } = await supabase
    .from("chat_room_participants")
    .select()
    .eq("room_id", id)
    .eq("user_id", user.id)
    .single();

  if (participantError) {
    return NextResponse.json(
      { error: "You are not a participant in this chat room" },
      { status: 403 }
    );
  }

  // Get messages from the chat room
  const { data, error } = await supabase
    .from("chat_messages")
    .select(`
      id,
      content,
      created_at,
      user_id,
      user_details:user_id (
        username,
        avatar_url
      )
    `)
    .eq("room_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

// POST /api/chat-rooms/:id/messages - Send a message to a chat room
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

  try {
    // Get request body
    const { content } = await request.json();

    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Check if user is a participant in the chat room
    const { data: participant, error: participantError } = await supabase
      .from("chat_room_participants")
      .select()
      .eq("room_id", id)
      .eq("user_id", user.id)
      .single();

    if (participantError) {
      return NextResponse.json(
        { error: "You are not a participant in this chat room" },
        { status: 403 }
      );
    }

    // Send message
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        room_id: id,
        user_id: user.id,
        content,
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
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}