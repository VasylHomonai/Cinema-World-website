import { loadTranslations } from './localization/i18n.js';


export async function initApp() {
  await loadTranslations();     // завантаження перекладів
}


/* Ф-ція ставить слухачі на інпути в попап Чекаута.
Тобто лейби відображаються при кліку на інпут і якщо не у фокусі то не відображаються + логіка з текстом в полях*/
export function setupFloatingLabels() {
    document.querySelectorAll(".form-group input").forEach(input => {
      input.addEventListener("focus", () => toggleLabel(input));
      input.addEventListener("input", () => toggleLabel(input));
      input.addEventListener("blur", () => toggleLabel(input));
    });
}


/* Реалізація лейб для імпутних полів імені та телефону у попапі "Покупка фільму"
Функція оновлює клас "not-empty" в залежності від вмісту  */
function toggleLabel(input) {
  if (input.value.trim() !== "") {
    input.classList.add("not-empty");
  } else {
    input.classList.remove("not-empty");
  }
}
