import { useTranslation as useReactI18nextTranslation } from "react-i18next";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  sk: "Slovensky",
};

export function useTranslation(ns?: string | string[]) {
  const { t, i18n } = useReactI18nextTranslation(ns);

  const supportedLanguages = Object.keys(i18n.options.resources || {}).map((code) => ({
    code,
    name: LANGUAGE_NAMES[code] || code.toUpperCase(),
  }));

  return {
    t: (key: string, options?: Record<string, unknown>): string => t(key, options) as string,
    locale: i18n.language,
    changeLanguage: (newLocale: string) => {
      i18n.changeLanguage(newLocale);
    },
    supportedLanguages,
  };
}
