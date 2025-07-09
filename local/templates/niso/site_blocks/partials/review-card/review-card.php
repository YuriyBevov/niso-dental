<?php
global $stylesIncluded;

if (!isset($stylesIncluded['review-card'])) {
  echo '<link rel="stylesheet" href="/local/templates/niso/site_blocks/partials/review-card/style.css">';
  $stylesIncluded['review-card'] = true;
}
?>

<div class="review-card" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
  <div class="review-card__rate">
    <? for ($i = 0; $i < $arItem["PROPERTIES"]["RATE"]["VALUE"]; $i++): ?>
      <svg class="rate-item" width="16" height="16" role="img" aria-hidden="true" focusable="false">
        <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#icon-star' ?>"></use>
      </svg>
    <? endfor; ?>
    <? for ($i = $arItem["PROPERTIES"]["RATE"]["VALUE"]; $i < 5; $i++): ?>
      <svg class="rate-item rate-item--muted" width="16" height="16" role="img" aria-hidden="true" focusable="false">
        <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#icon-star' ?>"></use>
      </svg>
    <? endfor; ?>
  </div>
  <div class=" review-card__author">
    <?= $arItem["NAME"] ?>
  </div>
  <div
    class="review-card__content"
    data-collapsed-text="200"
    data-expanded-text="<?= $arItem["PREVIEW_TEXT"] ?>"
    data-collapsed-btn-text="Читать далее...">
    <?= $arItem["PREVIEW_TEXT"] ?>
  </div>
</div>