
# 📺 `<image-lightbox>`

A simple lightbox for a single image.  To use, wrap your image tag
with `<image-lightbox></image-lightbox>` tags.  Now you can click the
image to get a lightbox view of that image.

With no attributes, the image src will be used for the lightbox
image.

```html
<image-lightbox>
  <img src="somewhere/over/the/rainbow.jpg">
</image-lightbox>
```

Optional attributes are:

<dl>

<dt><code>src</code></dt>
<dd>
An alternative image to use for the lightbox image.  Mostly
so a larger image can be used for the lightbox images.
</dd>

<dt><code>min-width</code></dt>
<dd>
<p>The min width the lightbox will work.  This is so it is disabled
for mobile where this isn't necessary.</p>

The default is 640px.
</dd>

<dt><code>disabled</code></dt>
<dd>If any value is used, the image-lightbox will be disabled.</dd>

<dt><code>debug="templates"</code></dt>
<dd>This will output rendered templates.</dd>
</dl>


```html
<image-lightbox src="a/bigger/image.jpg" min-width="300" disabled="1" debug="templates">
  <img src="somewhere/over/the/rainbow.jpg">
</image-lightbox>
```

If futher customization needs to be done, add a `<template>` to the
document and give it an id of `lightbox-template`.  This will override
the default one.  It should be added before the script tag.

This example is the the same as the default one, except it adds a
white border around the lightbox image.

```css
<template id="lightbox-template">
  <style>
    *{
      box-sizing: border-box;
    }
    .lightbox-container{
      display: none;
      place-content: center;
      cursor: zoom-out;
      position: fixed;
      top: 0;
      left: 0;
      height: 100dvh;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      padding: 2rem;
      opacity: 0;
      transition: opacity 0.3s;
      & img{
        max-height: 100%;
        max-width: 100%;
        margin: auto;
        background-color: white;
      }
    }
    .lightbox-showing{
      opacity: 1;
    }
    img{
      border: 10px solid white;
    }
  </style>
  <slot></slot>
  <div class="lightbox-container">
    <img class="lightbox-image">
  </div>
</template>
```