<?php
global $stylesIncluded;

if (!isset($stylesIncluded['base-card'])) {
  echo '<link rel="stylesheet" href="/local/templates/niso/site_blocks/partials/base-card/style.css">';
  $stylesIncluded['base-card'] = true;
}
?>

<div class="base-card-wrapper">
  <div class="base-card" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">

    <?
    if (!$hideImg && $arItem["PREVIEW_PICTURE"]["SRC"]):
      $resImage = CFile::ResizeImageGet(
        $arItem["PREVIEW_PICTURE"],
        array("width" => 600, "height" => 400),
        BX_RESIZE_IMAGE_EXACT
      );
    ?>
      <img src="<?= $resImage['src'] ?>" alt="<?= $arItem["NAME"] ?>" width="480" height="240">
    <?
      $hideImg = false;
    endif; ?>

    <div class="base-card__content">

      <? if ($arItem["DATE_ACTIVE_TO"]) {
        $dateActiveTo = strtotime($arItem["DATE_ACTIVE_TO"]);
        $now = time();
      } ?>
      <? if ($arItem["DATE_ACTIVE_TO"]): ?>
        <small class="base-card__headline">
          <? if ($dateActiveTo < $now): ?>
            Срок акции вышел
          <? else: ?>
            Действует до <?= $arItem["DATE_ACTIVE_TO"] ?>г.
          <? endif; ?>
        </small>
      <? endif; ?>
      <span class="base-subtitle"><?= $arItem["NAME"] ?></span>

      <? if ($arItem["DISPLAY_PROPERTIES"]["PRICE"]["VALUE"]): ?>
        <div class="price-badge"><span><?= $arItem["DISPLAY_PROPERTIES"]["PRICE"]["VALUE"] ?> руб.</span></div>
      <? endif; ?>
      <span class="base-text"><?= $arItem["PREVIEW_TEXT"] ?></span>
      <a class="main-btn" href="<?= $arItem["DETAIL_PAGE_URL"] ?>">
        <span>Подробнее</span>
      </a>
    </div>
  </div>
</div>