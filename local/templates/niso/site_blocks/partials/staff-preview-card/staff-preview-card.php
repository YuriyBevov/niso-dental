<link rel="stylesheet" href="<?= SITE_TEMPLATE_PATH ?>/site_blocks/partials/staff-preview-card/style.css" />

<div class="staff-preview-card-wrapper">
  <div class="staff-preview-card" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
    <div class="staff-preview-card__header">
      <div class="staff-preview-card__img-wrapper">
        <?
        $resImage = CFile::ResizeImageGet(
          $arItem["DETAIL_PICTURE"],
          array("width" => 360, "height" => 360),
          BX_RESIZE_IMAGE_EXACT
        ); ?>
        <img src="<?= $resImage['src'] ?>" alt="<?= $arItem["NAME"] ?>" width="180" height="200">
      </div>
    </div>
    <div class="staff-preview-card__content">
      <span class="base-subtitle"><?= $arItem["NAME"] ?></span>
      <? if ($arItem["PROPERTIES"]["POSITION"]["VALUE"]): ?>
        <span class="base-text"><?= $arItem["PROPERTIES"]["POSITION"]["VALUE"] ?></span>
      <? endif; ?>
      <? if (!empty($arItem["PROPERTIES"]["DESCR_FIELD"]["~VALUE"])): ?>
        <div class="content">
          <? foreach ($arItem["PROPERTIES"]["DESCR_FIELD"]["~VALUE"] as $arField): ?>
            <strong><?= $arField["SUB_VALUES"]["DESCR_TITLE"]["~VALUE"] ?></strong>
            <?= $arField["SUB_VALUES"]["DESCR_CONTENT"]["~VALUE"]["TEXT"] ?>
          <? endforeach; ?>
        </div>
      <? endif; ?>
    </div>
    <div class="staff-preview-card__footer">
      <button class="main-btn" data-modal-opener="callback-modal">
        <span>Записаться на прием</span>
      </button>
      <a class="main-btn main-btn--outlined" href="<?= $arItem["DETAIL_PAGE_URL"] ?>">
        <span>Подробнее о специалисте</span>
      </a>
    </div>
  </div>
</div>