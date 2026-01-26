const items = document.querySelectorAll(
  ".lw-dropdown-menu > .top-menu__inner-wrapper > ul > li"
);

if (items) {
  const OFFSET = 40;

  let customizedEl = null;

  const onWindowResizeHandler = () => {
    if (!customizedEl || window.innerWidth >= 960) return;
    customizedEl.style.maxHeight = "100%";
    customizedEl = null;
  };

  const fillItemHeight = (item) => {
    const rect = item.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const maxItemHeight =
      document.documentElement.clientHeight - (rect.top + scrollTop) - OFFSET;

    const innerMenu = item.querySelector(".top-menu__inner-wrapper ul");

    if (!innerMenu) return;

    if (window.innerWidth >= 960) {
      innerMenu.style.maxHeight = maxItemHeight + "px";
      customizedEl ? (customizedEl.style.maxHeight = "100%") : null;
      customizedEl = innerMenu;
    } else {
      customizedEl !== null ? (customizedEl.style.maxHeight = "100%") : null;
    }
  };

  window.addEventListener("resize", onWindowResizeHandler);

  const onMouseLeaveHandler = (evt) => {
    evt.currentTarget.removeEventListener("mouseleave", onMouseLeaveHandler);
    evt.currentTarget.addEventListener("mouseenter", onMouseEnterHandler);
  };

  const onMouseEnterHandler = (evt) => {
    const target = evt.currentTarget;
    fillItemHeight(target);

    target.removeEventListener("mouseenter", onMouseEnterHandler);
    target.addEventListener("mouseleave", onMouseLeaveHandler);
  };

  items.forEach((item) => {
    item.addEventListener("mouseenter", onMouseEnterHandler);
  });
}
