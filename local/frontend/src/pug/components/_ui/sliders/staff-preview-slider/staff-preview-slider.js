import Swiper from "swiper";
import { Navigation, Pagination, Autoplay, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

let thumbs = null;

const thumbsSlider = document.querySelector(".staff-preview-slider-thumbs");
if (thumbsSlider) {
	thumbs = new Swiper(thumbsSlider, {
		slidesPerView: "auto",
		spaceBetween: 10,
	});
}

const mainSlider = document.querySelector(".staff-preview-slider");
if (mainSlider) {
	const pagination = mainSlider.querySelector(".swiper-pagination");
	const btnNext = mainSlider.querySelector(".swiper-button-next");
	const btnPrev = mainSlider.querySelector(".swiper-button-prev");

	new Swiper(mainSlider, {
		modules: [Navigation, Pagination, Autoplay, Thumbs],
		slidesPerView: 1,
		spaceBetween: 20,

		breakpoints: {
			600: {
				slidesPerView: 2,
			},
			768: {
				slidesPerView: 1,
			},
		},

		navigation: {
			nextEl: btnNext ? btnNext : null,
			prevEl: btnPrev ? btnPrev : null,
		},

		pagination: {
			el: pagination ? pagination : null,
			dynamicBullets: true,
		},

		thumbs: {
			swiper: thumbs,
		},
	});
}
