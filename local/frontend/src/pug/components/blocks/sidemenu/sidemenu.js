document.addEventListener("DOMContentLoaded", () => {
	const items = document.querySelectorAll(".sidemenu__list-item");

	console.log(items);

	if (items.length) {
		const onClickToogleItem = (target) => {
			items.forEach((item) => {
				if (target !== item && item.classList.contains("expanded")) {
					item.classList.remove("expanded");
				}
			});
			target.classList.toggle("expanded");
		};
		items.forEach((item) => {
			item.addEventListener("click", (evt) => {
				console.log(evt.target, evt.currentTarget);
				if (item.querySelector("ul") && evt.target === item) {
					onClickToogleItem(item);
				}
			});
		});
	}
});
