'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import EventCard from './EventCard';
import { useRouter } from 'next/navigation';

const LIMIT = 10; // Only define once

export default function EventsFeed() {
  const router = useRouter();
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Track horizontal swipe offset & swiping state for animation and color
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);

  // Store touch start coordinates
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Ref for container div to add manual event listeners
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchEvents = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_start_date', { ascending: false })
      .range(page * LIMIT, page * LIMIT + LIMIT - 1);

    if (!error && data) {
      if (data.length < LIMIT) setHasMore(false);
      if (data.length > 0) {
        setEvents((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    }
    setLoading(false);
  }, [page, loading, hasMore, supabase]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Touch event handlers with React event types
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Only consider horizontal swipes and prevent vertical scroll if user swiping horizontally
    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault();
      setSwipeOffset(diffX);
    }
  };

  const handleTouchEnd = (_e: TouchEvent) => {
    setSwiping(false);
    const threshold = 100;

    if (swipeOffset > threshold) {
      // Swipe right (usually previous item)
      if (currentIndex > 0) setCurrentIndex((idx) => idx - 1);
    } else if (swipeOffset < -threshold) {
      // Swipe left (usually next item)
      if (currentIndex < events.length - 1) {
        setCurrentIndex((idx) => idx + 1);
      } else if (hasMore && !loading) {
        fetchEvents();
      }
    }

    setSwipeOffset(0);
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Attach native event listeners with passive:false for touchmove
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false }); // fix: passive false here
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Auto-fetch next page if at the end
  useEffect(() => {
    if (currentIndex >= events.length - 1 && hasMore && !loading) {
      fetchEvents();
    }
  }, [currentIndex, events.length, hasMore, loading, fetchEvents]);

  // Calculate tilt and background color based on swipeOffset
  const maxTilt = 15;
  const tilt = Math.max(Math.min(swipeOffset / 10, maxTilt), -maxTilt);

  // Smooth color interpolation (RGB arrays, fixed alpha 0.3)
  const maxSwipe = 150; // max swipe distance to reach full color effect
  const swipeRatioRight = Math.min(Math.max(swipeOffset, 0), maxSwipe) / maxSwipe;
  const swipeRatioLeft = Math.min(Math.max(-swipeOffset, 0), maxSwipe) / maxSwipe;

  const whiteRgb = [255, 255, 255];
  const greenRgb = [72, 187, 120];
  const redRgb = [239, 68, 68];

  function interpolateRgb(c1: number[], c2: number[], t: number) {
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
    return `rgba(${r},${g},${b},0.3)`;
  }

  let bgColor = 'white';
  if (swipeOffset > 0) {
    bgColor = interpolateRgb(whiteRgb, greenRgb, swipeRatioRight);
  } else if (swipeOffset < 0) {
    bgColor = interpolateRgb(whiteRgb, redRgb, swipeRatioLeft);
  }

  return (
    <>
      {/* Search + Menu (Make the div clickable) */}
      <div
        className="flex justify-between items-start mb-4 cursor-pointer"
        onClick={() => router.push('/protected/events/search')}
      >
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full border rounded-full py-2 px-4 pl-10"
              readOnly // Prevents typing, since the div is the clickable area
            />
            <span className="absolute left-3 top-2.5 text-yellow-500">🔍</span>
          </div>
        </div>
      </div>

      {/* CARD VIEW: Only 1 event with swipe support */}
      <div
        ref={containerRef}
        className="h-[50vh] flex items-center justify-center transition-all"
        style={{
          transform: `rotate(${tilt}deg) translateX(${swipeOffset}px)`,
          backgroundColor: bgColor,
          borderRadius: '10px',
          transition: swiping ? 'none' : 'transform 0.3s ease, background-color 0.3s ease',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          touchAction: 'none', // Keep it to disable native scrolling gestures
        }}
      >
        {events.length > 0 && currentIndex < events.length ? (
          <EventCard key={events[currentIndex].id} event={events[currentIndex]} />
        ) : (
          <div className="text-gray-400 my-24">No events</div>
        )}
      </div>

      <div className="text-center py-6 text-gray-400">
        {loading ? 'Loading more...' : 'Swipe right/left for previous/next'}
      </div>
    </>
  );
}