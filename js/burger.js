/**
 * Burger menu (screens up to 768px).
  
 */
(function initBurger() {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');

  if (!header || !burger || !nav) {
    return;
  }

  const desktopQuery = window.matchMedia('(min-width: 769px)');

  function isOpen() {
    return burger.getAttribute('aria-expanded') === 'true';
  }

  function openMenu() {
    header.classList.add('header--menu-open');
    nav.classList.add('nav--open');
    document.body.classList.add('scroll-lock');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    header.classList.remove('header--menu-open');
    nav.classList.remove('nav--open');
    document.body.classList.remove('scroll-lock');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  burger.addEventListener('click', () => {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a') && isOpen()) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      closeMenu();
      burger.focus();
    }
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) {
      closeMenu();
    }
  });
})();
