const quiz = document.querySelector(".quiz-form");

if (quiz) {
  const ctrls = quiz.querySelectorAll('input[type="radio"]');
  const prevBtns = quiz.querySelectorAll(".quiz-form__btn");

  ctrls.forEach((ctrl) => {
    ctrl.addEventListener("change", (evt) => {
      const current = evt.currentTarget.closest(".quiz-form__screen.active");
      current.classList.add("visually-hidden");
      current.classList.remove("active");
      current.nextElementSibling.classList.remove("visually-hidden");
      current.nextElementSibling.classList.add("active");
    });
  });

  prevBtns.forEach((prevBtn) => {
    prevBtn.addEventListener("click", (evt) => {
      const current = evt.currentTarget.closest(".quiz-form__screen.active");
      current.classList.add("visually-hidden");
      current.classList.remove("active");
      current.previousElementSibling.classList.remove("visually-hidden");
      current.previousElementSibling.classList.add("active");
    });
  });
}
