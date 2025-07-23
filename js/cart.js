document.addEventListener("DOMContentLoaded", function () {
  const cartButton = document.getElementById("cart");

  cartButton.addEventListener("click", function () {
    const lang = localStorage.getItem("langDetected");

    if (lang === "ua") {
      alert("🛒 Корзина в процесі розробки!");
    } else {
      alert("🛒 Cart under development!");
    }
  });
});

export function updateCartState() {
  let count = 0;

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith("button")) {
      if (localStorage.getItem(key) === "clicked") {
        count++;
      }
    }
  }

  const cartImg = document.getElementById("cart");
  const cartCount = document.getElementById("cart-count");

  // Зміна картинки
  if (count > 0) {
    cartImg.src = "images/cart-icon-2.png";
    cartCount.textContent = count;
    cartCount.style.display = "inline-block";
  } else {
    cartImg.src = "images/cart-icon.png";
    cartCount.style.display = "none";
  }
}

// Виклик при завантаженні сторінки
document.addEventListener("DOMContentLoaded", updateCartState);