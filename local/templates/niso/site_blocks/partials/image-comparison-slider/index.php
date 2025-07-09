<?php
global $stylesIncluded;

if (!isset($stylesIncluded['image-comparison-slider'])) {
  echo '<link rel="stylesheet" href="/local/templates/niso/site_blocks/partials/image-comparison-slider/style.css">';
  $stylesIncluded['image-comparison-slider'] = true;
}
?>

<div class="image-comparison" data-component="image-comparison-slider">
  <div class="image-comparison__slider-wrapper">
    <label for="image-comparison-range" class="image-comparison__label">
      <input type="range" min="0" max="100" value="50" class="image-comparison__range" id="image-compare-range" data-image-comparison-range="">
    </label>

    <div class="image-comparison__image-wrapper  image-comparison__image-wrapper--overlay" data-image-comparison-overlay="">
      <figure class="image-comparison__figure image-comparison__figure--overlay">
        <img src="<?= $pathBefore ?>" alt="<?= $arItem["NAME"] ?>" class="image-comparison__image">
        <figcaption class="image-comparison__caption image-comparison__caption--before">
          <span class="image-comparison__caption-body">До</span>
        </figcaption>
      </figure>
    </div>
    <div class="image-comparison__slider" data-image-comparison-slider="">
      <span class="image-comparison__thumb" data-image-comparison-thumb="">
        <svg width="18" height="10" role="img" aria-hidden="true" focusable="false">
          <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-swipe"></use>
        </svg>
      </span>
    </div>
    <div class="image-comparison__image-wrapper">
      <figure class="image-comparison__figure">
        <img src="<?= $pathAfter ?>" alt="<?= $arItem["NAME"] ?>" class="image-comparison__image">
        <figcaption class="image-comparison__caption image-comparison__caption--after">
          <span class="image-comparison__caption-body">После</span>
        </figcaption>
      </figure>
    </div>
  </div>
</div>