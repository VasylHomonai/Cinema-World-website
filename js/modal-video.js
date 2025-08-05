const videoModal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const closeVideoBtn = document.getElementById("closeVideo");


// Виклик ініціалізації
initVideoModal();


// Ініціалізація відео-модалки
function initVideoModal() {
  // Початковий стан при завантаженні сторінки
  closeVideo();

  // Обробка кліку по кожній кнопці з класом .openVideo
  const videoButtons = document.querySelectorAll(".openVideo");
  videoButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const videoURL = btn.dataset.videoId;
      const embedURL = videoURL.replace("watch?v=", "embed/");
      videoFrame.src = embedURL;
      videoModal.style.display = "flex";
    });
  });

  // Закриття по кнопці "X"
  closeVideoBtn.addEventListener("click", closeVideo);

  // Закриття модалки при кліку поза контентом
  window.addEventListener("click", (e) => {
    if (e.target === videoModal) {
      closeVideo();
    }
  });
};


// Закриває відео та очищає src
function closeVideo() {
  videoModal.style.display = "none";
  videoFrame.src = "";
}
