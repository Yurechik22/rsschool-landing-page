/**
 * Menu page: category tabs and the "show more" button.
 
 */
(function initMenu() {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panel = document.querySelector('.products');

  if (!tabs.length || !panel || typeof PRODUCTS === 'undefined') {
    return;
  }

  const list = panel.querySelector('.products__list');
  const moreButton = panel.querySelector('.products__more');
  const VISIBLE_ON_SMALL_SCREENS = 4;

  function createCard(product) {
    const item = document.createElement('li');
    item.className = 'products__item';

    item.innerHTML = `
      <article class="product-card">
        <div class="product-card__media">
          <img class="product-card__img" src="./assets/img/menu/${product.image}"
            alt="${product.name}" width="310" height="310">
        </div>
        <div class="product-card__body">
          <h2 class="product-card__title">${product.name}</h2>
          <p class="product-card__text">${product.description}</p>
          <p class="product-card__price">$${product.price}</p>
        </div>
      </article>
    `;

    return item;
  }

  function renderCategory(category) {
    const products = PRODUCTS.filter((product) => product.category === category);

    list.replaceChildren(...products.map(createCard));

    panel.classList.remove('products--expanded');
    moreButton.hidden = products.length <= VISIBLE_ON_SMALL_SCREENS;
  }

  function selectTab(tab) {
    tabs.forEach((item) => {
      const isSelected = item === tab;

      item.classList.toggle('tab--active', isSelected);
      item.setAttribute('aria-selected', String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;
    });

    panel.setAttribute('aria-labelledby', tab.id);
    renderCategory(tab.dataset.category);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (!tab.classList.contains('tab--active')) {
        selectTab(tab);
      }
    });

    tab.addEventListener('keydown', (event) => {
      let nextIndex = null;

      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;

      if (nextIndex !== null) {
        event.preventDefault();
        tabs[nextIndex].focus();
        selectTab(tabs[nextIndex]);
      }
    });
  });

  moreButton.addEventListener('click', () => {
    panel.classList.add('products--expanded');
    moreButton.hidden = true;
  });

  // Initial state: the coffee cards are already in the HTML
  const activeTab = tabs.find((tab) => tab.classList.contains('tab--active')) || tabs[0];
  selectTab(activeTab);
})();
