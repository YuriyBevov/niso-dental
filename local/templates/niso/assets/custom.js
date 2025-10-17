document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll("[data-doctor]");
  const doctorInput = document.getElementById("doctorNameField");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const doctorName = this.getAttribute("data-doctor");
      console.log("clicked", doctorName);
      if (doctorInput) {
        doctorInput.value = doctorName;
      }
    });
  });
});

const searchOpenButton = document.querySelector(".search-btn--open");
const search = document.querySelector(".search");

if (searchOpenButton && search) {
  const searchCloseButton = document.querySelector(".search-btn--close");

  const openModal = () => {
    search.classList.add("search--shown");
    console.log("click");
  };

  const closeModal = () => {
    search.classList.remove("search--shown");
  };

  searchOpenButton.addEventListener("click", openModal);

  if (searchCloseButton) {
    searchCloseButton.addEventListener("click", closeModal);
    console.log("test");
  }
}
