<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

if ($arResult["ELEMENTS"]) {
    $APPLICATION->addHeadScript($templateFolder . "/custom_script.js");
}
