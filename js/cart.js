import { t } from './localization/i18n.js';
import { initApp } from './init-app.js';

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
  const lang = localStorage.getItem("langDetected");
  alert(lang === "ua" ? "🛒 Корзина в процесі розробки!" : "🛒 Cart under development!");
}

document.addEventListener("DOMContentLoaded", initCart);

export function updateCartState() {
  let count = 0;

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith("button")) {
      if (localStorage.getItem(key) === "clicked") {
        count++;
      }
    }
  }

  // Зміна картинки
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
