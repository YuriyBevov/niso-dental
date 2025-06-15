import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slider = document.querySelector(".top-banner-slider");

if (slider) {
	const btnNext = slider.querySelector(".swiper-button-next");
	const btnPrev = slider.querySelector(".swiper-button-prev");

	new Swiper(slider, {
		modules: [Navigation],
		slidesPerView: 1,
		spaceBetween: 20,

		navigation: {
			nextEl: btnNext ? btnNext : null,
			prevEl: btnPrev ? btnPrev : null,
		},
	});
}
