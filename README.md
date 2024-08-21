
# 🥕 Low-cal Lightbox

A simple lightbox for a single image.  To use, wrap your image tag
with `<lc-lightbox></lc-lightbox>` tags.  Now you can click the
image to get a lightbox view of that image.

With no attributes, the image src will be used for the lightbox
image.

```html
<lc-lightbox>
  <img src="somewhere/over/the/rainbow.jpg">
</lc-lightbox>
```

### Attributes

Optional attributes are:

#### `src`

An alternative image to use for the lightbox image.  Mostly
so a larger image can be used for the lightbox images.

#### `min-width`

The min width the lightbox will work. This is so it is disabled 
for mobile where this isn't necessary.

Note this is set when the page loads, so if the window is resized the
behavior may not be as expected.

The default is 640px.

#### `disabled`

If any value is used, the lc-lightbox will be disabled.

#### `debug="templates"`  

This will output rendered templates.


```html
<lc-lightbox src="a/bigger/image.jpg" min-width="300" disabled="1" debug="templates">
  <img src="somewhere/over/the/rainbow.jpg">
</lc-lightbox>
```

### Custom template

If further customization needs to be done, add a `<template>` to the
document and give it an id of `low-cal-template`.  This will override
the default one.  It should be added before the script tag.

You can get the default template by adding `debug="templates"` to the
lc-lightbox tag.  This will output the rendered templates to the 
console, which you can copy and paste into the html file.

### Data attribute

When the lightbox is shown, the tag will have a `data-lc-open="open"`
attribute.  For example, this can be used in css to add an 
`overflow: clip` to to the body to prevent scrolling.

## Dev

- `npm run build`
- `npm pack lc-lightbox/` – The trailing slash is required.
- `npm login`
- `npm publish lc-lightbox`


--------------------------------------

Images from https://unsplash.com
