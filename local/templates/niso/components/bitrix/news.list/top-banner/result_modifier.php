<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

if ($arParams["IS_TOP_BANNER"] == "Y") {
  foreach ($arResult["ITEMS"] as $key => $arItem) {
    if ($arItem["IBLOCK_SECTION_ID"] != 5) {
      unset($arResult["ITEMS"][$key]);
    }
  }
}

if (!empty($GLOBALS["arBannersFilter"]["ID"])) {
  // Ручная сортировка после получения данных
  if (!empty($arResult["ITEMS"])) {
    $elements = [];
    foreach ($arResult["ITEMS"] as $item) {
      $elements[$item["ID"]] = $item; // Собираем элементы в ассоциативный массив
    }

    $sortedItems = [];
    foreach ($GLOBALS["arBannersFilter"]["ID"] as $id) {
      if (isset($elements[$id])) {
        $sortedItems[] = $elements[$id]; // Сортируем в соответствии с порядком ID
      }
    }

    $arResult["ITEMS"] = $sortedItems; // Перезаписываем массив элементов
  }

  unset($GLOBALS["arBannersFilter"]);
}
