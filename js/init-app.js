import { loadTranslations } from './localization/i18n.js';

export async function initApp() {
  await loadTranslations();     // завантаження перекладу
}
