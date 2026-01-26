import Swiper from "swiper";
import { Pagination } from "swiper/modules";

const slider = document.querySelector(".staff-docs-slider");

if (slider) {
  const pagination = slider.querySelector(".swiper-pagination");

  new Swiper(slider, {
    modules: [Pagination],
    slidesPerView: "auto",
    spaceBetween: 20,

    breakpoints: {
      600: {
        spaceBetween: 30,
      },
      900: {
        spaceBetween: 40,
      },
    },

    autoplay: {
      delay: 2000,
    },

    pagination: {
      dynamicBullets: true,
      el: pagination ? pagination : null,
      clickable: true,
    },
  });
}
