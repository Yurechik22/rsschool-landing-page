# rsschool-landing-page

Coffee House "Resource" — RS School landing page project.

Pages: `index.html` (home), `menu.html` (menu).

- Semantic, valid markup; adaptive from 1440px to 380px
- Light and dark themes, the choice is saved in `localStorage`
- Burger menu, favorite coffee slider, menu tabs and "show more" — plain JavaScript

## Structure

```
css/style.css      all styles (tokens for both themes at the top)
js/theme.js        theme switch + localStorage (loaded in <head>)
js/burger.js       burger menu (≤768px)
js/slider.js       favorite coffee slider (home page)
js/products.js     menu data
js/menu.js         category tabs and "show more" (menu page)
assets/            icons and images
```
