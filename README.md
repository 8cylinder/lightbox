
# image-lightbox

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

<dt><code style="font-style:normal">src</code></dt>
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
<dd>if any value is used, the image-lightbox will be disabled.</dd>
</dl>

```html
<image-lightbox src="a/bigger/image.jpg" min-width="300" disabled="disabled">
  <img src="somewhere/over/the/rainbow.jpg">
</image-lightbox>
```
