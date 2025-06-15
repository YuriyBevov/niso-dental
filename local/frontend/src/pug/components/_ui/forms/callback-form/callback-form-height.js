const callback = document.querySelector(".callback");

if (callback) {
	callback.style.minHeight = `${callback.getBoundingClientRect().height}px`;

	window.addEventListener("resize", () => {
		callback.style.minHeight = `${callback.getBoundingClientRect().height}px`;
	});
}
