'use client';
import Link from "next/link";
import { Button } from "./ui/button";
import { startTransition, useTransition } from "react";


export default function LangButton() {
  const [isPending, startTransition] = useTransition();

  const switchLanguage = async (lang: string) => {
    await fetch(`/api/set-language?lang=${lang}`, { method: 'POST' });
    startTransition(() => {
      window.location.reload(); // Reload to apply the new language
    });
  };

  return (
    <>
        <button
            onClick={() => switchLanguage('kor')}
            disabled={isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
            Switch to Korean
        </button>
    </>
  )
}