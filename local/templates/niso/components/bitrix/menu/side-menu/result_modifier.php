<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
// Удаляю первый уровень меню(сам раздел) все пустые внутрение разделы
foreach ($arResult as $key => $arItem) {
  if ($arItem["DEPTH_LEVEL"] == 1 || $arItem["DEPTH_LEVEL"] == 2 && !$arItem["IS_PARENT"]) {
    unset($arResult[$key]);
  }
}
