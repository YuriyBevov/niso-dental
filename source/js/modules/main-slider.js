import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

const sliders = document.querySelectorAll(".main-slider");

if (sliders.length) {
	sliders.forEach((slider) => {
		const sliderHasAutoplay = slider.classList.contains(
			"main-slider--autoplay",
		);

		const btnNext = slider.querySelector(".swiper-button-next");
		const btnPrev = slider.querySelector(".swiper-button-prev");
		const pagination = slider.querySelector(".swiper-pagination");

		new Swiper(slider, {
			modules: [Navigation, Pagination, Autoplay],
			slidesPerView: 1,
			spaceBetween: 20,

			autoplay: sliderHasAutoplay
				? {
						delay: 4000,
						disableOnInteraction: false,
					}
				: false,

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
