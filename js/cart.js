import { t } from './localization/i18n.js';
import { initApp } from './init-app.js';
import { hasClickedItemsInCookies, setCookie, getCookie } from './utils/cookie.js';
import {
  getState,
  setRemoveCartClickOutsideListener,
  setRemoveBuyClickOutsideListener,
  enableModalCloseOnOutsideClick,
} from './modalCloser.js';
import { CartItem } from './utils/CartItem.js';
import { resetPhoneNameError } from './main.js';


// Створюємо порожній об'єкт для збереження екземплярів класу CartItem
export const objCartItems = {};

// Доступ до об'єкту state в якій змінні: removeCartClickOutsideListener та removeBuyClickOutsideListener:
const state = getState();

async function initCart() {
  const cartButton = document.getElementById("cartButton");
  try {
    await initApp();
  } catch (error) {
    console.error("Помилка ініціалізації застосунку:", error);
    return;
  }

  cartButton.addEventListener("click", handleCartClick);
  updateCartState(); // Для F5 при пустій корзині.
}

// Функція відкриття попапа корзини
export function openCartPopup() {
    // Відображається попап корзини одразу при кліку
    document.getElementById('cartPopupWrapper').style.display = 'flex';

    // Якщо вже був слухач для попапу — знімаємо
    if (typeof state.removeCartClickOutsideListener === 'function') {
      state.removeCartClickOutsideListener();
    }

    // Закриття по кліку поза вікном попапа. Вішається слухач у момент відкриття попапу.
    setRemoveCartClickOutsideListener(
      enableModalCloseOnOutsideClick("cartPopupWrapper", "#cartPopup")
    );
}

function handleCartClick() {
  // ігноруємо клік, якщо немає товарів
  if (!hasClickedItemsInCookies()) return;

  // Відкривається попап
  openCartPopup()
}

initCart();

// Ф-ція для кошика. Відображення к-сті в ньому, зміна картинки при наявності товарів
export function updateCartState() {
  const cartImg = document.getElementById("cartImage");
  const cartTooltip = document.getElementById("cartTooltip");
  const cartCount = document.getElementById("cartCount");
  const cookies = document.cookie.split(';');
  let count = 0;

  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');

    if (key.startsWith('quantity_cart')) {
      const quantity = parseInt(decodeURIComponent(value));
      if (!isNaN(quantity)) {
        count += quantity;
      }
    }
  }

  // Зміна картинки та тултипа
  try {
      if (count > 0) {
        cartImg.src = "images/cart-icon-2.png";
        cartCount.textContent = count;
        cartCount.style.display = "inline-block";
        cartTooltip.textContent = t("cart.tooltip.notempty");
      } else {
        cartImg.src = "images/cart-icon.png";
        cartCount.style.display = "none";
        cartTooltip.textContent = t("cart.tooltip.empty");
      }
  } catch (error) {
       console.error("Помилка при оновленні стану кошика:", error);
  }
}

// Закриваємо попап корзини
document.getElementById('closeCartPopup').addEventListener('click', () => {
  document.getElementById('cartPopupWrapper').style.display = 'none';
  if (typeof state.removeCartClickOutsideListener === "function") {
    state.removeCartClickOutsideListener();
  }
});

// Обробка кнопки "Оформити замовлення"
const orderNow = document.getElementById("orderNow");
orderNow.addEventListener("click", () => {
  // Закриваємо попап корзини
  document.getElementById("cartPopupWrapper").style.display = "none";

  // Скидуються валідації полів імені та телефона до взаємодії з користувачем.
  resetPhoneNameError();
  // Відкриваємо попап "Чекаута"
  document.getElementById("buyModal").style.display = "flex";

  // Додаємо слухача кліку поза попапом "Чекаута"
  if (typeof state.removeBuyClickOutsideListener === "function") {
    state.removeBuyClickOutsideListener();
  }
  setRemoveBuyClickOutsideListener(
    enableModalCloseOnOutsideClick("buyModal", "#buyModalContent")
  );
});

/* Початок роботи з кнопками decrease, increase та quantity в попапі корзини.
Ініціалізація для всіх .cart-item   */
export function initializeQuantityControls(cartItem) {
  const counter = cartItem.querySelector('.item-counter');
  const quantityInput = cartItem.querySelector('.quantity');
  const minusBtn = counter.querySelector('.decrease');
  const plusBtn = counter.querySelector('.increase');
  const priceElement = cartItem.querySelector('.item-price');
  const price = parseFloat(priceElement.textContent); // 150

  if (!counter || !quantityInput) return;

  const id = counter.dataset.id; // напр. 'quantity_cart_button2'

  /* Якщо куки з такою ID ще немає — створюємо її зі значенням 1
  При додаванні товара в корзину відразу створюємо куку для к-сті товара  */
  if (!getCookie(id)) {
    setCookie(id, 1);
  }

  // Отримуємо кількість з куки або 1 за замовчуванням
  let quantity = parseInt(getCookie(id)) || 1;
  quantityInput.value = quantity;

  // Ініціалізуємо об'єкт
  const item = new CartItem(id, quantity, price);
  objCartItems[id] = item;

  // Функція для оновлення стилів. Стилізація бордера ітема якщо к-сть = 10
  function updateBorders() {
    const note = cartItem.querySelector('.cart-note');

    if (quantity === 10) {
      cartItem.classList.add('cart-item-border');

       if (note) {
         note.style.display = 'block';
       }
    } else {
      cartItem.classList.remove('cart-item-border');

      if (note) {
        note.style.display = 'none';
      }
    }
  }

  // Початкове оновлення
  updateBorders();

  // Обробник input (вручну введене число). Заборона нечислових значень
  quantityInput.addEventListener('input', () => {
    let val = quantityInput.value;
    if (!/^\d+$/.test(val)) {
      quantityInput.value = quantity;
      return;
    }

    let num = parseInt(val);
    if (num < 1) num = 1;
    if (num > 10) num = 10;
    quantity = num;
    quantityInput.value = quantity;
    setCookie(id, quantity);
    updateBorders();
    // Оновлюємо стан корзини
    updateCartState();
    // Оновляємо суму по товару
    priceElement.textContent = `${quantity * price} ₴`;
    item.setQuantity(quantity);
    updateTotal()
  });

  // Обробник зменшення к-сті
  minusBtn?.addEventListener('click', e => {
    e.stopPropagation();
    if (quantity > 1) {
      quantity--;
      quantityInput.value = quantity;
      setCookie(id, quantity);
      updateBorders();
      // Оновлюємо стан корзини
      updateCartState();
      // Оновляємо суму по товару
      priceElement.textContent = `${quantity * price} ₴`;
      item.setQuantity(quantity);
      updateTotal()
    }
  });

  // Обробник збільшення к-сті
  plusBtn?.addEventListener('click', e => {
    e.stopPropagation();
    if (quantity < 10) {
      quantity++;
      quantityInput.value = quantity;
      setCookie(id, quantity);
      updateBorders();
      // Оновлюємо стан корзини
      updateCartState();
      // Оновляємо суму по товару
      priceElement.textContent = `${quantity * price} ₴`;
      item.setQuantity(quantity);
      updateTotal()
    }
  });
}
// Кінець роботи з кнопками decrease, increase та quantity в попапі корзини.

// Ф-ція для оновлення загальної суми корзини та суми кожної позицій які в ній
export function updateTotal() {
  let sum = 0;
  Object.entries(objCartItems).forEach(([id, cartItem]) => {
    if (cartItem.quantity > 0) {
      // Видаляємо префікс "quantity_" для пошуку елементів cart-item в DOM
      const cleanKey = id.replace(/^quantity_/, '');
      // Шукаємо DOM-елемент по data-id без префікса
      const cartItemElement = document.querySelector(`[data-id="${cleanKey}"]`);
      if (cartItemElement) {
          const priceElement = cartItemElement.querySelector('.item-price');
          if (priceElement) {
            priceElement.textContent = `${cartItem.getTotal()} ₴`;
          }
      }

      // Сумуються всі позиції корзини для Subtotal
      sum += objCartItems[id].getTotal();
    }
  });
  document.querySelector('.total-price').innerHTML = `${t("total_price")} <strong>${sum} ₴</strong>`;
}
