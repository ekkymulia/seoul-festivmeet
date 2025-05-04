import Image from "next/image";

export default function EventCard({ event }: { event: any }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      {event.event_thumbnail ? (
        <Image
          src={event.event_thumbnail}
          alt={event.event_title || 'Event thumbnail'}
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
        {/* <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            <button className="p-2 rounded-full border hover:bg-gray-100">👍</button>
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          </div>
          <div className="flex gap-2 text-xs">
            <button className="border px-2 py-1 rounded">Recruit a team</button>
            <button className="border px-2 py-1 rounded">Reservation</button>
          </div>
        </div> */}
      </div>
    </div>
  );
}