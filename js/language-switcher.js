// Для переключалки сайту на іншу мову
const langSwitcher = document.getElementById("switchLang");

// Перевірка мови браузера при першому заході (в локальному сховищі немає параметра langDetected)
// Якщо параметр langDetected є, то не залежно від значення його, з якою мовою(url) заходиться на сайт, та мова і буде відображатись.
(function detectLangOnFirstVisit() {
  const isLangDetected = localStorage.getItem('langDetected');
  const userLang = navigator.language || navigator.userLanguage;

  if (!isLangDetected) {
    let targetUrl;

    if (userLang.startsWith('uk') || userLang.startsWith('ru')) {
      // Визначена українська або російська — ведемо на uk-версію
      targetUrl = 'index.html';
      localStorage.setItem('langDetected', 'ua');
    } else {
      // Всі інші — англійська версія
      targetUrl = 'index-en.html';
      localStorage.setItem('langDetected', 'en');
    }

    // Якщо поточна сторінка не відповідає targetUrl — перенаправляємо
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