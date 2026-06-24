import { useEffect, useState } from "react";
import i18n, { subscribeToLocaleChange } from "../i18n/i18n";

export function useTranslation() {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    return subscribeToLocaleChange((newLocale) => {
      setLocale(newLocale);
    });
  }, []);

  return {
    t: (key: string, options?: any) => i18n.t(key, options),
    locale,
  };
}
