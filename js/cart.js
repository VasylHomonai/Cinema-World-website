import { t } from './localization/i18n.js';
import { initApp } from './init-app.js';
import { hasClickedItemsInCookies, setCookie, getCookie } from './utils/cookie.js';
import {
  getState,
  setRemoveCartClickOutsideListener,
  setRemoveBuyClickOutsideListener,
  enableModalCloseOnOutsideClick,
} from './modalCloser.js';

// Доступ до об'єкту state в якій змінні: removeCartClickOutsideListener та removeBuyClickOutsideListener:
const state = getState();
const cartButton = document.getElementById("cartButton");
const cartImg = document.getElementById("cartImage");
const cartTooltip = document.getElementById("cartTooltip");
const cartCount = document.getElementById("cartCount");
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const quantityInput = document.getElementById('quantity');
const cartItems = document.querySelectorAll('.cart-item');

async function initCart() {
  try {
    await initApp();
  } catch (error) {
    console.error("Помилка ініціалізації застосунку:", error);
    return;
  }

  cartButton.addEventListener("click", handleCartClick);
  updateCartState();
}

function handleCartClick() {
  // ігноруємо клік, якщо немає товарів
  if (!hasClickedItemsInCookies()) return;

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

initCart();

export function updateCartState() {
  let count = 0;
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');

    if (key.startsWith("cart_button_") && value === "clicked") {
      count++;
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

  // Відкриваємо попап "Купити зараз"
  document.getElementById("buyModal").style.display = "flex";

  // Додаємо слухача кліку поза попапом "Купити зараз"
  if (typeof state.removeBuyClickOutsideListener === "function") {
    state.removeBuyClickOutsideListener();
  }
  setRemoveBuyClickOutsideListener(
    enableModalCloseOnOutsideClick("buyModal", "#buyModalContent")
  );
});

// Початок роботи з кнопками decrease, increase та quantity в попапі корзини.
// Ініціалізація кількості з куки або 1 за замовчуванням
let quantity = parseInt(getCookie('cart_quantity')) || 1;
quantityInput.value = quantity;

// Заборона нечислових значень для поля к-сті.
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
  setCookie('cart_quantity', quantity);
  updateBorders();
});

// Стилізація бордера ітема якщо к-сть = 10
function updateBorders() {
  cartItems.forEach(item => {
    if (quantity === 10) {
      item.style.border = '1px solid #004466';
      item.style.padding = '4px';
    } else {
      item.style.border = 'none';
      item.style.borderBottom = '1px solid #eee';
    }
  });
}

// Початкове оновлення
updateBorders();

increaseBtn.addEventListener('click', () => {
  if (quantity < 10) {
    quantity++;
    quantityInput.value = quantity;
    setCookie('cart_quantity', quantity);
    updateBorders();
  }
});

decreaseBtn.addEventListener('click', () => {
  if (quantity > 1) {
    quantity--;
    quantityInput.value = quantity;
    setCookie('cart_quantity', quantity);
    updateBorders();
  }
});
