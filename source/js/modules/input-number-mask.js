import IMask from "imask";

export function initImask() {
  const phoneFields = document.querySelectorAll(
    '[data-type="phone"], [data-type="tel"]',
  );

  const maskOptions = {
    mask: "+{7}(000) 000-00-00",
  };

  phoneFields.forEach((field) => {
    IMask(field, maskOptions);
  });
}

initImask();

window.initImask = initImask;
