// protected/components/BackHeader.tsx
"use client";

import { useRouter } from "next/navigation";

interface BackHeaderProps {
  title?: string;
}

export default function BackHeader({ title }: BackHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center p-4 border-b">
      <button
        onClick={() => router.back()}
        className="mr-4 text-xl font-bold"
      >
        ←
      </button>
      <h1 className="text-lg font-semibold">{title || "Back"}</h1>
    </div>
  );
}
