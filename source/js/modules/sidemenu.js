document.addEventListener("DOMContentLoaded", () => {
	const items = document.querySelectorAll(".sidemenu__list-item");

	if (items.length) {
		const onClickToogleItem = (target) => {
			items.forEach((item) => {
				const active = item.querySelector(".initial");
				active ? active.classList.remove("initial") : null;

				if (target !== item && item.classList.contains("expanded")) {
					item.classList.remove("expanded");
				}
			});
			target.classList.toggle("expanded");
		};
		items.forEach((item) => {
			item.addEventListener("click", (evt) => {
				if (item.querySelector("ul") && evt.target === item) {
					onClickToogleItem(item);
				}
			});
		});
	}
});
