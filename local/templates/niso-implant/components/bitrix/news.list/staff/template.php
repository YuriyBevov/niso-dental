<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<section class="section staff  <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_STAFF_GRID_TYPE"] ?>">
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

        <div class="staff-card-container">
          <div class="
          staff-card
          <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_STAFF_CARD_IMG_ROUNDED"] ?>
          <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_STAFF_CARD_FILLED"] ?>
          <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_STAFF_CARD_ALIGN"] ?>
          <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_STAFF_CARD_BORDERED"] ?>
          <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_STAFF_CARD_ROUNDED"] ?>">
            <img src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ?>" alt="<?= $arItem["NAME"] ?>" width="400" height="400">
            <div class="staff-card__content">
              <span class="subtitle">
                <?= $arItem["NAME"] ?>
              </span>
              <? if ($arItem["PROPERTIES"]["STAFF_ROLE"]["VALUE"]): ?>
                <strong class="staff-card__role">
                  <?= $arItem["PROPERTIES"]["STAFF_ROLE"]["VALUE"] ?>
                </strong>
              <? endif; ?>

              <? if ($arItem["PREVIEW_TEXT"]): ?>
                <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_STAFF_GRID_TYPE"] !== '--grid-view-type-3'): ?>
                  <button class="main-btn">Подробнее</button>
                <? endif; ?>
                <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_STAFF_GRID_TYPE"] == '--grid-view-type-3'): ?>
                  <div class="content-block">
                    <?= $arItem["PREVIEW_TEXT"] ?>
                  </div>
                <? endif; ?>

              <? endif; ?>
            </div>
          </div>
        </div>
      <? endforeach; ?>
    </div>
  </div>
</section>