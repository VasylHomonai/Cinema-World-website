const videoModal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const closeVideoBtn = document.getElementById("closeVideo");

// При завантаженні сторінки
document.getElementById('videoModal').style.display = 'none';
document.getElementById('videoFrame').src = ''; // пустий src

// Обробка кліку по кожній кнопці з класом .openVideo
document.querySelectorAll(".openVideo").forEach(btn => {
  btn.addEventListener("click", () => {
    const videoURL = btn.dataset.videoId;
    const embedURL = videoURL.replace("watch?v=", "embed/");
    document.getElementById("videoFrame").src = embedURL;
    document.getElementById("videoModal").style.display = "flex";
  });
});

// Закриття модалки через X
closeVideoBtn.addEventListener("click", () => {
  videoModal.style.display = "none";
  videoFrame.src = ""; // Зупинити відео
});

// Закриття модалки при кліку поза контентом
window.addEventListener("click", (e) => {
  if (e.target === videoModal) {
    videoModal.style.display = "none";
    videoFrame.src = "";
  }
});