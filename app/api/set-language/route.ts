import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get('lang') || 'en';

  const res = NextResponse.json({ success: true });
  res.cookies.set('NEXT_LOCALE', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });

  return res;
}