import { gsap } from "gsap";

const items = document.querySelectorAll(".top-menu-inner-opener");

if (items.length) {
	items.forEach((item) => {
		item.addEventListener("click", (evt) => {
			evt.preventDefault();
			evt.currentTarget.closest("li").classList.toggle("expanded");
		});
	});
}

const opener = document.querySelector(".mobile-menu-opener");
const closer = document.querySelector(".mobile-menu-closer");
const menu = document.querySelector(".mobile-menu");

if (opener && closer && menu) {
	const tl = gsap.timeline().pause();

	tl.fromTo(
		".mobile-menu",
		{ opacity: 0 },
		{ display: "block", opacity: 1, duration: 0.4 },
	);
	tl.fromTo(
		".mobile-menu__wrapper",
		{ x: "-100vw", opacity: 0 },
		{ opacity: 1, x: 0, duration: 0.4 },
		"-=.2",
	);

	const onClickOpenMenu = () => {
		tl.play();
		document.addEventListener("click", onOverlayClickHandler);
		window.addEventListener("keydown", onEscClickHandler);
	};

	const onOverlayClickHandler = (evt) => {
		if (evt.target.classList.contains("mobile-menu")) onClickCloseMenu();
	};

	const onEscClickHandler = (evt) => {
		if (evt.key === "Escape" || evt.code === 27) onClickCloseMenu();
	};

	const onClickCloseMenu = () => {
		tl.reverse();
		document.removeEventListener("click", onOverlayClickHandler);
		window.removeEventListener("keydown", onEscClickHandler);
	};

	closer.addEventListener("click", onClickCloseMenu);
	opener.addEventListener("click", onClickOpenMenu);
}
