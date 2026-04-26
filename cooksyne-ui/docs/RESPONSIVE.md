Responsive patterns

Overview

This project uses a small, consistent responsive system located in `src/styles/_breakpoints.scss` and `src/styles/_responsive-patterns.scss`.

Key mixins

- `@include xs`, `@include sm`, `@include md`, `@include lg`, `@include xl` — target exact breakpoint ranges.
- `@include sm-up`, `md-up`, `lg-up`, `xl-up` — minimum-width variants.
- `@include sm-down`, `md-down`, `lg-down` — maximum-width variants.
- Orientation helpers: `@include portrait`, `@include landscape`, plus combined helpers like `@include md-portrait`.

Patterns

- `@mixin vertical-fill($toolbar-height: 64px)`
  - Use on a page container (e.g. `.page-container`) to make the page fill the viewport on phones/tablets and revert to intrinsic height on desktop.
  - Example:

```scss
@use 'styles/responsive-patterns' as patterns;

.page-container {
  @include patterns.vertical-fill(64px);
}
```

- `@mixin section-hero-grid(...)`
  - Helper for building hero-style grids. You can also implement your own grid using the `portrait` / `landscape` mixins.

Recommended usage

- For every top-level page container, include `@include patterns.vertical-fill(...)` so tall portrait devices (iPad Pro, Surface Pro, phones) display more vertical, feed-like layouts.
- For components that render lists or cards, prefer CSS Grid with portrait/landscape variants, e.g.:

```scss
@use 'styles/breakpoints' as *;

.lists {
  @include portrait {
    grid-template-columns: 1fr;
  }
  @include landscape {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Why this helps

- Tall portrait devices (iPad Pro / Surface Pro vertical) get a single-column, larger-card layout that fills the screen and avoids awkward whitespace.
- Landscape / desktop devices preserve denser multi-column layouts.

When to tune

- Thumb heights and padding are intentionally generous for portrait tall screens; tune values in component SCSS where necessary.
- If a page has a primary content area + a sidebar, consider keeping the primary area `vertical-fill` and letting the sidebar be intrinsic.

If you'd like, I can:

- Apply `vertical-fill` to any other pages/components you specify.
- Run the app locally and test typical device sizes (I can provide commands and steps).
