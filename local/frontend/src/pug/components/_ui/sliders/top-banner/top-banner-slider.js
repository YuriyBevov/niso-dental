import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slider = document.querySelector(".top-banner-slider");

if (slider) {
  const btnNext = slider.querySelector(".swiper-button-next");
  const btnPrev = slider.querySelector(".swiper-button-prev");

  const swiper = new Swiper(slider, {
    modules: [Navigation, Autoplay],
    slidesPerView: 1,
    spaceBetween: 20,

    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },

    navigation: {
      nextEl: btnNext ? btnNext : null,
      prevEl: btnPrev ? btnPrev : null,
    },
  });

  swiper.el.addEventListener("click", (evt) => {
    swiper.autoplay.stop();
  });

  swiper.on("touchStart", () => {
    swiper.autoplay.stop();
  });
}
