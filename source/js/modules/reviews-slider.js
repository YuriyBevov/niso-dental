import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

const slider = document.querySelector(".reviews-slider");

if (slider) {
  new Swiper(slider, {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 20,

    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

    pagination: {
      dynamicBullets: true,
      el: ".reviews-slider .swiper-pagination",
      clickable: true,
    },
  });
}
