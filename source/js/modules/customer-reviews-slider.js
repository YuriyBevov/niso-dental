import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

const sliders = document.querySelectorAll(".customer-reviews-slider");

if (sliders.length) {
	sliders.forEach((slider) => {
		if (slider) {
			new Swiper(slider, {
				modules: [Navigation, Pagination, Autoplay],
				slidesPerView: 1,
				spaceBetween: 24,

				breakpoints: {
					768: {
						slidesPerView: 2,
					},
					1200: {
						slidesPerView: 3,
					},
				},

				pagination: {
					dynamicBullets: true,
					el: ".customer-reviews-slider .swiper-pagination",
					clickable: true,
				},
			});
		}
	});
}
