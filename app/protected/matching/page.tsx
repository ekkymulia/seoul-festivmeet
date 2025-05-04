'use client';

import Link from 'next/link';
import Image from 'next/image';

const events = [
  { id: 1, title: 'Spring Music Festival', current: 190, max: 200 },
  { id: 2, title: 'Food & Culture Fair', current: 190, max: 200 },
  { id: 3, title: 'Night Market', current: 10, max: 200 },
];

export default function MatchingPage() {
  return (
    <div className="w-[360px] h-[640px] mx-auto px-6 py-6 bg-white text-black overflow-y-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Matching</h1>

      {events.map((event) => {
        const isHot = event.current / event.max >= 0.7;

        return (
          <Link key={event.id} href={`/protected/matching-room?event=${event.id}`}>
            <div className="mb-6 cursor-pointer">
              {/* 🖼️ 이미지 박스 */}
              <div className="relative w-full h-36 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition">
                <span className="text-gray-500">Event Image</span>

                {isHot && (
                  <Image
                    src="/images/fire.png"
                    alt="Hot"
                    width={24}
                    height={24}
                    className="absolute top-2 left-2"
                  />
                )}
              </div>

              {/* 📄 텍스트: 이미지에 바짝 붙이기 */}
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-sm font-medium">{event.title}</span>
                <span className="text-xs text-gray-500">
                  {event.current}/{event.max}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
