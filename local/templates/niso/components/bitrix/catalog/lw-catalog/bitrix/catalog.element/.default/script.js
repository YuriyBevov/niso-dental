document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".open-modal-btn");

  if (button) {
    const showButton = () => {
      button.style.opacity = "1";
    };

    setTimeout(showButton, 8000);
  }
});
