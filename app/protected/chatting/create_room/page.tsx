'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar } from '@/components/ui/calendar'; // shadcn-ui Calendar 컴포넌트
import { cn } from '@/lib/utils';

export default function CreateRoomPage() {
  const router = useRouter();

  const event = {
    id: 'test',
    title: '테스트 행사',
    imageUrl: '/images/event-test.png',
    startDate: new Date(2025, 4, 12),
    endDate: new Date(2025, 4, 23),
    holidays: [new Date(2025, 4, 14), new Date(2025, 4, 21)], // 수요일 휴무
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [personCount, setPersonCount] = useState<number | ''>('');
  const [roomTitle, setRoomTitle] = useState('');
  const [ageLimit, setAgeLimit] = useState<{ min: number | ''; max: number | ''; noLimit: boolean }>({
    min: '',
    max: '',
    noLimit: false,
  });
  const [gender, setGender] = useState<{ male: boolean; female: boolean }>({ male: false, female: false });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!selectedDate) newErrors.date = true;
    if (!roomTitle) newErrors.title = true;
    if (!personCount || personCount < 2) newErrors.person = true;
    if (!ageLimit.noLimit) {
      if (ageLimit.min === '' || ageLimit.max === '' || ageLimit.min > ageLimit.max) newErrors.age = true;
    }
    if (!gender.male && !gender.female) newErrors.gender = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isDateDisabled = (date: Date) => {
    return (
      date < event.startDate ||
      date > event.endDate ||
      event.holidays.some(
        (holiday) => holiday.toDateString() === date.toDateString()
      )
    );
  };

  const handleCreate = () => {
    if (!validate() || !event) return;

    // 방 생성 데이터
    const roomData = {
      eventId: event.id,
      date: selectedDate,
      personCount,
      title: roomTitle,
      ageLimit: ageLimit.noLimit ? { noLimit: true } : { min: ageLimit.min, max: ageLimit.max },
      gender: {
        male: gender.male,
        female: gender.female
      }
    };

    console.log('방 생성:', roomData);

    // 실제 구현에서는 API 호출로 방 생성 후 해당 방으로 리다이렉트
    // 예시: createRoom(roomData).then(room => router.push(`/protected/chatting/${room.id}`));

    // 임시로 이벤트 페이지로 리다이렉트
    router.push(`/protected/events/${event.id}`);
  };

  // 이벤트가 로딩 중이거나 없는 경우 로딩 UI 표시
  if (!event) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl mb-4">이벤트 정보를 불러오는 중...</h2>
          <div className="animate-pulse h-8 w-32 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <button onClick={() => router.push(`/protected/events/${event.id}`)} className="text-xl">←</button>

      <Image src={event.imageUrl} alt={event.title} width={600} height={300} className="rounded-xl" />
      <h2 className="text-2xl font-bold">{event.title}</h2>

      {/* 행사 일정 - 달력 드롭다운 */}
      <div>
        <label className="block mb-1">행사 일정</label>
        <div className="relative">
          <input
            readOnly
            onClick={() => setCalendarOpen(!isCalendarOpen)}
            value={selectedDate ? selectedDate.toLocaleDateString() : ''}
            placeholder="날짜 선택"
            className={cn("border p-2 rounded w-full cursor-pointer", errors.date && 'border-red-500')}
          />
          {isCalendarOpen && (
            <div className="absolute z-10 bg-white border rounded mt-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setCalendarOpen(false);
                }}
                disabled={isDateDisabled}
              />
            </div>
          )}
        </div>
      </div>

      {/* 모집 인원 */}
      <div>
        <label className="block mb-1">모집 인원</label>
        <input
          type="number"
          min={2}
          value={personCount}
          onChange={(e) => setPersonCount(Number(e.target.value))}
          className={cn("border p-2 rounded w-full", errors.person && 'border-red-500')}
        />
      </div>

      {/* 채팅방 이름 */}
      <div>
        <label className="block mb-1">채팅방 이름</label>
        <input
          type="text"
          value={roomTitle}
          onChange={(e) => setRoomTitle(e.target.value)}
          className={cn("border p-2 rounded w-full", errors.title && 'border-red-500')}
        />
      </div>

      {/* 모집 연령 */}
      <div>
        <label className="block mb-1">모집 연령</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            disabled={ageLimit.noLimit}
            value={ageLimit.min}
            onChange={(e) => setAgeLimit({ ...ageLimit, min: Number(e.target.value) })}
            className={cn("border p-2 rounded w-20", errors.age && 'border-red-500')}
          />
          ~
          <input
            type="number"
            disabled={ageLimit.noLimit}
            value={ageLimit.max}
            onChange={(e) => setAgeLimit({ ...ageLimit, max: Number(e.target.value) })}
            className={cn("border p-2 rounded w-20", errors.age && 'border-red-500')}
          />
          <button onClick={() => setAgeLimit({ ...ageLimit, noLimit: !ageLimit.noLimit })} className="ml-2 text-sm">X</button>
        </div>
      </div>

      {/* 모집 성별 */}
      <div>
        <label className="block mb-1">모집 성별</label>
        <div className="flex gap-4">
          <button
            className={cn("px-4 py-2 border rounded", gender.male && 'bg-blue-200', errors.gender && 'border-red-500')}
            onClick={() => setGender({ ...gender, male: !gender.male })}
          >남자</button>
          <button
            className={cn("px-4 py-2 border rounded", gender.female && 'bg-pink-200', errors.gender && 'border-red-500')}
            onClick={() => setGender({ ...gender, female: !gender.female })}
          >여자</button>
        </div>
      </div>

      {/* 생성 버튼 */}
      <button
        onClick={handleCreate}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        생성
      </button>
    </div>
  );
}
