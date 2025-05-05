'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EventCard({ event }: { event: any }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/protected/events/${event.id}`);
  };

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-sm bg-white cursor-pointer"
      onClick={handleClick}
    >
      {event.event_thumbnail ? (
        <Image
          src={event.event_thumbnail}
          alt={event.event_title || "Event thumbnail"}
          className="w-full h-80 object-cover rounded mb-4"
          width={320}
          height={200}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{event.event_name}</h2>
        <p className="text-sm text-gray-600">{event.event_description}</p>
      </div>
    </div>
  );
}