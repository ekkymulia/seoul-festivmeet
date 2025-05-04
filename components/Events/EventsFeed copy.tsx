'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import EventCard from './EventCard';

const LIMIT = 10; // Only define once

export default function EventsFeed2() {
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrolling = useRef(false);
  const touchStartY = useRef<number | null>(null);

  const fetchEvents = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_start_date', { ascending: false })
      .range(page * LIMIT, page * LIMIT + LIMIT - 1);
    if (!error) {
      if (data.length < LIMIT) setHasMore(false);
      if (data.length > 0) {
        setEvents((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    }
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  // SCROLL/WHEEL logic for changing the card
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrolling.current) return;
      scrolling.current = true;
      setTimeout(() => (scrolling.current = false), 400);

      if (e.deltaY > 0) {
        // Next card
        if (currentIndex < events.length - 1) setCurrentIndex((idx) => idx + 1);
        else if (hasMore && !loading) fetchEvents();
      } else if (e.deltaY < 0) {
        // Previous card
        if (currentIndex > 0) setCurrentIndex((idx) => idx - 1);
      }
    };

    // Basic touch swipe up/down
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 40 && !scrolling.current) {
        scrolling.current = true;
        setTimeout(() => (scrolling.current = false), 400);

        if (diff > 0) {
          // Swipe up: next
          if (currentIndex < events.length - 1) setCurrentIndex((idx) => idx + 1);
          else if (hasMore && !loading) fetchEvents();
        } else {
          // Swipe down: prev
          if (currentIndex > 0) setCurrentIndex((idx) => idx - 1);
        }
      }
      touchStartY.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, events.length, hasMore, loading, fetchEvents]);

  // Auto-fetch next page if at the end
  useEffect(() => {
    if (currentIndex >= events.length - 1 && hasMore && !loading) {
      fetchEvents();
    }
  }, [currentIndex, events.length, hasMore, loading, fetchEvents]);

  return (
    <>
      {/* Search + Menu (Keep as-is) */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full border rounded-full py-2 px-4 pl-10"
            />
            <span className="absolute left-3 top-2.5 text-yellow-500">🔍</span>
          </div>
        </div>
      </div>

      {/* CARD VIEW: Only 1 event */}
      <div className="h-[50vh] flex items-center justify-center transition-all">
        {events.length > 0 && currentIndex < events.length ? (
          <EventCard key={events[currentIndex].id} event={events[currentIndex]} />
        ) : (
          <div className="text-gray-400 my-24">No events</div>
        )}
      </div>

      <div className="text-center py-6 text-gray-400">
        {loading ? 'Loading more...' : 'Scroll/swipe for next'}
      </div>
    </>
  );
}