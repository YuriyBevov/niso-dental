<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
\Bitrix\Main\Loader::includeModule('iblock');

use Bitrix\Iblock\IblockTable;

$iblockId = 6;

$iblock = IblockTable::getList([
	'select' => ['ID', 'NAME', 'DESCRIPTION'],
	'filter' => ['ID' => $iblockId],
])->fetch();

if ($iblock) {
	$arResult["NAME"] = $iblock['NAME'];
	$arResult["DESCRIPTION"] = $iblock['DESCRIPTION'];
} else {
	$arResult["NAME"] = 'Популярные услуги';
}

$elements = \Bitrix\Iblock\Elements\ElementCatalogTable::getList([
	'select' => ['IBLOCK_SECTION_ID', 'NAME', 'CODE'],
	'filter' => ['=ACTIVE' => 'Y'],
])->fetchAll();

foreach ($arResult['SECTIONS'] as $key => $arSection) {
	foreach ($elements as $element) {
		if ($element['IBLOCK_SECTION_ID'] == $arSection["ID"]) {
			$element["DETAIL_PAGE_URL"] = "/services/" . $element["CODE"] . '/';
			$arResult['SECTIONS'][$key]['ELEMENTS'][] = $element;
		}
	}
}
