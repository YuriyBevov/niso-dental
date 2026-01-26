import Swiper from "swiper";
import { Pagination, Autoplay } from "swiper/modules";

const slider = document.querySelector(".staff-reviews-slider");

if (slider) {
  const pagination = slider.querySelector(".swiper-pagination");

  new Swiper(slider, {
    modules: [Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 20,

    breakpoints: {
      600: {
        slidesPerView: 2,
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
