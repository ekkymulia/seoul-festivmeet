// app/protected/events/test/page.tsx

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function TestEventPage() {
  const router = useRouter();

  const handleCreateRoom = () => {
    router.push('/protected/chatting/create_room'); // eventId 쿼리 포함
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">테스트 행사</h1>

      <Image
        src="/images/event-test.png"
        alt="테스트 행사 대표 이미지"
        width={400}
        height={400}
        className="rounded-xl object-cover"
      />

      <div className="text-gray-700">
        <p>이 행사는 문화, 예술, 관광 정보를 공유하기 위한 자리입니다.</p>
        <p>참가자들은 채팅을 통해 서로 의견을 나누고, 일정을 조율할 수 있습니다.</p>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold">📅 행사 일정</p>
          <p>2025년 5월 12일 (월) ~ 5월 23일 (금)</p>
          <p className="text-sm text-gray-600">※ 매주 수요일은 휴무입니다.</p>
        </div>
      </div>

      <Button onClick={handleCreateRoom} className="w-full">
        방 생성
      </Button>
    </div>
  );
}
