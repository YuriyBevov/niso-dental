<?php
global $stylesIncluded;

if (!isset($stylesIncluded['review-card'])) {
  echo '<link rel="stylesheet" href="/local/templates/niso/site_blocks/partials/review-card/style.css">';
  $stylesIncluded['review-card'] = true;
}
?>

<div class="review-card__container" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
  <article class="review-card">
    <div class="review-card__header">
      <div class="review-card__rating">
        <? for ($i = 0; $i < 5; $i++): ?>
          <svg class="review-card__rating-item <?= $i < (int)$arItem["PROPERTIES"]["RATE"]["VALUE"] ? "active" : "" ?>" width="22" height="22" role="img" aria-hidden="true" focusable="false">
            <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#icon-star' ?>"></use>
          </svg>
        <? endfor; ?>
      </div>
      <div class="review-card__author">
        <img class="review-card__photo" src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ?? SITE_TEMPLATE_PATH . "/assets/img/customer-image.jpg" ?>" alt="<?= $arItem["PREVIEW_PICTURE"]["DESCRIPTION"] ?? $arItem["NAME"] ?>" width="46" height="46">
        <div class="review-card__info">
          <span class=" review-card__name"> <?= $arItem["NAME"] ?></span>
          <? if (!empty($arItem['DISPLAY_ACTIVE_FROM'])): ?>
            <span class="review-card__date"><?= $arItem['DISPLAY_ACTIVE_FROM'] ?></span>
          <? endif; ?>
        </div>
      </div>
    </div>
    <div
      class="review-card__content"
      data-collapsed-text="200"
      data-expanded-text="<?= $arItem["PREVIEW_TEXT"] ?>"
      data-collapsed-btn-text="Показать полностью...">
      <?= $arItem["PREVIEW_TEXT"] ?>
    </div>
  </article>
</div>