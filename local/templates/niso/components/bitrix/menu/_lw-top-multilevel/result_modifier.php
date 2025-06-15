<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

// Если в разделе нет элементов(услуг) - удаляю этот раздел из массива
foreach ($arResult as $key => $arItem) {
  if ($arItem["DEPTH_LEVEL"] == 2 && $arItem["IS_PARENT"] != 1) {
    unset($arResult[$key]);
  }
}
