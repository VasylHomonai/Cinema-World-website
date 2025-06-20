// Відкриваємо попап покупки при кліку на будь-яку кнопку "Купити зараз". Початок.
document.querySelectorAll('.image-item button').forEach(btn => {
  btn.addEventListener('click', () => {
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
  // Спочатку запис в консоль
  const name = document.getElementById('userName').value.trim();
  const phone = document.getElementById('userPhone').value.trim();
  console.log("Ім’я користувача:", name || "Не введено");
  console.log("Телефон:", phone || "Не введено");

  // Очистка полів
  const nameInput = document.getElementById("userName");
  const phoneInput = document.getElementById("userPhone");

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
