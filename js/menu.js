/**
 * Menu page: category tabs, product cards and the "show more" button.
 *
 * - all cards are created here from data/products.json (nothing is duplicated in HTML);
 * - after loading or reloading the page the first category (Coffee) is active;
 * - on screens up to 768px only the first 4 cards are shown (see CSS),
 *   the round button reveals the rest and then hides itself;
 * - a click on any part of a card opens the product dialog (js/modal.js).
 *
 * Note: the data is loaded with fetch(), so the page has to be opened
 * through a web server (GitHub Pages, VS Code Live Server), not as a file.
 */
(function initMenu() {
  const DATA_URL = './data/products.json';
  const VISIBLE_ON_SMALL_SCREENS = 4;

  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panel = document.querySelector('.products');

  if (!tabs.length || !panel) {
    return;
  }

  const list = panel.querySelector('.products__list');
  const status = panel.querySelector('.products__status');
  const moreButton = panel.querySelector('.products__more');

  let products = [];
  let visibleProducts = [];

  function escapeHtml(text) {
    const replacements = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    };

    return String(text).replace(/[&<>"']/g, (char) => replacements[char]);
  }

  function createCard(product, index) {
    const item = document.createElement('li');
    item.className = 'products__item';

    // The button inside the title stretches over the whole card (see CSS),
    // so a click on any part of the card opens the dialog.
    item.innerHTML = `
      <article class="product-card">
        <div class="product-card__media">
          <img class="product-card__img" src="${escapeHtml(product.image)}"
            alt="${escapeHtml(product.name)}" width="310" height="310">
        </div>
        <div class="product-card__body">
          <h2 class="product-card__title">
            <button class="product-card__button" type="button" aria-haspopup="dialog"
              data-index="${index}">${escapeHtml(product.name)}</button>
          </h2>
          <p class="product-card__text">${escapeHtml(product.description)}</p>
          <p class="product-card__price">$${escapeHtml(product.price)}</p>
        </div>
      </article>
    `;

    return item;
  }

  function renderCategory(category) {
    visibleProducts = products.filter((product) => product.category === category);

    list.replaceChildren(...visibleProducts.map(createCard));

    panel.classList.remove('products--expanded');
    moreButton.hidden = visibleProducts.length <= VISIBLE_ON_SMALL_SCREENS;
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

  function showStatus(message) {
    status.textContent = message;
    status.hidden = false;
    moreButton.hidden = true;
  }

  // --- Events ---

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (!tab.classList.contains('tab--active')) {
        selectTab(tab);
      }
    });

    // Arrow keys move between tabs, as recommended for role="tablist"
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

  list.addEventListener('click', (event) => {
    const button = event.target.closest('.product-card__button');

    if (button && window.ProductModal) {
      window.ProductModal.open(visibleProducts[Number(button.dataset.index)], button);
    }
  });

  // --- Start ---

  moreButton.hidden = true;

  fetch(DATA_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      products = data;
      selectTab(tabs[0]);
    })
    .catch((error) => {
      console.error('Menu data could not be loaded:', error);
      showStatus('The menu could not be loaded. Please reload the page.');
    });
})();
