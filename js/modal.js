/**
 * Product dialog on the menu page.
 *
 * Built on the native <dialog> element:
 * - opens centered over a dark backdrop (showModal);
 * - closes with the Close button, a click on the backdrop or Escape;
 *   a click inside the window does not close it;
 * - page scrolling is locked while the dialog is open.
 *
 * Options:
 * - Size: exactly one can be chosen (radio buttons), S is selected on open;
 * - Additives: any number can be chosen (checkboxes);
 * - Total = base price + size price + prices of the chosen additives,
 *   recalculated on every change.
 *
 * The dialog is filled from the same product object as the card.
 */
(function initProductModal() {
  const dialog = document.querySelector('.modal');

  if (!dialog) {
    return;
  }

  let currentProduct = null;
  let openerButton = null;
  let pointerDownOnBackdrop = false;

  function escapeHtml(text) {
    const replacements = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    };

    return String(text).replace(/[&<>"']/g, (char) => replacements[char]);
  }

  function formatPrice(value) {
    return `$${value.toFixed(2)}`;
  }

  function createSizeOptions(sizes) {
    return Object.entries(sizes)
      .map(([key, option], index) => `
        <label class="option">
          <input class="option__input" type="radio" name="size" value="${escapeHtml(key)}"
            data-price="${escapeHtml(option['add-price'])}"${index === 0 ? ' checked' : ''}>
          <span class="option__body">
            <span class="option__badge" aria-hidden="true">${escapeHtml(key.toUpperCase())}</span>
            <span>${escapeHtml(option.size)}</span>
          </span>
        </label>
      `)
      .join('');
  }

  function createAdditiveOptions(additives) {
    return additives
      .map((additive, index) => `
        <label class="option">
          <input class="option__input" type="checkbox" name="additives" value="${escapeHtml(additive.name)}"
            data-price="${escapeHtml(additive['add-price'])}">
          <span class="option__body">
            <span class="option__badge" aria-hidden="true">${index + 1}</span>
            <span>${escapeHtml(additive.name)}</span>
          </span>
        </label>
      `)
      .join('');
  }

  function render(product) {
    dialog.setAttribute('aria-labelledby', 'modal-title');

    dialog.innerHTML = `
      <div class="modal__window">
        <div class="modal__media">
          <img class="modal__img" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}"
            width="310" height="310">
        </div>

        <form class="modal__content" method="dialog">
          <h2 class="modal__title" id="modal-title">${escapeHtml(product.name)}</h2>
          <p class="modal__text">${escapeHtml(product.description)}</p>

          <fieldset class="modal__group">
            <legend class="modal__label">Size</legend>
            <div class="modal__options">${createSizeOptions(product.sizes)}</div>
          </fieldset>

          <fieldset class="modal__group">
            <legend class="modal__label">Additives</legend>
            <div class="modal__options">${createAdditiveOptions(product.additives)}</div>
          </fieldset>

          <p class="modal__total">
            <span>Total:</span>
            <output class="modal__price" aria-live="polite"></output>
          </p>

          <p class="modal__note">
            <svg class="icon modal__note-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor"/>
              <path d="M8 7.25V11" stroke="currentColor" stroke-linecap="round"/>
              <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
            </svg>
            <span>
              The cost is not final. Download our mobile app to see the final price and place your order.
              Earn loyalty points and enjoy your favorite coffee with up to 20% discount.
            </span>
          </p>

          <button class="modal__close" type="submit">Close</button>
        </form>
      </div>
    `;
  }

  function updateTotal() {
    const form = dialog.querySelector('.modal__content');
    const chosen = form.querySelectorAll('.option__input:checked');

    let total = Number(currentProduct.price);

    chosen.forEach((input) => {
      total += Number(input.dataset.price);
    });

    dialog.querySelector('.modal__price').textContent = formatPrice(total);
  }

  function open(product, opener) {
    if (!product) {
      return;
    }

    currentProduct = product;
    openerButton = opener || null;

    render(product);
    updateTotal();

    document.body.classList.add('scroll-lock');
    dialog.showModal();
  }

  // Any change of size or additives recalculates the total
  dialog.addEventListener('change', (event) => {
    if (event.target.matches('.option__input')) {
      updateTotal();
    }
  });

  // Backdrop click: the <dialog> element itself only receives clicks
  // outside .modal__window, because the window fills the whole dialog box.
  // Both pointerdown and click must happen on the backdrop, so selecting
  // text inside the window and releasing outside does not close it.
  dialog.addEventListener('pointerdown', (event) => {
    pointerDownOnBackdrop = event.target === dialog;
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && pointerDownOnBackdrop) {
      dialog.close();
    }
  });

  // Escape is handled by the browser (it fires "cancel" and closes the dialog).
  // "close" fires for every way of closing: button, backdrop, Escape.
  dialog.addEventListener('close', () => {
    document.body.classList.remove('scroll-lock');

    if (openerButton) {
      openerButton.focus({ preventScroll: true });
    }
  });

  window.ProductModal = { open };
})();
