const items = document.querySelectorAll(".rate__wrapper input");

if (items.length) {
	const fillStars = (index) => {
		items.forEach((item, i) => {
			if (i <= index) {
				!item.parentNode.classList.contains("filled")
					? item.parentNode.classList.add("filled")
					: null;
			} else {
				item.parentNode.classList.contains("filled")
					? item.parentNode.classList.remove("filled")
					: null;
			}
		});
	};

	for (let i = 4; i >= 0; i--) {
		if (items[i].checked) {
			fillStars(i);
			break;
		}
	}

	items.forEach((item, index) => {
		item.addEventListener("change", () => {
			fillStars(index);
		});
	});
}
