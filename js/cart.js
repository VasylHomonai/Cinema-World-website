import { t } from './localization/i18n.js';
import { initApp } from './init-app.js';
import { getCookie } from './language-switcher.js';

const cartButton = document.getElementById("cartButton");
const cartImg = document.getElementById("cartImage");
const cartTooltip = document.getElementById("cartTooltip");
const cartCount = document.getElementById("cartCount");

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
  const lang = getCookie("langDetected");
  alert(lang === "ua" ? "🛒 Корзина в процесі розробки!" : "🛒 Cart under development!");
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
