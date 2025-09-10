<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<section class="section features --features-type-2 <?= $GLOBALS['TEMPLATE_SETTINGS']["FEATURES_TITLE_COLOR"] ? ' test' : '' ?>">
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
        <div
          class="feature-card
          <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_FEATURE_CARD_UNDERLAY_TYPE"] ?>
          <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_FEATURE_CARD_ALIGN"] ?>
          <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_FEATURE_CARD_BORDERED"] ?>
          <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_FEATURE_CARD_ROUNDED"] ?>"
          style="<?= $arItem["DETAIL_PICTURE"]["SRC"] ? 'background-image:url(' . $arItem["DETAIL_PICTURE"]["SRC"] . ')' : null ?>">
          <? if ($arItem["PREVIEW_PICTURE"]["SRC"]): ?>
            <img src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ?>" alt="<?= $arItem["NAME"] ?>" width="40" height="40">
          <? endif; ?>
          <span class="subtitle <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_FEATURE_TITLE_UNDERLINED"] ?>"><?= $arItem["NAME"] ?></span>
          <? if ($arItem["PREVIEW_TEXT"]): ?>
            <span class="text">
              <?= $arItem["PREVIEW_TEXT"] ?>
            </span>
          <? endif; ?>
        </div>
      <? endforeach; ?>
    </div>
  </div>
</section>