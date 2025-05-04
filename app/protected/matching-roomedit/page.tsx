'use client';

import { useRouter } from 'next/navigation';

export default function MatchingRoomPage() {
  const router = useRouter();

  return (
    <div className="w-[360px] h-[640px] mx-auto px-6 py-6 bg-white text-black overflow-y-auto">
      {/* 상단 헤더 */}
      <div className="w-full flex items-center justify-between mb-6">
        {/* 🔙 뒤로가기 버튼 */}
        <button
          onClick={() => router.push('/protected/matching')}
          className="w-10 h-10 border rounded-full flex items-center justify-center"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-center flex-1 -ml-10">Matching (room)</h1>
        <div className="w-10" /> {/* 오른쪽 여백 맞춤 */}
      </div>

      {/* ... 나머지 페이지 콘텐츠 (이벤트 이미지, 팀 리스트 등) */}
    </div>
  );
}
