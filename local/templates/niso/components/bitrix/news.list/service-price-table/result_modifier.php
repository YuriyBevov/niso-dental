<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
// Получаем массив ID из фильтра (ваш исходный порядок)
$linkedIds = $GLOBALS['arLinkedPricesFilter']['ID'];

if (!empty($linkedIds) && !empty($arResult['ITEMS'])) {
  // Индексируем полученные элементы по ID
  $itemsById = array();
  foreach ($arResult['ITEMS'] as $item) {
    $itemsById[$item['ID']] = $item;
  }

  // Восстанавливаем порядок из исходного массива
  $sortedItems = array();
  foreach ($linkedIds as $id) {
    if (isset($itemsById[$id])) {
      $sortedItems[] = $itemsById[$id];
    }
  }

  $arResult['ITEMS'] = $sortedItems;
}

unset($GLOBALS['arLinkedPricesFilter']);
