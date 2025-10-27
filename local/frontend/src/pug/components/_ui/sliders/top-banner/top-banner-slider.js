import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slider = document.querySelector(".top-banner-slider");

if (slider) {
  const btnNext = slider.querySelector(".swiper-button-next");
  const btnPrev = slider.querySelector(".swiper-button-prev");

  const swiper = new Swiper(slider, {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 20,

    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },

    loop: true,

    navigation: {
      nextEl: btnNext ? btnNext : null,
      prevEl: btnPrev ? btnPrev : null,
    },

    pagination: {
      dynamicBullets: true,
      el: ".top-banner-slider .swiper-pagination",
      clickable: true,
    },
  });

  swiper.el.addEventListener("click", (evt) => {
    swiper.autoplay.stop();
  });

  swiper.on("touchStart", () => {
    swiper.autoplay.stop();
  });
}
