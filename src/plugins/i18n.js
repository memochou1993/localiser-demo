import { createI18n } from 'vue-i18n/index';
import api from "../api";

// define support locales
const LOCALES = Object.freeze({
  en: 'en',
  zh: 'zh_TW',
  zh_TW: 'zh_TW',
  'zh-TW': 'zh_TW',
});

// detect preferred locale
const language = localStorage.getItem('locale') || window.navigator.language;

// determine default locale
export const DEFAULT_LOCALE = language in LOCALES ? LOCALES[language] : LOCALES.en;

// create an I18n instance
const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
});

// set locale for app
export const setLanguage = (locale) => {
  i18n.global.locale.value = locale;
  document.documentElement.lang = locale;
  localStorage.setItem('locale', locale);
};

// load locale files
export const loadMessage = async (locale) => {
  try {
    // fetch from remote
    const messages = await api.fetchMessages({ locale });
    i18n.global.setLocaleMessage(locale, messages);
    return messages;
  } catch {
    // or import from local if server is down
    const message = await import(/* webpackChunkName: "locale-[request]" */ `@/assets/lang/${locale}.json`);
    i18n.global.setLocaleMessage(locale, message);
  }
};

export default i18n;
