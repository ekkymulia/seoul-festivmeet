'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const teams = [
  { id: 'team1', current: 2, max: 4 },
  { id: 'team2', current: 1, max: 4 },
  { id: 'team3', current: 4, max: 4 },
];

export default function MatchingRoomPage() {
  const params = useSearchParams();
  const eventId = params.get('event');
  const router = useRouter();

  const handleCreateClick = () => {
    console.log("Create button clicked");
    // 이후 페이지 연결 시 여기에 router.push() 추가
  };

  return (
    <div className="w-[360px] h-[640px] mx-auto px-6 py-6 bg-white overflow-y-auto text-black">
      {/* 🔙 뒤로가기 + 중앙 타이틀 */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/protected/matching')}
          className="w-12 h-12 p-2 rounded-full border flex items-center justify-center hover:bg-gray-100 active:scale-95 transition"
          aria-label="뒤로가기"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-center flex-1 -ml-12">Matching (room)</h1>
        <div className="w-12" />
      </div>

      {/* 상단 이미지 박스 + Create 버튼 */}
      <div className="w-full relative">
        <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
          <span className="text-gray-500">Event Image</span>
        </div>
        {/* 🔘 Create 버튼 - 이미지 하단 우측 */}
        <div className="absolute bottom-0 right-0 mb-1 mr-1">
          <button
            onClick={handleCreateClick}
            className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 active:scale-95 transition"
          >
            Create
          </button>
        </div>
      </div>

      {/* 이벤트 설명 */}
      <p className="text-sm mb-6">Event Information: 트랄라레로 트랄랄라라</p>

      {/* 팀 목록 */}
      <div className="space-y-3">
        {teams.map((team) => (
          <Link key={team.id} href={`/protected/matching-inroom?team=${team.id}`}>
            <div className="border rounded-md p-4 bg-white shadow hover:bg-gray-100 cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{team.id}</span>
                <span className="text-xs text-gray-500">
                  {team.current}/{team.max}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
