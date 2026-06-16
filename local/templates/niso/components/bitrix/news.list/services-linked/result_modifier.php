<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

if ($arParams["CUSTOM_CARD"]) {
  $topServices = [];

  foreach ($arResult["ITEMS"] as $arItem) {
    if ($arItem["PROPERTIES"]["TOP_SERVICE"]["VALUE"] != "Y") { // если услуга не является популярной, то нчиего с ней не делаем 
      continue;
    }

    $linkedId = $arItem["PROPERTIES"]["TOP_SERVICE_PRICE"]["VALUE"];

    if ($linkedId) {
      $linkedElement = CIBlockElement::GetByID($linkedId)->Fetch();

      if ($linkedElement) {
        $property = CIBlockElement::GetProperty(
          $linkedElement["IBLOCK_ID"],
          $linkedId,
          [],
          ["CODE" => "SERVICE_PRICE"] // извлекаем стоимость
        )->Fetch();

        if ($property) {
          $arItem["TOP_SERVICE_PRICE_VALUE"] = $property["VALUE"]; //записываем в поле
        }
      }
    }

    $topServices[] = $arItem;
  }

  $arResult["ITEMS"] = $topServices;
}
