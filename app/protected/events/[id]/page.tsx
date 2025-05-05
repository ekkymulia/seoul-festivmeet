import React from 'react';
import { createClient } from '@/utils/supabase/client';
import EventDetailClient from '@/components/Events/EventDetail';

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

type Props = {
  params: { id: string };
};

export default async function EventDetailPage({ params }: Props) {
  const supabase = createClient();

  const { data: event, error } = await supabase
    .from('events')
    .select(
      `id, event_name, event_description, event_additional_description, event_thumbnail, event_start_date, event_end_date, event_location, event_organizer`
    )
    .eq('id', Number(params.id))
    .single();

  if (error) {
    return <p>Failed to load event data: {error.message}</p>;
  }

  if (!event) {
    return <p>Event with ID {params.id} not found.</p>;
  }

  return <EventDetailClient event={event} />;
}