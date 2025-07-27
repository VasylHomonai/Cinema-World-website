let translations = {};
let currentLang = localStorage.getItem("langDetected") || 'ua';

export async function loadTranslations() {
  const response = await fetch(`locales/${currentLang}.json`);
  translations = await response.json();
}

export function t(key) {
  return translations[key] || key;
}
