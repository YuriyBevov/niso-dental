<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<section class="features section<?= $GLOBALS['TEMPLATE_SETTINGS']["FEATURES_TITLE_COLOR"] ? ' test' : '' ?>">
  <div class="container">
    <div class="grid">
      <? foreach ($arResult["ITEMS"] as $arItem): ?>
        <?= $arItem["NAME"] ?>
      <? endforeach; ?>
    </div>
  </div>
</section>