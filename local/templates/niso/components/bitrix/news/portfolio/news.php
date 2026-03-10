<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) {
	die();
}
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
$this->setFrameMode(true);

if ($arParams["USE_RSS"] == "Y"):
	if (method_exists($APPLICATION, 'addheadstring'))
		$APPLICATION->AddHeadString('<link rel="alternate" type="application/rss+xml" title="' . $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["rss"] . '" href="' . $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["rss"] . '" />');
?>
	<a href="<?= $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["rss"] ?>" title="rss" target="_self"><img alt="RSS" src="<?= $templateFolder ?>/images/gif-light/feed-icon-16x16.gif" border="0" align="right" /></a>
<?
endif;

if ($arParams["USE_SEARCH"] == "Y"): ?>
	<?= GetMessage("SEARCH_LABEL") ?><?php
										$APPLICATION->IncludeComponent(
											"bitrix:search.form",
											"flat",
											[
												"PAGE" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["search"]
											],
											$component,
											['HIDE_ICONS' => 'Y']
										); ?>
	<br />
<?php
endif;
if ($arParams["USE_FILTER"] == "Y"):
	$APPLICATION->IncludeComponent(
		"bitrix:catalog.filter",
		"",
		[
			"IBLOCK_TYPE" => $arParams["IBLOCK_TYPE"],
			"IBLOCK_ID" => $arParams["IBLOCK_ID"],
			"FILTER_NAME" => $arParams["FILTER_NAME"],
			"FIELD_CODE" => $arParams["FILTER_FIELD_CODE"],
			"PROPERTY_CODE" => $arParams["FILTER_PROPERTY_CODE"],
			"CACHE_TYPE" => $arParams["CACHE_TYPE"],
			"CACHE_TIME" => $arParams["CACHE_TIME"],
			"CACHE_GROUPS" => $arParams["CACHE_GROUPS"],
			"PAGER_PARAMS_NAME" => $arParams["PAGER_PARAMS_NAME"],
		],
		$component,
		['HIDE_ICONS' => 'Y']
	);
?>
	<br />
<?php
endif; ?>

<?

$sectionParam = $_GET['section'] ?? '';
$iblockId = 13; // ID инфоблока

$rsElements = CIBlockElement::GetList(
	['SORT' => 'ASC', 'ID' => 'DESC'], // Сортировка
	[
		'IBLOCK_ID' => $iblockId,
		'SECTION_ID' => $sectionParam,      // Только элементы, где этот раздел — основной
		'ACTIVE' => 'Y',                 // Только активные
		'ACTIVE_DATE' => 'Y',            // С учётом дат активности
		'CHECK_PERMISSIONS' => 'Y'       // Проверка прав доступа
	],
	false, // Навигация не нужна, если берём все
	false, // Количество элементов (false = все)
	['ID', 'NAME', 'PREVIEW_TEXT', 'DETAIL_PAGE_URL', 'IBLOCK_SECTION_ID'] // Поля
);

$arElements = [];
while ($arElement = $rsElements->Fetch()) {
	$arElements[] = $arElement["ID"];
}

global $sectionFilter;
if (!empty($sectionParam)) {
	$sectionFilter = [
		"ID" => $arElements
	];
} else {
	$sectionFilter = [];
}

$APPLICATION->IncludeComponent(
	"bitrix:news.list",
	"portfolio-list",
	[
		"FILTER_NAME" => "sectionFilter",
		"IBLOCK_TYPE" => $arParams["IBLOCK_TYPE"],
		"IBLOCK_ID" => $arParams["IBLOCK_ID"],
		"NEWS_COUNT" => $arParams["NEWS_COUNT"],
		"SORT_BY1" => $arParams["SORT_BY1"],
		"SORT_ORDER1" => $arParams["SORT_ORDER1"],
		"SORT_BY2" => $arParams["SORT_BY2"],
		"SORT_ORDER2" => $arParams["SORT_ORDER2"],
		"FIELD_CODE" => $arParams["LIST_FIELD_CODE"],
		"PROPERTY_CODE" => $arParams["LIST_PROPERTY_CODE"],
		"DETAIL_URL" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["detail"],
		"SECTION_URL" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["section"],
		"IBLOCK_URL" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["news"],
		"SET_TITLE" => $arParams["SET_TITLE"],
		"SET_LAST_MODIFIED" => $arParams["SET_LAST_MODIFIED"],
		"MESSAGE_404" => $arParams["MESSAGE_404"],
		"SET_STATUS_404" => $arParams["SET_STATUS_404"],
		"SHOW_404" => $arParams["SHOW_404"],
		"FILE_404" => $arParams["FILE_404"],
		"INCLUDE_IBLOCK_INTO_CHAIN" => $arParams["INCLUDE_IBLOCK_INTO_CHAIN"],
		"CACHE_TYPE" => $arParams["CACHE_TYPE"],
		"CACHE_TIME" => $arParams["CACHE_TIME"],
		"CACHE_FILTER" => $arParams["CACHE_FILTER"],
		"CACHE_GROUPS" => $arParams["CACHE_GROUPS"],
		"DISPLAY_TOP_PAGER" => $arParams["DISPLAY_TOP_PAGER"],
		"DISPLAY_BOTTOM_PAGER" => $arParams["DISPLAY_BOTTOM_PAGER"],
		"PAGER_TITLE" => $arParams["PAGER_TITLE"],
		"PAGER_TEMPLATE" => $arParams["PAGER_TEMPLATE"],
		"PAGER_SHOW_ALWAYS" => $arParams["PAGER_SHOW_ALWAYS"],
		"PAGER_DESC_NUMBERING" => $arParams["PAGER_DESC_NUMBERING"],
		"PAGER_DESC_NUMBERING_CACHE_TIME" => $arParams["PAGER_DESC_NUMBERING_CACHE_TIME"],
		"PAGER_SHOW_ALL" => $arParams["PAGER_SHOW_ALL"],
		"PAGER_BASE_LINK_ENABLE" => $arParams["PAGER_BASE_LINK_ENABLE"],
		"PAGER_BASE_LINK" => $arParams["PAGER_BASE_LINK"],
		"PAGER_PARAMS_NAME" => $arParams["PAGER_PARAMS_NAME"],
		"DISPLAY_DATE" => $arParams["DISPLAY_DATE"],
		"DISPLAY_NAME" => "Y",
		"DISPLAY_PICTURE" => $arParams["DISPLAY_PICTURE"],
		"DISPLAY_PREVIEW_TEXT" => $arParams["DISPLAY_PREVIEW_TEXT"],
		"PREVIEW_TRUNCATE_LEN" => $arParams["PREVIEW_TRUNCATE_LEN"],
		"ACTIVE_DATE_FORMAT" => $arParams["LIST_ACTIVE_DATE_FORMAT"],
		"USE_PERMISSIONS" => $arParams["USE_PERMISSIONS"],
		"GROUP_PERMISSIONS" => $arParams["GROUP_PERMISSIONS"],
		"HIDE_LINK_WHEN_NO_DETAIL" => $arParams["HIDE_LINK_WHEN_NO_DETAIL"],
		"CHECK_DATES" => $arParams["CHECK_DATES"],
	],
	$component
);

unset($sectionFilter);
