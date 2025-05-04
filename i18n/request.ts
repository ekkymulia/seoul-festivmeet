import {getRequestConfig as nextIntlGetRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';

export default nextIntlGetRequestConfig(async () => {
  // Await cookies()!
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  console.log(locale)

  // Allow only supported locales
  const supportedLocales = ['en', 'kor'];
  const safeLocale = supportedLocales.includes(locale) ? locale : 'en';

  const messages = (await import(`../messages/${safeLocale}.json`)).default;

  return {
    locale: safeLocale,
    messages
  };
});