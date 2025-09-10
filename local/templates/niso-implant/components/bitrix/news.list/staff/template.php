<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<section class="section staff --grid-view-type-2">
  <div class="container">
    <?
    $APPLICATION->IncludeFile(
      SITE_TEMPLATE_PATH . "/includes/section-header.php",
      array("TITLE" => $arResult["NAME"], "DESCRIPTION" => $arResult["DESCRIPTION"]),
      array("MODE" => "html", "SHOW_BORDER" => false)
    );
    ?>
    <div class="grid">
      <? foreach ($arResult["ITEMS"] as $arItem): ?>
        <div class="staff-card --filled --bordered --rounded --img-rounded --align-center">
          <img src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ?>" alt="<?= $arItem["NAME"] ?>" width="400" height="400">
          <span class="subtitle">
            <?= $arItem["NAME"] ?>
          </span>
          <? if ($arItem["PROPERTIES"]["STAFF_ROLE"]["VALUE"]): ?>
            <strong class="staff-card__role">
              <?= $arItem["PROPERTIES"]["STAFF_ROLE"]["VALUE"] ?>
            </strong>
          <? endif; ?>

          <? if ($arItem["PREVIEW_TEXT"]): ?>
            <button class="main-btn">Подробнее</button>
            <!-- <span class="features__item-text">
              <?= $arItem["PREVIEW_TEXT"] ?>
            </span> -->
          <? endif; ?>
        </div>
      <? endforeach; ?>
    </div>
  </div>
</section>