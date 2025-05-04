# Chat Room Implementation Plan

## Overview
This document outlines the plan for implementing chat room functionality in the Seoul FestivMeet application. The functionality includes:
1. Creating chat rooms
2. Displaying a list of chat rooms
3. Entering a chat room by clicking on it from the list

## Database Schema

### Tables

#### 1. chat_rooms
```sql
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. chat_messages
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. chat_room_participants
```sql
CREATE TABLE chat_room_participants (
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);
```

## API Routes

### 1. Chat Rooms API
- `POST /api/chat-rooms` - Create a new chat room
- `GET /api/chat-rooms` - Get a list of all chat rooms
- `GET /api/chat-rooms/:id` - Get details of a specific chat room
- `PUT /api/chat-rooms/:id` - Update a chat room
- `DELETE /api/chat-rooms/:id` - Delete a chat room

### 2. Chat Messages API
- `POST /api/chat-rooms/:id/messages` - Send a message to a chat room
- `GET /api/chat-rooms/:id/messages` - Get messages from a chat room

### 3. Chat Room Participants API
- `POST /api/chat-rooms/:id/participants` - Join a chat room
- `DELETE /api/chat-rooms/:id/participants/:userId` - Leave a chat room

## UI Components

### 1. Chat Room Creation
- Create a form with fields for:
  - Room name
  - Room description
- Add validation for required fields
- Add a submit button to create the room

### 2. Chat Room List
- Display a list of available chat rooms
- Show room name, description, and participant count for each room
- Add a button to create a new chat room
- Add click functionality to enter a chat room

### 3. Chat Room
- Display the chat room name and description
- Show a list of messages with sender name and timestamp
- Add a text input and send button for sending messages
- Add a button to leave the chat room

## Implementation Steps

### 1. Database Setup
1. Create the necessary tables in Supabase
2. Set up appropriate permissions and policies

### 2. API Implementation
1. Create API routes for chat room operations
2. Implement authentication and authorization checks
3. Connect API routes to Supabase

### 3. UI Implementation
1. Create chat room creation form
2. Implement chat room listing page
3. Create chat room page with messaging functionality

### 4. Testing
1. Test chat room creation
2. Test chat room listing
3. Test entering a chat room
4. Test sending and receiving messages

## Directory Structure

```
app/
├── api/
│   └── chat-rooms/
│       ├── route.ts
│       ├── [id]/
│       │   ├── route.ts
│       │   ├── messages/
│       │   │   └── route.ts
│       │   └── participants/
│       │       └── route.ts
└── protected/
    ├── chat/
    │   ├── page.tsx (Chat room list)
    │   ├── create/
    │   │   └── page.tsx (Create chat room form)
    │   └── [id]/
    │       └── page.tsx (Chat room page)
```

## Database Setup Instructions

To set up the necessary database tables in Supabase, follow these steps:

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create the following tables by executing these SQL commands:

### Create chat_rooms table
```sql
CREATE TABLE public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow users to view all chat rooms" 
  ON public.chat_rooms FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to create chat rooms" 
  ON public.chat_rooms FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow users to update their own chat rooms" 
  ON public.chat_rooms FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = created_by);

CREATE POLICY "Allow users to delete their own chat rooms" 
  ON public.chat_rooms FOR DELETE 
  TO authenticated 
  USING (auth.uid() = created_by);
```

### Create chat_messages table
```sql
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow participants to view messages" 
  ON public.chat_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_room_participants 
      WHERE room_id = chat_messages.room_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Allow participants to insert messages" 
  ON public.chat_messages FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_room_participants 
      WHERE room_id = chat_messages.room_id 
      AND user_id = auth.uid()
    )
  );
```

### Create chat_room_participants table
```sql
CREATE TABLE public.chat_room_participants (
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);

-- Set up RLS
ALTER TABLE public.chat_room_participants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow users to view participants" 
  ON public.chat_room_participants FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to join chat rooms" 
  ON public.chat_room_participants FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to leave chat rooms" 
  ON public.chat_room_participants FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);
```

### Enable Realtime for chat_messages table
To enable real-time updates for chat messages, you need to enable the Realtime feature for the chat_messages table:

1. Go to the Supabase dashboard
2. Navigate to Database > Replication
3. Click on the "Tables" tab
4. Find the "chat_messages" table and enable the "INSERT" event

## Conclusion
This implementation provides a comprehensive approach to adding chat room functionality to the Seoul FestivMeet application. By following these steps, we have created a robust chat system that allows users to create chat rooms, view a list of available rooms, and participate in conversations.

The implementation includes:
- Database tables with proper relationships and security policies
- API routes for all necessary operations
- UI components for creating, listing, and interacting with chat rooms
- Real-time messaging functionality

To test the implementation, create a new chat room, join it, and send messages. You should be able to see messages in real-time and interact with the chat room as expected.
