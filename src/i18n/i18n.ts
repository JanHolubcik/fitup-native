/* eslint-disable import/no-named-as-default-member */
import { getLocales } from "expo-localization";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import commonEn from "./locales/en/common.json";
import dashboardEn from "./locales/en/dashboard.json";
import homeEn from "./locales/en/home.json";
import loginEn from "./locales/en/login.json";
import navbarEn from "./locales/en/navbar.json";
import onboardingEn from "./locales/en/onboarding.json";
import profileEn from "./locales/en/profile.json";
import signupEn from "./locales/en/signup.json";

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

const locales = getLocales();
const languageCode = locales && locales.length > 0 ? locales[0].languageCode : "en";
const initialLng = languageCode === "sk" ? "sk" : "en";

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    resources: {
      en: enTranslations,
      sk: skTranslations,
    },
    nsSeparator: ".",
    keySeparator: ".",
    ns: ["common", "dashboard", "home", "login", "navbar", "onboarding", "profile", "signup"],
    defaultNS: "common",
    lng: initialLng,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, 
    },
    react: {
      useSuspense: false, 
    },
  });

export default i18next;
