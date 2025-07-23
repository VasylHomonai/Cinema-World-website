// Для переключалки сайту на іншу мову
const langSwitcher = document.getElementById("switchLang");

/* Перевірка мови браузера при першому заході (в локальному сховищі немає параметра langDetected)
Якщо параметр langDetected немає, то підгружається мова сайту відносно умови: 'uk' || 'ru' => 'uk' версія сайту
Всі інші мови => 'en' версія сайту
Якщо параметр langDetected є, то залежно від значення його, підгрузиться відповідна версія сайту. */
(function detectLangOnFirstVisit() {
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
})();

// Обробка зміни мови вручну
langSwitcher.addEventListener("change", () => {
  const selectedLang = langSwitcher.value;

  if (selectedLang === "ua") {
    window.location.href = "index.html";
    localStorage.setItem('langDetected', 'ua');
  } else if (selectedLang === "en") {
    window.location.href = "index-en.html";
    localStorage.setItem('langDetected', 'en');
  }
});