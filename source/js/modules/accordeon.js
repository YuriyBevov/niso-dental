const accordeons = document.querySelectorAll(".accordeon");

if (accordeons) {
  accordeons.forEach((accordeon) => {
    const items = accordeon.querySelectorAll(".accordeon-header");

    if (accordeon.classList.contains("--first-item-expanded")) {
      accordeon
        .querySelector(".accordeon-item:first-child")
        .classList.add("expanded");
    }

    items.forEach((item) => {
      item.addEventListener("click", () => {
        item.parentNode.classList.toggle("expanded");
      });
    });
  });
}
