import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';

  const response = NextResponse.json({ message: 'Language set' });
  response.cookies.set('lang', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return response;
}