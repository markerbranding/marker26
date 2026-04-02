import {getRequestConfig} from "next-intl/server";
import {defaultLocale, locales} from "../../i18n";
import type {Locale} from "../../i18n";

const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && locales.includes(value as Locale);

export default getRequestConfig(async ({locale, requestLocale}) => {
  const segmentLocale = await requestLocale;
  const resolvedLocale =
    (isLocale(locale) && locale) ||
    (isLocale(segmentLocale) && segmentLocale) ||
    defaultLocale;
  
  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  };
});