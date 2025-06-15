<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

if ($arParams["TYPE"] == "top-sale-card") {
  $arResult = \Bitrix\Iblock\Elements\ElementSalesTable::getByPrimary($arParams["ITEM_ID"], [
    'select' => ['*'],
  ])->fetch();
  $arResult["TOP_SALE_CARD"] = "Y";
} else {
  $arResult = $arParams["ITEM"];

  $resImage = CFile::ResizeImageGet(
    $arResult["PREVIEW_PICTURE"],
    array("width" => 600, "height" => 400),
    BX_RESIZE_IMAGE_EXACT
  );

  $arResult["RESIZED_PICTURE"] = $resImage["src"];
}
