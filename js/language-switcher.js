import { initApp } from './init-app.js';

// Для переключалки сайту на іншу мову
const langSwitcher = document.getElementById("switchLang");

try {
   await initApp();
} catch (error) {
   console.error("Помилка ініціалізації застосунку:", error);
}

/* Перевірка мови браузера при першому заході (в локальному сховищі немає параметра langDetected)
Якщо параметр langDetected немає, то підгружається мова сайту відносно умови: 'uk' || 'ru' => 'uk' версія сайту
Всі інші мови => 'en' версія сайту
Якщо параметр langDetected є, то залежно від значення його, підгрузиться відповідна версія сайту. */
(function detectLangOnFirstVisit() {
  try {
      const storedLang = localStorage.getItem('langDetected');
      const currentLang = window.location.href.includes("-en") ? "en" : "uk";

      // Якщо мова збережена в локальному сховищі, але поточна не відповідає їй
      if (storedLang && storedLang !== currentLang) {
        const targetUrl = storedLang === "en" ? "index-en.html" : "index.html";
        if (!window.location.href.includes(targetUrl)) {
          window.location.href = targetUrl;
        }
        return;
      }

      // Якщо мова ще не визначена(перший вхід), то визначити за navigator.language
      if (!storedLang) {
        const browserLang = navigator.language.startsWith("uk") ? "uk" : "en";
        localStorage.setItem("langDetected", browserLang);

        const targetUrl = browserLang === "en" ? "index-en.html" : "index.html";
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
            localStorage.setItem('langDetected', 'ua');
            window.location.href = "index.html";
          } else if (selectedLang === "en") {
            localStorage.setItem('langDetected', 'en');
            window.location.href = "index-en.html";
          }
      });
  } catch (error) {
    console.error("Помилка при обробці переключення мови:", error);
  }
} else {
  console.warn('Елемент #switchLang не знайдено в DOM');
}
