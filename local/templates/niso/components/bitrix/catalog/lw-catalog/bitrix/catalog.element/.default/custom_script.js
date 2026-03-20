document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".open-modal-btn");

  if (button) {
    const showButton = () => {
      button.style.transform = "translateX(" + 0 + ")";
    };

    setTimeout(showButton, 8000);
  }
});
