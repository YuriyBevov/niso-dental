<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

foreach ($arResult["ITEMS"] as $key => $arItem) {
  $resImage = CFile::ResizeImageGet(
    $arItem["DETAIL_PICTURE"],
    array("width" => 60, "height" => 60),
    BX_RESIZE_IMAGE_EXACT
  );

  $arResult["ITEMS"][$key]["DETAIL_PICTURE"]["SRCSET"] = $resImage["src"];
}
