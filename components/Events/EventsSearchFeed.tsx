'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import EventCard from './EventCard';

const LIMIT = 10;

export default function EventsFeed2() {
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    setPage(0);
    setHasMore(true);

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .ilike('event_name', `%${searchQuery}%`)
      .order('event_start_date', { ascending: false })
      .limit(LIMIT);

    if (!error) {
      setEvents(data || []);
      if (data.length < LIMIT) setHasMore(false);
    }

    setLoading(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      {/* Sticky Search Bar */}
      <div className="">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full border rounded-full py-2 px-4 pl-10"
            />
            <span className="absolute left-3 top-2.5 text-yellow-500">🔍</span>
          </div>
          <button
            onClick={handleSearch}
            className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600"
          >
            Search
          </button>
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {searched ? (
          events.length > 0 ? (
            events.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="text-gray-400 my-24 text-center">No events found</div>
          )
        ) : (
          <div className="text-gray-400 my-24 text-center">Search to display events</div>
        )}
      </div>

      <div className="text-center py-6 text-gray-400">
        {loading && 'Loading...'}
      </div>
    </>
  );
}