## API
### JS
```
new Sticky(rootEl, config)
```

Create a sticky instance

- param { String | HTMLElement } rootEl - The sticky element's container
- param { Object } config
- param { String | HTMLElement } config.target - The element to stick
- param { Number } config.start - Starting point relative to `rootEl`. Default 0.

```
<div data-o-component="o-sticky" class="o-nav" data-o-sticky-target=".demo-target">
    <div class="demo-target">Navigation. Global sticky.</div>
</div>
```
```
const stickyNav = new Sticky('.o-nav');
```
HTML attribute `data-o-sticky-target` specifies the target element. You can alose specify it in the constructor's `config`. `config.target` will take precedence.

Or use `Sticky.init(el, config)` to initialize all instance of sticky on the page.

### SCSS
```
@include oStickyBase ($offset: 0, $bounded: true)
```
- @param {Number} $offset - Sticky start point. Same as JS constructor's config.start.
- @param {Boolean} $bounded - Whether sticky takes effect only in the parent container. For elements like navigation, use `false`.