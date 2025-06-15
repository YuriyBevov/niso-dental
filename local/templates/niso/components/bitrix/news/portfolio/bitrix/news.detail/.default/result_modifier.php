<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

$arResult["PROPERTIES"]["DOCTOR"]["NAME"] = CIBlockElement::GetByID($arResult["PROPERTIES"]["DOCTOR"]["VALUE"])->Fetch()['NAME'];
