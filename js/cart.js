import { t } from './localization/i18n.js';
import { initApp } from './init-app.js';
import { getCookie } from './language-switcher.js';
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
const lang = getCookie("langDetected");

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
