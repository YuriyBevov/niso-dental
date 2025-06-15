import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const sliders = document.querySelectorAll(".main-slider");

if (sliders.length) {
	sliders.forEach((slider) => {
		const btnNext = slider.querySelector(".swiper-button-next");
		const btnPrev = slider.querySelector(".swiper-button-prev");
		const pagination = slider.querySelector(".swiper-pagination");

		new Swiper(slider, {
			modules: [Navigation, Pagination],
			slidesPerView: 1,
			spaceBetween: 20,

			navigation: {
				nextEl: btnNext ? btnNext : null,
				prevEl: btnPrev ? btnPrev : null,
			},

			pagination: {
				el: pagination ? pagination : null,
				dynamicBullets: true,
				clickable: true,
			},
		});
	});
}
