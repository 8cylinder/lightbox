<?php

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Hello, world!</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="description" content="" />
    <link rel="icon" href="favicon.png">
    <script src="https://cdn.tailwindcss.com"></script>
  </head>

  <body class="m-8 flex flex-wrap gap-8">

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
         '',
         '',
         '',
         '',
         '',
       ];

       function rand_items($a, $max=3){
         $count = rand(0, $max);
         $b = [];
         for($i=0; $i<=$count; $i++){
           $index = array_rand($a);
           $b[] = $a[$index];
           unset($a[$index]);
         }
         return $b;
       }
    ?>

    <?php for($i=0; $i<=9; $i++):
       $image = $images[array_rand($images)];
       $pop_image = $images[array_rand($images)];
       $raw_attribute = rand_items($attributes);
       $attribute = implode(' ', array_unique($raw_attribute));
       $attribute = str_replace('::pop_image::', $pop_image, $attribute);

    ?>
      <div>
        <lc-lightbox <?= $attribute ?>>
          <img class="max-w-lg w-full border-4 border-pink-400" src="<?= $image ?>" />
        </lc-lightbox>
        <div><?= $attribute ?></div>
        <!-- <div><?= implode(' | ', $raw_attribute); ?></div> -->
      </div>

    <?php endfor; ?>


    <template id="low-cal-template">
      <style>
        *{
          box-sizing: border-box;
        }
        .container{
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
        .showing{
          opacity: 1;
        }
        img{
          border: 10px solid white;
        }
      </style>
      <slot></slot>
      <div class="container">
        <img class="image">
      </div>
    </template>

    <script src="lc-lightbox.js"></script>
  </body>
</html>
