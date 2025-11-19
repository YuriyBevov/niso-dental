const accordeons = document.querySelectorAll('.accordeon');

if (accordeons) {
  accordeons.forEach((accordeon) => {
    const items = accordeon.querySelectorAll('.accordeon-header');

    items.forEach((item) => {
      item.addEventListener('click', () => {
        item.parentNode.classList.toggle('expanded');
      });
    });
  });
}
