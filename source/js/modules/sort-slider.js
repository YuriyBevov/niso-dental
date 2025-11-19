import Swiper from "swiper";
// import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/effect-fade";

const sliders = document.querySelectorAll(".sort-slider");

if (sliders.length) {
  sliders.forEach((slider) => {
    new Swiper(slider, {
      slidesPerView: "auto",
      spaceBetween: 15,
    });
  });
}
