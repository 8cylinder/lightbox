<?php

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Hello, world!</title>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="description" content=""/>
  <link rel="icon" href="favicon.png">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
      nav {
          background: gray;
          height: 4rem;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          position: sticky;
          width: 100%;
          top: 0;
      }
  </style>
</head>
<body class="">
<nav>This is a sticky nav.</nav>
<div class="m-8 flex flex-wrap gap-8">

    <?php
    $images = [
        'image-a.jpg',
        'image-b.jpg',
        'image-c.jpg',
        'image-d.jpg',
        'image-e.jpg',
        'image-f.jpg',
        'image-g.jpg',
        'image-h.jpg',
        'image-i.jpg',
    ];

    $attributes = [
        'disabled="disabled"',
        'disabled=""',
        'src=""',
        'src="::pop_image::"',
        'src="::pop_image::"',
        'src="::pop_image::"',
        'disable-under=""',
        'debug="templates"',
        '',
        '',
        '',
        '',
        '',
    ];

    function rand_items($a, $max = 3)
    {
        $count = rand(0, $max);
        $b = [];
        for($i = 0; $i <= $count; $i++){
            $index = array_rand($a);
            $b[] = $a[$index];
            unset($a[$index]);
        }
        return $b;
    }

    ?>

    <?php # make 10 images
    for($i = 0; $i <= 9; $i++):
        $image = $images[array_rand($images)];
        $pop_image = $images[array_rand($images)];
        $raw_attribute = rand_items($attributes);
        $attribute = implode(' ', array_unique($raw_attribute));
        $attribute = str_replace('::pop_image::', $pop_image, $attribute);

        ?>
      <div>
        <lc-lightbox <?= $attribute ?>>
          <img class="max-w-lg w-full border-4 border-pink-400"
               src="<?= $image ?>"
               alt=""/>
        </lc-lightbox>
        <div><?= $attribute ?></div>
        <!-- <div><?= implode(' | ', $raw_attribute); ?></div> -->
      </div>

    <?php endfor; ?>

</div>
<!-- If a template with an id of low-cal-template exists, it will be used -->
<template id="XXXXlow-cal-template">
  <!-- lightbox template -->
  <style>
    :host{
      --image-border-width: 1rem;
      --dialog-padding: 1rem;
      overflow: hidden;
    }
    body{
      overflow: hidden;
    }
    *{
      box-sizing: border-box;
    }
    dialog:focus-visible{
      outline: none;
    }
    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.9);
    }
    dialog {
      cursor: zoom-out;
      padding: var(--image-border-width);
      border: none;
      margin: auto;
    }
    img {
        max-height:  calc(100vh - var(--image-border-width) - 60px);
        max-width: 100%;
        background-color: white;
    }
    dialog, ::backdrop {
      transition:
        display 10s allow-discrete,
        overlay 10s allow-discrete,
        opacity 10s;
      opacity: 0;
    }
    /* IN */
    [open], [open]::backdrop {
      opacity: 1;
    }

    /* OUT */
    @starting-style {
      [open], [open]::backdrop {
        opacity: 0;
      }
    }
  </style>
  <slot></slot>
  <dialog class="container">
    <img class="image">
  </dialog>
  <!-- /lightbox template -->
</template>

<script type="module">
  import { LCLightbox } from './lc-lightbox.js';
</script>

<!-- <script src="lc-lightbox.js"></script>-->
</body>
</html>
