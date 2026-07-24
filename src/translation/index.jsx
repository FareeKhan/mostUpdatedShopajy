import i18next from "i18next";
import en from './en.json'
import ar from './ar.json'
import { initReactI18next } from "react-i18next";

const languageResources = {
    en: { translation: en },
    ar: { translation: ar }
}

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en',
    resources: languageResources
})