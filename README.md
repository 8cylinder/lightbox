
# image-lightbox

A simple lightbox for a single image.

With no attributes, the image src will be used for the lightbox
image.

```html
<image-lightbox>
  <img src="somewhere/over/the/rainbow.jpg">
</image-lightbox>
```

Optional attributes are:

**src**

An alternative image to use for the lightbox image.  Mostly
so a larger image can be used for the lightbox images.

**min-width** (default 640):

the min width the lightbox will work.  This is so it is disabled
for mobile where this isn't necessary.

**disabled:**

if any value is used, the image-lightbox will be disabled.

```html
<image-lightbox src="a/bigger/image.jpg" min-width="300" disabled="dis
  <img src="somewhere/over/the/rainbow.jpg">
</image-lightbox>
```