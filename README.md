# rsschool-landing-page

Coffee House "Resource" — RS School landing page project.

Pages: `index.html` (home), `menu.html` (menu).

## Part 1
- Semantic, valid markup; adaptive from 1440px to 380px
- Light and dark themes, the choice is saved in `localStorage`

## Part 2 (plain JavaScript, no libraries)
- Burger menu (≤768px)
- Favorite coffee slider on the home page
- Menu categories, cards rendered from `data/products.json`
- "Show more" button (≤768px)
- Product dialog with size and additives, the total price updates on every change

## Running locally
The menu data is loaded with `fetch()`, so open the project through a local server
(for example the VS Code **Live Server** extension), not by double-clicking the file.

## Structure
```
data/products.json  menu data (cards and dialog are built from it)
css/style.css       all styles (tokens for both themes at the top)
js/theme.js         theme switch + localStorage (loaded in <head>)
js/burger.js        burger menu
js/slider.js        favorite coffee slider
js/menu.js          categories, cards, "show more"
js/modal.js         product dialog
assets/             icons and images
```
