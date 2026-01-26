const quizInline = document.querySelector(".quiz-new .swiper");

if (quizInline) {
  const prevBtn = quizInline.querySelector(".swiper-button-prev");
  const nextBtn = quizInline.querySelector(".swiper-button-next");
  const submitBtn = quizInline.querySelector('input[type="submit"]');

  let isFieldsValid = { tel: false, accept: false };

  const quiz = new Swiper(quizInline, {
    slidesPerView: 1,
    spaceBetween: 20,
    allowTouchMove: false,
    navigation: {
      prevEl: prevBtn ? prevBtn : null,
      nextEl: nextBtn ? nextBtn : null,
    },
    on: {
      slideChange: () => {
        if (quiz.slides.length === quiz.activeIndex + 1) {
          const textFields = quizInline.querySelectorAll('input[type="text"]');
          const checkboxFields = quizInline.querySelectorAll(
            'input[type="checkbox"]',
          );

          const updateSubmitState = () => {
            submitBtn.disabled = !(isFieldsValid.tel && isFieldsValid.accept);
          };

          textFields.forEach((field) => {
            const isTelField =
              field.dataset.type === "tel" || field.dataset.type === "phone";

            if (!isTelField) return;

            field.addEventListener("input", () => {
              isFieldsValid.tel = field.value.length === 17;
              updateSubmitState();
              console.log(isFieldsValid);
            });
          });

          checkboxFields.forEach((field) => {
            field.addEventListener("change", () => {
              isFieldsValid.accept = field.checked;
              updateSubmitState();
            });
          });
        }
      },
    },
  });
}
