<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<div class="review-card" id=<?= ($arParams["ID"] ? $arParams["ID"] : "") ?>>
  <div class="review-card__rate">
    <? for ($i = 0; $i < $arResult["PROPERTIES"]["RATE"]["VALUE"]; $i++): ?>
      <svg class="rate-item" width="16" height="16" role="img" aria-hidden="true" focusable="false">
        <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#icon-star' ?>"></use>
      </svg>
    <? endfor; ?>
    <? for ($i = $arResult["PROPERTIES"]["RATE"]["VALUE"]; $i < 5; $i++): ?>
      <svg class="rate-item rate-item--muted" width="16" height="16" role="img" aria-hidden="true" focusable="false">
        <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#icon-star' ?>"></use>
      </svg>
    <? endfor; ?>
  </div>
  <div class=" review-card__author">
    <?= $arResult["NAME"] ?>
  </div>
  <div class="review-card__content">
    <?= $arResult["PREVIEW_TEXT"] ?>
  </div>
</div>