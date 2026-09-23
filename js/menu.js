const productsGrid = document.querySelector('.products-grid');
const loadMoreButton = document.querySelector('.load-more');

loadMoreButton.addEventListener('click', () => {
  productsGrid.classList.add('products-grid--expanded');
});