BX.ready(function () {
  const widget = document.querySelector(".side-widget");

  if (widget) {
    const onClickOpenWidget = () => {
      widget.classList.add("active");

      widget.removeEventListener("click", onClickOpenWidget);
      widget.addEventListener("click", onClickCloseWidget);
    };

    const onClickCloseWidget = () => {
      widget.classList.add("closing");
      widget.classList.remove("active");

      widget.removeEventListener("click", onClickCloseWidget);

      setTimeout(() => {
        widget.classList.remove("closing");
        widget.addEventListener("click", onClickOpenWidget);
      }, 400);
    };

    widget.addEventListener("click", onClickOpenWidget);
  }
});
