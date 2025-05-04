"use client";

import BackHeader from "../components/BackHeader";
import Image from "next/image";
import { useRouter } from "next/navigation";

const relatedEvents = [
  {
    id: 1,
    title: "Jazz Concert",
    image: "/images/jazz.jpg", // public 폴더 내 이미지
  },
  {
    id: 2,
    title: "Art Festival",
    image: "/images/art.jpg",
  },
  // 추가 가능
];

export default function ReservationPage() {
  const router = useRouter();

  const handleEventClick = (id: number) => {
    router.push(`/protected/reservation?id=${id}`); // 예약 페이지로 이동 (query 전달)
  };

  return (
    <div className="flex flex-col w-full">
      <BackHeader title="Reservation" />

      {/* 행사 이미지 */}
      <div className="w-full h-64 relative">
        <Image src="/images/main-event.jpg" alt="Main Event" fill objectFit="cover" />
      </div>

      {/* 행사 정보 */}
      <div className="p-4 space-y-2 text-sm">
        <p><strong>Places:</strong> 서울예술의전당</p>
        <p><strong>Description:</strong> 재즈 공연입니다.</p>
        <p><strong>Period:</strong> 2025-06-01 ~ 2025-06-03</p>
        <p><strong>Contact:</strong> 010-1234-5678</p>
        <p><strong>Website:</strong> www.jazzconcert.com</p>
      </div>

      {/* 지도 */}
      <div className="p-4">
        <h2 className="font-semibold mb-2">Map & Location</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.970250922429!2d126.97796921558787!3d37.566535979799934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca2edcc4f12c9%3A0x51d4b1d82a3c6856!2z7ISc7Jq47Yq567OE7IucIO2VnOq0gA!5e0!3m2!1sko!2skr!4v1629639261719!5m2!1sko!2skr"
          width="100%"
          height="200"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>

      {/* 연관된 행사 */}
      <div className="p-4">
        <h2 className="font-semibold mb-4">Related Events</h2>
        <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-80">
          {relatedEvents.map((event) => (
            <div
              key={event.id}
              className="relative w-full h-40 cursor-pointer hover:opacity-80"
              onClick={() => handleEventClick(event.id)}
            >
              <Image
                src={event.image}
                alt={event.title}
                fill
                objectFit="cover"
                className="rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
