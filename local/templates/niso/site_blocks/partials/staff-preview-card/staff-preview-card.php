<?php
global $stylesIncluded;

if (!isset($stylesIncluded['staff-preview-card'])) {
  echo '<link rel="stylesheet" href="/local/templates/niso/site_blocks/partials/staff-preview-card/style.css">';
  $stylesIncluded['staff-preview-card'] = true;
}
?>

<?php
$experienceText = '';

if (!empty($arItem['ACTIVE_FROM'])) {
  $timestamp = MakeTimeStamp($arItem['ACTIVE_FROM']);

  if ($timestamp) {
    $currentYear = (int) date('Y');
    $activeFromYear = (int) date('Y', $timestamp);
    $experience = max(0, $currentYear - $activeFromYear);

    if ($experience === 1) {
      $experienceText = '1 год';
    } elseif ($experience === 0) {
      $experienceText = "менее года";
    } elseif ($experience >= 2 && $experience <= 4) {
      $experienceText = $experience . ' года';
    } else {
      $experienceText = $experience . ' лет';
    }
  }
}
?>

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
        <? if (!empty($arItem["PROPERTIES"]["JOB_TITLE"]["VALUE"]) || $experienceText !== '' || !empty($arItem["PROPERTIES"]["RATING"]["VALUE"])): ?>
          <div class="staff-preview-card__labels">
            <? if (!empty($arItem["PROPERTIES"]["JOB_TITLE"]["VALUE"])): ?>
              <span class="staff-preview-card__label staff-preview-card__label--job"><?= $arItem["PROPERTIES"]["JOB_TITLE"]["VALUE"] ?></span>
            <? endif; ?>
            <? if ($experienceText !== ''): ?>
              <span class="staff-preview-card__label staff-preview-card__label--experience">Стаж <?= $experienceText ?>
              </span>
            <? endif; ?>
            <? if (!empty($arItem["PROPERTIES"]["RATING"]["VALUE"])): ?>
              <span class="staff-preview-card__label staff-preview-card__label--rating">
                <svg width="15" height="15" role="img" aria-hidden="true" focusable="false">
                  <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-star"></use>
                </svg>
                </label>
                <span>Рейтинг <?= $arItem["PROPERTIES"]["RATING"]["VALUE"] ?></span>
              </span>
            <? endif; ?>
          </div>
        <? endif; ?>
      </div>
    </div>
    <div class=" staff-preview-card__content">
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
      <button class="main-btn" data-modal-opener="callback-modal" data-doctor-name="<?= $arItem["NAME"] ?>">
        <span>Записаться на прием</span>
      </button>
      <a class="main-btn main-btn--outlined" href="<?= $arItem["DETAIL_PAGE_URL"] ?>">
        <span>Подробнее о специалисте</span>
      </a>
    </div>
  </div>
</div>