'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function InRoomPage() {
  const params = useSearchParams();
  const team = params.get('team');
  const router = useRouter();

  return (
    <div className="w-[360px] h-[640px] mx-auto px-6 py-6 bg-white overflow-y-auto text-black">
      {/* 🔙 뒤로가기 + 중앙 타이틀 */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 p-4 rounded-full border flex items-center justify-center hover:bg-gray-100 active:scale-95 transition"
          aria-label="뒤로가기"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-center flex-1 -ml-12">Matching (in room)</h1>
        <div className="w-5" />
      </div>

      {/* 이미지 박스 */}
      <div className="w-full h-40 border rounded-md flex items-center justify-center bg-gray-100 mb-2">
        <span className="text-gray-500">image</span>
      </div>

      {/* 이벤트 정보 라벨 */}
      <p className="text-sm mb-16">Event Information: 트랄라레로 트랄랄라라</p>

      {/* Join 버튼 */}
      <button className="w-full py-3 border rounded-md text-center text-base hover:bg-gray-100 transition">
        Join {team ? `(${team})` : ''}
      </button>
    </div>
  );
}
