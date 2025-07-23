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