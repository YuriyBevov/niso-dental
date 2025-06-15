<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

$resImage = CFile::ResizeImageGet(
  $arResult["DETAIL_PICTURE"],
  array("width" => 800, "height" => 500),
  BX_RESIZE_IMAGE_EXACT
);

$arResult["DETAIL_PICTURE"]["SRCSET"] = $resImage["src"];
