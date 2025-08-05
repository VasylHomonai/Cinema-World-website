import { openCartPopup, objCartItems, logPurchasedItems } from './cart.js';
import { t } from './localization/i18n.js';
import { initApp, setupFloatingLabels } from './init-app.js';
import { isCookieClicked, setDateCookie, getCookie, getDateCookie } from './utils/cookie.js';
import { addToCart, removeCartItemById } from './utils/cart-item-controller.js';
import { getState, setRemoveThanksClickOutsideListener, enableModalCloseOnOutsideClick } from './modalCloser.js';
import { CartItem } from './utils/CartItem.js';


// Доступ до об'єкту state в якій змінні: removeThanksClickOutsideListener та removeBuyClickOutsideListener:
const state = getState();
// Масив для збору "клікнутих" товарів
const clickedItems = [];
// Отримуємо форму модалки чекаута
const form = document.getElementById("purchaseForm");
// Отримуємо поля вводу для форми чекаута
const nameInput = document.getElementById("userName");
const phoneInput = document.getElementById("userPhone");
const PREFIX = "+380";
// Помилки для імпутних полів
const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");


await initApp();
setupFloatingLabels();


// Відкриваємо попап покупки при кліку на будь-яку кнопку "Купити зараз". Початок.
document.querySelectorAll('.buyNow').forEach(btn => {
  const id = `cart_${btn.dataset.id}`;
  const objId = `quantity_${id}`;

  const title = btn.dataset.title;
  const price = parseFloat(btn.dataset.price);
  const image = btn.dataset.image;

  // При завантаженні(F5) сторінки — перевіряємо збережений стан з cookie
  if (isCookieClicked(id)) {
      const timestamp = getDateCookie(id);
      // Отримуємо кількість із куки
      const quantityFromCookie = getCookie(objId);

      if (timestamp && quantityFromCookie !== null) {
        const quantity = parseInt(quantityFromCookie);

        clickedItems.push({ id, title, price, image, timestamp: Number(timestamp) });
        btn.classList.add('clicked');
        btn.textContent = t("in_cart_text");
        // Створюємо об'єкт CartItem і додаємо в objCartItems
        const item = new CartItem(objId, title, quantity, price);
        objCartItems[objId] = item;
      }
  }


  // Обробка кліку
  btn.addEventListener('click', (event) => {
    // Якщо ще немає куки — встановлюємо її і додаємо клас
    if (!isCookieClicked(id)) {
        setDateCookie(id, "clicked")
        btn.classList.add('clicked');
        btn.textContent = t("in_cart_text");
        // Додаємо товар в контейнер cartItemsContainer
        addToCart(id, title, price, image);
    }

    // Відкриваємо попап корзини незалежно від наявності куки
    openCartPopup();
  });
});


/* Ця ф-ція для відновлення товарів в корзині, щоб вони були посортовані в тій послідовності якій додані до F5
Сортування за часом (від найстарішого до найновішого) */
function restoreCartFromClickedItems(clickedItems) {
    clickedItems.sort((a, b) => a.timestamp - b.timestamp);
    // Відновлення DOM у правильному порядку
    clickedItems.forEach(item => {
        addToCart(item.id, item.title, item.price, item.image);
    });
}


// При оновленні сторінки додаємо товари по новому в корзину в тій послідовності якій були додані до F5
restoreCartFromClickedItems(clickedItems);


/* При підтвердженні "Підтвердити покупку" — ховаємо форму і показуємо повідомлення подяки
Реалізація очистки імпутних полів імені та телефону у попапі "Покупка фільму" при кліку на "Підтвердити покупку". Start
Функція перевірки валідності номера */
function isValidPhone(phone) {
  return /^\+380\d{9}$/.test(phone);
}


// Кастомна валідація поля імені в модалці чекаута
function validateName(value) {
  const namePattern = /^[A-Za-zА-Яа-яІіЇїЄєҐґ'\- ]{1,20}$/;   // перевірка для заповнення поля імені
  return namePattern.test(value);
}


// Ф-ція для очистки полів модалки чекаута.
function resetPurchaseForm() {
  nameInput.value = "";
  phoneInput.value = "";
  nameInput.classList.remove("not-empty");
  phoneInput.classList.remove("not-empty");
  nameError.textContent = "";
  phoneError.textContent = "";
}


// При відкритті попапа "Чекаута" скидуються валідації полів імені та телефона до взаємодії з користувачем.
export function resetPhoneNameError() {
  nameError.textContent = "";
  phoneError.textContent = "";
}


// Кастомна валідація полів
function validateField(input, errorElement, validator = null, errorMessage = "") {
  const value = input.value.trim();
  if (value === "") {
    errorElement.textContent = t("requiredFieldMessage");
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
  validateField(nameInput, nameError, validateName, t("nameOnlyLettersMessage"));
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
  validateField(phoneInput, phoneError, isValidPhone, t("phoneFormatMessage"));
});


// Обробка сабміту форми
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Щоб не перезавантажувалась сторінка
  const isNameValid = validateField(nameInput, nameError, validateName, t("nameOnlyLettersMessage"));
  const isPhoneValid = validateField(phoneInput, phoneError, isValidPhone, t("phoneFormatMessage"));

  // Якщо хоча б одне поле невалідне — зупинити
  if (!isNameValid || !isPhoneValid) return;

  // Логування в консоль
  console.log("Ім’я користувача:", nameInput.value.trim());
  console.log("Телефон:", phoneInput.value.trim());
  logPurchasedItems(objCartItems);

  // Очищаємо всі покупки (стан кнопок і Куки)
  document.querySelectorAll('.buyNow').forEach(button => {
    const id = `cart_${button.dataset.id}`;
    if (getCookie(id) === 'clicked') {
        removeCartItemById(id);
    }
  });

  // Очистка полів
  resetPurchaseForm();

  // Закриваємо модалку покупки
  document.getElementById("buyModal").style.display = "none";

  // Показуємо подяку
  document.getElementById("thankYouModal").style.display = "flex";

  // Якщо вже був слухач для попапу — знімаємо
  if (typeof state.removeThanksClickOutsideListener === 'function') {
    state.removeThanksClickOutsideListener();
  }

  // Закриття по кліку поза вікном попапа. Вішається слухач у момент відкриття попапу "подяки".
  setRemoveThanksClickOutsideListener(
    enableModalCloseOnOutsideClick('thankYouModal', "#thankYouModalContent")
  );
});
// Реалізація очистки імпутних полів імені та телефону у попапі "Покупка фільму" при кліку на "Підтвердити покупку". End


// Закриваємо попап покупки
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('buyModal').style.display = 'none';
  if (typeof state.removeBuyClickOutsideListener === 'function') {
    state.removeBuyClickOutsideListener();
  }
});


// Закриваємо модалку подяки
document.getElementById("closeThankYou").addEventListener('click', () => {
  document.getElementById('thankYouModal').style.display = 'none';              // Закриоває модальне вікно подяки, змінюючи стиль display на none.
  if (typeof state.removeThanksClickOutsideListener === 'function') {
    state.removeThanksClickOutsideListener();
  }
});
