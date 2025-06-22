// Відкриваємо попап покупки при кліку на будь-яку кнопку "Купити зараз". Початок.
document.querySelectorAll('.buyNow').forEach(btn => {
  btn.addEventListener('click', (event) => {
    // Знаходимо батьківський .image-item (блок з фільмом)
    const imageItem = event.target.closest('.image-item');
    if (!imageItem) return;
    // Знаходимо назву фільму в цьому блоці
    const movieTitle = imageItem.querySelector('.title').textContent;
    // Вставляємо назву в попап
    document.getElementById('movieTitle').textContent = movieTitle;

    // Очищення поля name (на пробіли) при кожному відкритті модалки
    if (nameInput.value.trim() === "") {
      nameInput.value = "";
      nameInput.classList.remove("not-empty");
      nameError.textContent = "";
    }
    // Очищення поля phone (на пробіли) при кожному відкритті модалки
    if (phoneInput.value.trim() === "") {
      phoneInput.value = "";
      phoneInput.classList.remove("not-empty");
      phoneError.textContent = "";
    }

    // Відкрити модалку
    document.getElementById('buyModal').style.display = 'block';
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
// Помилки для імпутних полів
const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");

// Функція перевірки валідності номера
function isValidPhone(phone) {
  return /^\+380\d{9}$/.test(phone);
}

// Кастомна валідація полів
function validateField(input, errorElement, validator = null, errorMessage = "") {
  const value = input.value.trim();
  if (value === "") {
    errorElement.textContent = "Дане поле обов'язкове для заповнення.";
    return false;
   } else if (validator && !validator(value)) {
    errorElement.textContent = errorMessage;
    return false;
  } else {
    errorElement.textContent = "";
    return true;
  }
}
// Вішаємо слухачі на input
nameInput.addEventListener("input", () => validateField(nameInput, nameError));
phoneInput.addEventListener("input", () => {
    validateField(phoneInput, phoneError, isValidPhone, "Номер має бути у форматі +380XXXXXXXXX");
});

// Обробка сабміту форми
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Щоб не перезавантажувалась сторінка

  const isNameValid = validateField(nameInput, nameError);
  const isPhoneValid = validateField(phoneInput, phoneError, isValidPhone, "Номер має бути у форматі +380XXXXXXXXX");

  // Якщо хоча б одне поле невалідне — зупинити
  if (!isNameValid || !isPhoneValid) return;

  // Логування в консоль
  console.log("Ім’я користувача:", nameInput.value.trim());
  console.log("Телефон:", phoneInput.value.trim());

  // Очистка полів
  nameInput.value = "";
  phoneInput.value = "";
  // Прибрати клас 'not-empty' (щоб лейби сховались)
  nameInput.classList.remove("not-empty");
  phoneInput.classList.remove("not-empty");
  nameError.textContent = "";
  phoneError.textContent = "";

  // Закриваємо модалку покупки
  document.getElementById("buyModal").style.display = "none";

  // Показуємо подяку
  document.getElementById("thankYouModal").style.display = "block";
});
// Реалізація очистки імпутних полів імені та телефону у попапі "Покупка фільму" при кліку на "Підтвердити покупку". End


// Закриваємо модалку подяки
document.getElementById("closeThankYou").addEventListener('click', () => {
  document.getElementById('thankYouModal').style.display = 'none';              // Закриоває модальне вікно подяки, змінюючи стиль display на none.
});
