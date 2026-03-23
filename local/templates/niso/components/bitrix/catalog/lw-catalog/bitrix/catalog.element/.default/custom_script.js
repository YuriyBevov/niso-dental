BX.ready(function () {
  const slidePanel = document.querySelector(".slide-panel");

  if (slidePanel) {
    let isCollapsed = false;

    const closeBtn = slidePanel.querySelector(".slide-panel__closer");
    const openModal = slidePanel.querySelector(".slide-panel__trigger");

    const showButton = () => {
      slidePanel.classList.add("active");
    };

    const collapsePanel = () => {
      slidePanel.classList.remove("active");
      slidePanel.classList.add("collapsed");
      isCollapsed = true;
    };

    setTimeout(showButton, 8000);

    closeBtn.addEventListener("click", collapsePanel);
  }
});
