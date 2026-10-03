import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;
  // Default to Turkish if user requested TR or German
  const locale = rawLocale && ['de', 'tr'].includes(rawLocale) ? rawLocale : 'tr';
  
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
