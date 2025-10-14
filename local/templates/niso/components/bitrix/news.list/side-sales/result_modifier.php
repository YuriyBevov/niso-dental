<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

if(($arParams["CUSTOM_IS_HEAD_SALE_BLOCK"] ?? '') === 'Y') {
  $arResult["ITEMS"] = array_filter($arResult["ITEMS"], function ($arItem) {
    return ($arItem["PROPERTIES"]["SHOW_IN_HEAD_SECTION"]["VALUE"] ?? '') === 'Y';
  });
}

