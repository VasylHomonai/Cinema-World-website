document.getElementById('carForm').addEventListener('submit', function (event) {
  event.preventDefault(); // зупиняємо стандартну відправку форми

  const name = document.getElementById('name').value;

  const gender = document.querySelector('input[name="gender"]:checked')?.value || "Не обрано";

  const hobbies = Array.from(document.querySelectorAll('input[name="hobby"]:checked'))
    .map(cb => cb.value);

  const selectedCar = document.getElementById('cars').value;

  console.log("Ім’я:", name);
  console.log("Стать:", gender);
  console.log("Хобі:", hobbies.length ? hobbies.join(", ") : "Не вказано");
  console.log("Авто:", selectedCar);
});