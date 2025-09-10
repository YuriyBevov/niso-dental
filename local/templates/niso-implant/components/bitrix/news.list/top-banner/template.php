<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$arItem = $arResult["ITEMS"][0];
$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));

if ($arItem): ?>
  <section
    class="top-banner 
    <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_BANNER_MIN_HEIGHT"] ?>
    <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_BANNER_TYPE"] ?>
    <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_BANNER_TEXT_ALIGN"] ?>
    <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_BANNER_UNDERLAY_TYPE"] ?>
    <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_BANNER_BORDERED"] ?>
    
    "
    style="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ? 'background-image:url(' . $arItem["PREVIEW_PICTURE"]["SRC"] . ')' : null ?>">
    <div class="container">
      <div
        class="top-banner__content 
        <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_BANNER_CONTENT_BORDERED"] ?>
        <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_BANNER_CONTENT_UNDERLAY_TYPE"] ?>
        ">
        <h1><?= $arItem["NAME"] ?></h1>
        <?= $arItem["PREVIEW_TEXT"] ?>
        <button class="main-btn">Заказать обратный звонок</button>
      </div>
    </div>
  </section>
<? endif; ?>