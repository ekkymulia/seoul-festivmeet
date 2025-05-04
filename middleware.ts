// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createIntlMiddleware from 'next-intl/middleware';

const handleI18nRouting = createIntlMiddleware({
  locales: ['en', 'kor'],
  defaultLocale: 'en',
  localeDetection: false 
});

export async function middleware(request: NextRequest) {
  // Pass through updateSession first
  const authResponse = await updateSession(request);
  // If updateSession returns a response (e.g., redirect/unauth), send it
  if (authResponse) {
    return authResponse;
  }
  // Otherwise, continue with i18n middleware
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};