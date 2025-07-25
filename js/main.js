import { updateCartState } from './cart.js';

// Відкриваємо попап покупки при кліку на будь-яку кнопку "Купити зараз". Початок.
document.querySelectorAll('.buyNow').forEach(btn => {
  btn.addEventListener('click', (event) => {
    // Знаходимо батьківський .image-item (блок з фільмом)
    const imageItem = event.target.closest('.image-item');
    if (!imageItem) return;
    // Знаходимо назву фільму в цьому блоці
    selectedMovieTitle = imageItem.querySelector('.title').textContent;
    // Вставляємо назву в попап
    document.getElementById('movieTitle').textContent = selectedMovieTitle;

    // Очищення поля name (на пробіли) при кожному відкритті модалки
    if (nameInput.value.trim() === "") {
      nameInput.value = "";
      nameInput.classList.remove("not-empty");
      nameError.textContent = "";
    }

    if (phoneInput.value.trim() === "") {
      phoneInput.classList.remove("not-empty");
      phoneError.textContent = "";
    }

    // Відкрити модалку
    document.getElementById('buyModal').style.display = 'flex';
  });
});

// Закриваємо попап покупки
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('buyModal').style.display = 'none';
});

// Закриття по кліку поза вікном для обох попапів
window.addEventListener('click', (e) => {
  if (e.target.id === 'buyModal') {
    document.getElementById('buyModal').style.display = 'none';
  } else if (e.target.id === 'thankYouModal') {
    document.getElementById('thankYouModal').style.display = 'none';
  }
});

// Зміна кольору кнопки "💸 Купити зараз" на зелений при кожному 2-му кліку
document.querySelectorAll('.buyNow').forEach(button => {
    const id = button.dataset.id;

    // При завантаженні сторінки — перевіряємо збережений стан
    if (localStorage.getItem(id) === 'clicked') {
      button.classList.add('clicked');
    }

    // Обробка кліку
    button.addEventListener('click', () => {
        if (button.classList.contains('clicked')) {
          button.classList.remove('clicked');
          localStorage.removeItem(id);
        } else {
          button.classList.add('clicked');
          localStorage.setItem(id, 'clicked');
        }

        updateCartState(); // оновлюємо відображення кошика
  });
});
// Клік кнопки "Купити зараз". Кінець


// Реалізація лейб для імпутних полів імені та телефону у попапі "Покупка фільму"
// Функція оновлює клас "not-empty" в залежності від вмісту
function toggleLabel(input) {
  if (input.value.trim() !== "") {
    input.classList.add("not-empty");
  } else {
    input.classList.remove("not-empty");
  }
}

// Реалізація лейб для імпутних полів імені та телефону у попапі "Покупка фільму"
// Підключення до кожного input
document.querySelectorAll(".form-group input").forEach(input => {
  input.addEventListener("focus", () => toggleLabel(input));
  input.addEventListener("input", () => toggleLabel(input));
  input.addEventListener("blur", () => toggleLabel(input));
});

// При підтвердженні "Підтвердити покупку" — ховаємо форму і показуємо повідомлення подяки
// Реалізація очистки імпутних полів імені та телефону у попапі "Покупка фільму" при кліку на "Підтвердити покупку". Start

// Спочатку підготовка для запису в консоль та обробка пустих полів (на помилки)
// Отримуємо форму
const form = document.getElementById("purchaseForm");
// Отримуємо поля вводу
const nameInput = document.getElementById("userName");
const phoneInput = document.getElementById("userPhone");
const PREFIX = "+380";
// Помилки для імпутних полів
const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");
// перевірка відповідності регулярному виразу для заповнення поля імені
const namePattern = /^[A-Za-zА-Яа-яІіЇїЄєҐґ'\- ]{1,20}$/;
// Змінна для назви фільму який купляється
let selectedMovieTitle = "";

// Функція перевірки валідності номера
function isValidPhone(phone) {
  return /^\+380\d{9}$/.test(phone);
}

// Кастомна валідація поля імені в модалці покупки
function validateName(value) {
  return namePattern.test(value);
}

// Ф-ція для очистки полів модалки
function resetPurchaseForm() {
  nameInput.value = "";
  phoneInput.value = "";
  nameInput.classList.remove("not-empty");
  phoneInput.classList.remove("not-empty");
  nameError.textContent = "";
  phoneError.textContent = "";
}

// Кастомна валідація полів
function validateField(input, errorElement, validator = null, errorMessage = "") {
  const value = input.value.trim();
  if (value === "") {
    errorElement.textContent = translations[currentLang].required;
    return false;
  }

  if (validator && !validator(value)) {
    errorElement.textContent = errorMessage;
    return false;
  }

  errorElement.textContent = "";
  return true;
}

// Вішаємо слухачі на input поля
nameInput.addEventListener("input", () => {
//  validateField(nameInput, nameError, validateName, "Ім’я має містити лише літери.");
  validateField(nameInput, nameError, validateName, translations[currentLang].nameInvalid);
});

phoneInput.addEventListener("focus", () => {
  if (!phoneInput.value.startsWith(PREFIX)) {
    phoneInput.value = PREFIX;
  }

  // Ставимо курсор в кінець
  setTimeout(() => {
    phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
  });
});

// Захист від видалення префікса
phoneInput.addEventListener("keydown", (e) => {
  const pos = phoneInput.selectionStart;

  // Якщо користувач натискає Backspace або Delete перед префіксом
  if ((e.key === "Backspace" && pos <= PREFIX.length) ||
      (e.key === "Delete" && pos < PREFIX.length)) {
    e.preventDefault();
  }
});

phoneInput.addEventListener("input", () => {
  let value = phoneInput.value;

  // Гарантуємо, що значення завжди починається з +380
  if (!value.startsWith(PREFIX)) {
    value = PREFIX + value.replace(/\D/g, "");
  }

  // Видаляємо все, крім цифр після +380
  const digits = value.slice(PREFIX.length).replace(/\D/g, "").slice(0, 9);

  phoneInput.value = PREFIX + digits;
  validateField(phoneInput, phoneError, isValidPhone, translations[currentLang].phoneInvalid);
});

// Обробка сабміту форми
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Щоб не перезавантажувалась сторінка

  const isNameValid = validateField(nameInput, nameError, validateName, translations[currentLang].nameInvalid);
  const isPhoneValid = validateField(phoneInput, phoneError, isValidPhone, translations[currentLang].phoneInvalid);

  // Якщо хоча б одне поле невалідне — зупинити
  if (!isNameValid || !isPhoneValid) return;

  // Логування в консоль
  console.log("Ім’я користувача:", nameInput.value.trim());
  console.log("Телефон:", phoneInput.value.trim());
  console.log("Фільм:", selectedMovieTitle.trim());

  // Очищаємо всі покупки (стан кнопок і localStorage)
  document.querySelectorAll(".buyNow").forEach(button => {
    const id = button.dataset.id;

    // Якщо кнопка була у стані "clicked", очищаємо
    if (localStorage.getItem(id) === 'clicked') {
      button.classList.remove("clicked");
      localStorage.removeItem(id);
    }
  });

  // Оновити корзину
  updateCartState();

  // Очистка полів
  resetPurchaseForm();

  // Закриваємо модалку покупки
  document.getElementById("buyModal").style.display = "none";

  // Показуємо подяку
  document.getElementById("thankYouModal").style.display = "flex";
});
// Реалізація очистки імпутних полів імені та телефону у попапі "Покупка фільму" при кліку на "Підтвердити покупку". End


// Закриваємо модалку подяки
document.getElementById("closeThankYou").addEventListener('click', () => {
  document.getElementById('thankYouModal').style.display = 'none';              // Закриоває модальне вікно подяки, змінюючи стиль display на none.
});

// Для перекладу валідацій на різні мови. Початок
const translations = {
  ua: {
    required: "Дане поле обов'язкове для заповнення.",
    nameInvalid: "Ім’я має містити лише літери.",
    phoneInvalid: "Номер має бути у форматі +380XXXXXXXXX",
  },
  en: {
    required: "This field is required.",
    nameInvalid: "Name must contain only letters.",
    phoneInvalid: "Format: +380XXXXXXXXX",
  }
};

let currentLang = document.getElementById("switchLang").value;

document.getElementById("switchLang").addEventListener("change", (e) => {
  currentLang = e.target.value;
});
// Для перекладу валідацій на різні мови. Кінець.
