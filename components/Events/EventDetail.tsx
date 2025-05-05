// app/events/[id]/EventDetailClient.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Event = {
  id: number;
  event_name: string | null;
  event_description: string | null;
  event_thumbnail: string | null;
  event_start_date: string | null;
  event_end_date: string | null;
  event_location: string | null;
  event_organizer: string | null;
  event_additional_description: string | null;
};

export default function EventDetailClient({ event }: { event: Event }) {
  const router = useRouter();

  const handleCreateRoom = () => {
    router.push('/protected/chatting/create_room');
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">{event.event_name}</h1>

      <Image
        src={event.event_thumbnail || '/images/event-test.png'}
        alt={`${event.event_name} 대표 이미지`}
        width={400}
        height={400}
        className="rounded-xl object-cover"
      />

      <div className="text-gray-700">
        <p>{event.event_description}</p>
        {event.event_additional_description && (
          <p className="mt-2">{event.event_additional_description}</p>
        )}

        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold">📅 행사 일정</p>
          <p>
            {event.event_start_date
              ? new Date(event.event_start_date).toLocaleDateString()
              : 'N/A'}{' '}
            ~{' '}
            {event.event_end_date
              ? new Date(event.event_end_date).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>

        {event.event_location && (
          <p className="mt-4">
            <strong>장소:</strong> {event.event_location}
          </p>
        )}
        {event.event_organizer && (
          <p>
            <strong>주최자:</strong> {event.event_organizer}
          </p>
        )}
      </div>

      <Button onClick={handleCreateRoom} className="w-full">
        방 생성
      </Button>
    </div>
  );
}