import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

// Import English translations
import commonEn from "./locales/en/common.json";
import dashboardEn from "./locales/en/dashboard.json";
import homeEn from "./locales/en/home.json";
import loginEn from "./locales/en/login.json";
import navbarEn from "./locales/en/navbar.json";
import onboardingEn from "./locales/en/onboarding.json";
import profileEn from "./locales/en/profile.json";
import signupEn from "./locales/en/signup.json";

// Import Slovak translations
import commonSk from "./locales/sk/common.json";
import dashboardSk from "./locales/sk/dashboard.json";
import homeSk from "./locales/sk/home.json";
import loginSk from "./locales/sk/login.json";
import navbarSk from "./locales/sk/navbar.json";
import onboardingSk from "./locales/sk/onboarding.json";
import profileSk from "./locales/sk/profile.json";
import signupSk from "./locales/sk/signup.json";

const enTranslations = {
  common: commonEn,
  dashboard: dashboardEn,
  home: homeEn,
  login: loginEn,
  navbar: navbarEn,
  onboarding: onboardingEn,
  profile: profileEn,
  signup: signupEn,
};

const skTranslations = {
  common: commonSk,
  dashboard: dashboardSk,
  home: homeSk,
  login: loginSk,
  navbar: navbarSk,
  onboarding: onboardingSk,
  profile: profileSk,
  signup: signupSk,
};

const i18n = new I18n({
  en: enTranslations,
  sk: skTranslations,
});

// Detect device language
const locales = getLocales();
const languageCode = locales && locales.length > 0 ? locales[0].languageCode : "en";

// Set initial locale (default to 'en' if not 'sk')
i18n.locale = languageCode === "sk" ? "sk" : "en";
i18n.enableFallback = true;

// Reactive listener system for locale changes
const listeners = new Set<(locale: string) => void>();

export const changeLanguage = (newLocale: string) => {
  i18n.locale = newLocale;
  listeners.forEach((listener) => listener(newLocale));
};

export const subscribeToLocaleChange = (listener: (locale: string) => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export default i18n;
