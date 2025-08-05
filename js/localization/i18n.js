import { getCookie } from '../utils/cookie.js';


let translations = {};
let currentLang = getCookie("langDetected") || 'ua';


export async function loadTranslations() {
  try {
      const response = await fetch(`locales/${currentLang}.json`);
      translations = await response.json();
  } catch (error) {
    console.error(`Не вдалося завантажити файл перекладу для мови "${currentLang}"`, error);
  }
}


export function t(key) {
  return translations[key] || key;
}
