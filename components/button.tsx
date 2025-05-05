'use client';

import {useEffect, useState} from 'react';

export default function LangButton() {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // On mount, set locale from cookie
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1];
    if (cookieLocale) setLocale(cookieLocale);
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'kor' : 'en';
    // Set cookie for next-intl to read next time
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/`;
    setLocale(newLocale);
    // Reload to re-render with new locale, since next-intl is SSR
    window.location.reload();
  };

  return (
    <button onClick={toggleLocale}>
      {locale === 'en' ? '한국어로 변경' : 'Switch to English'}
    </button>
  );
}