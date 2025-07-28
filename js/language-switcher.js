import { initApp } from './init-app.js';

// Для переключалки сайту на іншу мову
const langSwitcher = document.getElementById("switchLang");

try {
   await initApp();
} catch (error) {
   console.error("Помилка ініціалізації застосунку:", error);
}

// Функції для роботи з cookies
function setCookie(name, value, maxAgeSeconds = 3153600000) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

export function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/* Перевірка мови браузера при першому заході (в куках немає параметра langDetected)
Якщо параметр langDetected немає, то підгружається мова сайту відносно умови: 'uk' || 'ru' => 'ua' версія сайту
Всі інші мови => 'en' версія сайту
Якщо параметр langDetected є, то залежно від значення його, підгрузиться відповідна версія сайту. */
(function detectLangOnFirstVisit() {
  try {
      const storedLang = getCookie('langDetected');
      const currentLang = window.location.href.includes("-en") ? "en" : "ua";

      // Якщо мова збережена в куках, але поточна не відповідає їй
      if (storedLang && storedLang !== currentLang) {
        const targetUrl = storedLang === "en" ? "index-en.html" : "index.html";
        if (!window.location.href.includes(targetUrl)) {
          window.location.href = targetUrl;
        }
        return;
      }

      // Якщо мова ще не визначена(перший вхід), то визначити за navigator.language
      if (!storedLang) {
        const userLang = navigator.language || navigator.userLanguage;
        const isUkrainian = userLang.startsWith("uk") || userLang.startsWith("ru");
        const browserLang = isUkrainian ? "ua" : "en";
        const targetUrl = browserLang === "en" ? "index-en.html" : "index.html";
        setCookie("langDetected", browserLang);

        if (!window.location.href.includes(targetUrl)) {
          window.location.href = targetUrl;
        }
      }
  } catch (error) {
      console.error("Помилка під час визначення мови:", error);
  }
})();

// Обробка зміни мови вручну
if (langSwitcher) {
  try {
      langSwitcher.addEventListener("change", () => {
          const selectedLang = langSwitcher.value;

          // Зберігаємо мову в localStorage перед переходом
          if (selectedLang === "ua") {
            setCookie('langDetected', 'ua');
            window.location.href = "index.html";
          } else if (selectedLang === "en") {
            setCookie('langDetected', 'en');
            window.location.href = "index-en.html";
          }
      });
  } catch (error) {
    console.error("Помилка при обробці переключення мови:", error);
  }
} else {
  console.warn('Елемент #switchLang не знайдено в DOM');
}
