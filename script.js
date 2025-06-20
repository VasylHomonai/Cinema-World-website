// Відкриваємо попап покупки при кліку на будь-яку кнопку "Купити зараз". Початок.
document.querySelectorAll('.image-item button').forEach(btn => {
  btn.addEventListener('click', () => {
    // Очистити попередні повідомлення про помилки в імпутних полях
    document.getElementById("nameError").textContent = "";
    document.getElementById("phoneError").textContent = "";
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
document.getElementById("confirmPurchase").addEventListener("click", () => {
  // Спочатку підготовка для запису в консоль та обробка пустих полів (на помилки)
  // Отримуємо поля вводу
  const nameInput = document.getElementById("userName");
  const phoneInput = document.getElementById("userPhone");
  // Значення полів вводу
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  // Помилки для імпутних полів
  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  // Валідація полів вводу
  let isValid = true;
  // Очистити попередні повідомлення
  nameError.textContent = "";
  phoneError.textContent = "";

  // Валідація імені
  if (name === "") {
    nameError.textContent = "Дане поле обов'язкове для заповнення.";
    isValid = false;
  }

  // Валідація телефону
  if (phone === "") {
    phoneError.textContent = "Дане поле обов'язкове для заповнення.";
    isValid = false;
  }

  // Якщо не валідно — зупинити
  if (!isValid) return;

  //Логування в консоль
  console.log("Ім’я користувача:", name);
  console.log("Телефон:", phone);

  // Очистка полів
  nameInput.value = "";
  phoneInput.value = "";
  // Прибрати клас 'not-empty' (щоб лейби сховались)
  nameInput.classList.remove("not-empty");
  phoneInput.classList.remove("not-empty");

  // Закриваємо модалку
  document.getElementById("buyModal").style.display = "none";

  // Показуємо подяку
  document.getElementById("thankYouModal").style.display = "block";
});
// Реалізація очистки імпутних полів імені та телефону у попапі "Покупка фільму" при кліку на "Підтвердити покупку". End


// Закриваємо модалку подяки
document.getElementById("closeThankYou").addEventListener('click', () => {
  document.getElementById('thankYouModal').style.display = 'none';              // Закриоває модальне вікно подяки, змінюючи стиль display на none.
});
