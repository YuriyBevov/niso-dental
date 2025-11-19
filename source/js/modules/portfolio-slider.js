const imageComparisonSliders = document.querySelectorAll(
	'[data-component="image-comparison-slider"]',
);

if (imageComparisonSliders.length) {
	function setSliderstate(e, element) {
		const sliderRange = element.querySelector("[data-image-comparison-range]");

		if (e.type === "input") {
			sliderRange.classList.add("image-comparison__range--active");
			return;
		}

		sliderRange.classList.remove("image-comparison__range--active");
		element.removeEventListener("mousemove", moveSliderThumb);
	}

	function moveSliderThumb(evt) {
		const target = evt.target.closest(
			"[data-component='image-comparison-slider']",
		);
		const sliderRange = target.querySelector("[data-image-comparison-range]");
		const thumb = target.querySelector("[data-image-comparison-thumb]");
		let position = evt.layerY - 20;

		if (evt.layerY <= sliderRange.offsetTop) {
			position = -20;
		}

		if (evt.layerY >= sliderRange.offsetHeight) {
			position = sliderRange.offsetHeight - 20;
		}

		thumb.style.top = `${position}px`;
	}

	function moveSliderRange(evt, element) {
		const value = evt.target.value;
		const slider = element.querySelector("[data-image-comparison-slider]");
		const imageWrapperOverlay = element.querySelector(
			"[data-image-comparison-overlay]",
		);

		slider.style.left = `${value}%`;
		imageWrapperOverlay.style.width = `${value}%`;

		element.addEventListener("mousemove", moveSliderThumb);
		setSliderstate(evt, element);
	}

	function init(element) {
		console.log("inited");
		const sliderRange = element.querySelector("[data-image-comparison-range]");

		if ("ontouchstart" in window === false) {
			sliderRange.addEventListener("mouseup", (evt) =>
				setSliderstate(evt, element),
			);
			sliderRange.addEventListener("mousedown", moveSliderThumb);
		}

		sliderRange.addEventListener("input", (evt) =>
			moveSliderRange(evt, element),
		);
		sliderRange.addEventListener("change", (evt) =>
			moveSliderRange(evt, element),
		);
	}

	imageComparisonSliders.forEach((imageComparisonSlider) => {
		init(imageComparisonSlider);
	});
}
