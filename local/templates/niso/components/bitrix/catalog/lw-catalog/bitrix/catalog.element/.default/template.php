<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

/**
 * @global CMain $APPLICATION
 * @var array $arParams
 * @var array $arResult
 * @var CatalogSectionComponent $component
 * @var CBitrixComponentTemplate $this
 * @var string $templateName
 * @var string $componentPath
 * @var string $templateFolder
 */

$this->setFrameMode(true);

$mainId = $this->GetEditAreaId($arResult['ID']);
$itemIds = array(
	'ID' => $mainId,
	'DISCOUNT_PERCENT_ID' => $mainId . '_dsc_pict',
	'STICKER_ID' => $mainId . '_sticker',
	'BIG_SLIDER_ID' => $mainId . '_big_slider',
	'BIG_IMG_CONT_ID' => $mainId . '_bigimg_cont',
	'SLIDER_CONT_ID' => $mainId . '_slider_cont',
	'OLD_PRICE_ID' => $mainId . '_old_price',
	'PRICE_ID' => $mainId . '_price',
	'DESCRIPTION_ID' => $mainId . '_description',
	'DISCOUNT_PRICE_ID' => $mainId . '_price_discount',
	'PRICE_TOTAL' => $mainId . '_price_total',
	'SLIDER_CONT_OF_ID' => $mainId . '_slider_cont_',
	'QUANTITY_ID' => $mainId . '_quantity',
	'QUANTITY_DOWN_ID' => $mainId . '_quant_down',
	'QUANTITY_UP_ID' => $mainId . '_quant_up',
	'QUANTITY_MEASURE' => $mainId . '_quant_measure',
	'QUANTITY_LIMIT' => $mainId . '_quant_limit',
	'BUY_LINK' => $mainId . '_buy_link',
	'ADD_BASKET_LINK' => $mainId . '_add_basket_link',
	'BASKET_ACTIONS_ID' => $mainId . '_basket_actions',
	'NOT_AVAILABLE_MESS' => $mainId . '_not_avail',
	'COMPARE_LINK' => $mainId . '_compare_link',
	'TREE_ID' => $mainId . '_skudiv',
	'DISPLAY_PROP_DIV' => $mainId . '_sku_prop',
	'DISPLAY_MAIN_PROP_DIV' => $mainId . '_main_sku_prop',
	'OFFER_GROUP' => $mainId . '_set_group_',
	'BASKET_PROP_DIV' => $mainId . '_basket_prop',
	'SUBSCRIBE_LINK' => $mainId . '_subscribe',
	'TABS_ID' => $mainId . '_tabs',
	'TAB_CONTAINERS_ID' => $mainId . '_tab_containers',
	'SMALL_CARD_PANEL_ID' => $mainId . '_small_card_panel',
	'TABS_PANEL_ID' => $mainId . '_tabs_panel'
); ?>

<section class="base-section service-detail">
	<div class="container">
		<?
		if ($arResult["PROPERTIES"]["BANNERS"]["VALUE"]):
			$GLOBALS["arBannersFilter"] = array("ID" => $arResult["PROPERTIES"]["BANNERS"]["VALUE"]);

			// Вызываем компонент
			$APPLICATION->IncludeComponent(
				"bitrix:news.list",
				"top-banner",
				array(
					"LW_IS_INNER" => "Y",
					"ACTIVE_DATE_FORMAT" => "d.m.Y",
					"ADD_SECTIONS_CHAIN" => "N",
					"AJAX_MODE" => "N",
					"CACHE_FILTER" => "N",
					"CACHE_GROUPS" => "Y",
					"CACHE_TIME" => "36000000",
					"CACHE_TYPE" => "A",
					"CHECK_DATES" => "Y",
					"DETAIL_URL" => "",
					"DISPLAY_BOTTOM_PAGER" => "N",
					"DISPLAY_TOP_PAGER" => "N",
					"FIELD_CODE" => array(),
					"FILTER_NAME" => "arBannersFilter", // Передаем фильтр
					"IBLOCK_ID" => "8", // ID инфоблока
					"IBLOCK_TYPE" => "site_content",
					"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
					"NEWS_COUNT" => count($GLOBALS["arBannersFilter"]["ID"]), // Количество элементов
					"SORT_BY1" => "ID", // Отключаем сортировку
					"SORT_ORDER1" => "ASC",
					"PROPERTY_CODE" => array("H1_TITLE", "LINK", "FORM_BUTTON"),
					"SET_BROWSER_TITLE" => "N",
					"SET_TITLE" => "N",
					"SET_LAST_MODIFIED" => "N",
					"SET_META_DESCRIPTION" => "N",
					"SET_META_KEYWORDS" => "N",
					"SET_STATUS_404" => "N",
					"SHOW_404" => "N",
					"STRICT_SECTION_CHECK" => "N",
					"COMPONENT_TEMPLATE" => "top-banner",
				),
				$component
			);
		endif;
		?>

		<div class="service-detail__grid">
			<div class="service-detail__grid-item service-detail__grid-item--sidebar">
				<? $APPLICATION->IncludeComponent(
					"bitrix:menu",
					"side-menu",
					array(
						"ALLOW_MULTI_SELECT" => "N",
						"CHILD_MENU_TYPE" => "left",
						"DELAY" => "N",
						"MAX_LEVEL" => "2",
						"MENU_CACHE_GET_VARS" => array(),
						"MENU_CACHE_TIME" => "0",
						"MENU_CACHE_TYPE" => "N",
						"MENU_CACHE_USE_GROUPS" => "N",
						"ROOT_MENU_TYPE" => "side",
						"USE_EXT" => "Y",
						"COMPONENT_TEMPLATE" => "side-menu"
					),
					$component
				); ?>

				<div class="side-slider-block">
					<?
					$APPLICATION->IncludeComponent(
						"bitrix:news.list",
						"side-sales",
						array(
							"SIDE_SECTION" => "Y",
							"SHOW_SWIPER_PAGINATION" => "Y",
							"ACTIVE_DATE_FORMAT" => "j F Y",
							"ADD_SECTIONS_CHAIN" => "N",
							"AJAX_MODE" => "N",
							"AJAX_OPTION_ADDITIONAL" => "",
							"AJAX_OPTION_HISTORY" => "N",
							"AJAX_OPTION_JUMP" => "N",
							"AJAX_OPTION_STYLE" => "Y",
							"CACHE_FILTER" => "N",
							"CACHE_GROUPS" => "Y",
							"CACHE_TIME" => "36000000",
							"CACHE_TYPE" => "A",
							"CHECK_DATES" => "Y",
							"DETAIL_URL" => "",
							"DISPLAY_BOTTOM_PAGER" => "N",
							"DISPLAY_DATE" => "N",
							"DISPLAY_NAME" => "N",
							"DISPLAY_PICTURE" => "N",
							"DISPLAY_PREVIEW_TEXT" => "N",
							"DISPLAY_TOP_PAGER" => "N",
							"FIELD_CODE" => array(
								0 => "DATE_ACTIVE_TO",
								1 => "",
							),
							"FILTER_NAME" => "",
							"HIDE_LINK_WHEN_NO_DETAIL" => "N",
							"IBLOCK_ID" => "9",
							"IBLOCK_TYPE" => "site_content",
							"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
							"INCLUDE_SUBSECTIONS" => "N",
							"MESSAGE_404" => "",
							"NEWS_COUNT" => "100",
							"PAGER_BASE_LINK_ENABLE" => "N",
							"PAGER_DESC_NUMBERING" => "N",
							"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
							"PAGER_SHOW_ALL" => "N",
							"PAGER_SHOW_ALWAYS" => "N",
							"PAGER_TEMPLATE" => ".default",
							"PAGER_TITLE" => "Новости",
							"PARENT_SECTION" => "",
							"PARENT_SECTION_CODE" => "",
							"PREVIEW_TRUNCATE_LEN" => "",
							"PROPERTY_CODE" => array(
								0 => "PRICE",
								1 => "DISPLAY_ACTIVE_TO",
								2 => "",
							),
							"SET_BROWSER_TITLE" => "N",
							"SET_LAST_MODIFIED" => "N",
							"SET_META_DESCRIPTION" => "N",
							"SET_META_KEYWORDS" => "N",
							"SET_STATUS_404" => "N",
							"SET_TITLE" => "N",
							"SHOW_404" => "N",
							"SORT_BY1" => "ACTIVE_FROM",
							"SORT_BY2" => "SORT",
							"SORT_ORDER1" => "DESC",
							"SORT_ORDER2" => "ASC",
							"STRICT_SECTION_CHECK" => "N",
							"COMPONENT_TEMPLATE" => "side-sales"
						),
						$component
					); ?>
				</div>
			</div>
			<div class="service-detail__grid-item service-detail__grid-item--content">
				<h1 class="base-title">
					<?= (!empty($arResult['IPROPERTY_VALUES']['ELEMENT_PAGE_TITLE']) ? $arResult['IPROPERTY_VALUES']['ELEMENT_PAGE_TITLE'] : $arResult["NAME"]) ?>
				</h1>

				<div class="content">
					<? if (!empty($arResult["PROPERTIES"]["DETAIL_TEXT_TOP"]["~VALUE"]["TEXT"])): ?>
						<?= $arResult["PROPERTIES"]["DETAIL_TEXT_TOP"]["~VALUE"]["TEXT"] ?>
					<? endif; ?>

					<!-- Изображения -->

					<?
					$mainImg = $arResult['PROPERTIES']['MAIN_IMG']['VALUE'] ?? [];
					$mainImgId = $mainImg['SUB_VALUES']['MAIN_IMG_FILE']['VALUE'] ?? null;
					$mainImgAlt = $mainImg['SUB_VALUES']['MAIN_IMG_TITLE']['VALUE'] ?? '';

					$sideImages = [];
					foreach ($arResult['PROPERTIES']['SIDE_IMG']['VALUE'] ?? [] as $arsideImg) {
						$id = $arsideImg['SUB_VALUES']['SIDE_IMG_FILE']['VALUE'] ?? null;
						$alt = $arsideImg['SUB_VALUES']['SIDE_IMG_TITLE']['VALUE'] ?? '';

						if ($id) {
							$sideImages[] = [
								'ID' => $id,
								'ALT' => $alt
							];
						}
					}
					?>
					<? if ($mainImgId && count($sideImages) === 2): ?>
						<div class="service-detail__gallery">
							<?
							$desktop = CFile::ResizeImageGet($mainImgId, ['width' => 800, 'height' => 400], BX_RESIZE_IMAGE_EXACT, true);
							$tablet = CFile::ResizeImageGet($mainImgId, ['width' => 700, 'height' => 350], BX_RESIZE_IMAGE_EXACT, true);
							$mobile = CFile::ResizeImageGet($mainImgId, ['width' => 480, 'height' => 240], BX_RESIZE_IMAGE_EXACT, true);
							?>
							<picture>
								<source media="(min-width: 960px)" srcset="<?= $desktop['src'] ?>" width="<?= $desktop['width'] ?>" height="<?= $desktop['height'] ?>">
								<source media="(min-width: 650px)" srcset="<?= $tablet['src'] ?>" width="<?= $tablet['width'] ?>" height="<?= $tablet['height'] ?>">
								<img src="<?= $mobile['src'] ?>" alt="<?= $mainImgAlt ?>" loading="lazy" width="<?= $mobile['width'] ?>" height="<?= $mobile['height'] ?>">
							</picture>

							<? foreach ($sideImages as $sideImage) : ?>
								<?
								$desktop = CFile::ResizeImageGet($sideImage['ID'], ['width' => 300, 'height' => 200], BX_RESIZE_IMAGE_EXACT, true);
								$tablet = CFile::ResizeImageGet($sideImage['ID'], ['width' => 270, 'height' => 180], BX_RESIZE_IMAGE_EXACT, true);
								$mobile = CFile::ResizeImageGet($sideImage['ID'], ['width' => 240, 'height' => 160], BX_RESIZE_IMAGE_EXACT, true); ?>
								<picture>
									<source media="(min-width: 960px)" srcset="<?= $desktop['src'] ?>" width="<?= $desktop['width'] ?>" height="<?= $desktop['height'] ?>">
									<source media="(min-width: 650px)" srcset="<?= $tablet['src'] ?>" width="<?= $tablet['width'] ?>" height="<?= $tablet['height'] ?>">
									<img src="<?= $mobile['src'] ?>" alt="<?= $sideImage['ALT'] ?>" loading="lazy" width="<?= $mobile['width'] ?>" height="<?= $mobile['height'] ?>">
								</picture>
							<? endforeach; ?>
						</div>
					<? endif; ?>

					<!-- Изображения -->

					<!-- Цены старые -->

					<? if (!empty($arResult["PROPERTIES"]["PRICE_LIST"]["VALUE"]) && empty($arResult['PROPERTIES']['LINKED_PRICES']['VALUE'])): ?>
						<? if ($arResult["PROPERTIES"]["PRICE_LIST_CUSTOM_TITLE"]["VALUE"]): ?>
							<h2><strong><?= $arResult["PROPERTIES"]["PRICE_LIST_CUSTOM_TITLE"]["VALUE"] ?></strong></h2>
						<? endif; ?>
						<? if (!empty($arResult["PROPERTIES"]["PRICE_LIST_TEXT_BEFORE"]["~VALUE"]["TEXT"])): ?>
							<div class="content">
								<?= $arResult["PROPERTIES"]["PRICE_LIST_TEXT_BEFORE"]["~VALUE"]["TEXT"] ?>
							</div>
						<? endif; ?>
						<? if ($arResult["PROPERTIES"]["PRICE_LIST"]["VALUE"]): ?>
							<table class="price-table">
								<thead>
									<tr>
										<td>Наименование услуги</td>
										<td>Цена</td>
									</tr>
								</thead>
								<tbody>
									<? foreach ($arResult["PROPERTIES"]["PRICE_LIST"]["VALUE"] as $arItem): ?>
										<tr>
											<td><?= $arItem["SUB_VALUES"]["PRICE_LIST_TITLE"]["VALUE"] ?></td>
											<td><strong><?= $arItem["SUB_VALUES"]["PRICE_LIST_PRICE"]["VALUE"] ?></strong></td>
										</tr>
									<? endforeach; ?>
								</tbody>
							</table>
						<? endif; ?>
						<? if (!empty($arResult["PROPERTIES"]["PRICE_LIST_TEXT_AFTER"]["~VALUE"]["TEXT"])): ?>
							<div class="content">
								<?= $arResult["PROPERTIES"]["PRICE_LIST_TEXT_AFTER"]["~VALUE"]["TEXT"] ?>
							</div>
						<? endif; ?>
					<? endif; ?>

					<!-- Цены старые -->

					<!-- Цены новые -->

					<? if (!empty($arResult['PROPERTIES']['LINKED_PRICES']['VALUE'])) : ?>
						<? if ($arResult["PROPERTIES"]["PRICE_LIST_CUSTOM_TITLE"]["VALUE"]): ?>
							<h2><strong><?= $arResult["PROPERTIES"]["PRICE_LIST_CUSTOM_TITLE"]["VALUE"] ?></strong></h2>
						<? endif; ?>
						<? if (!empty($arResult["PROPERTIES"]["PRICE_LIST_TEXT_BEFORE"]["~VALUE"]["TEXT"])): ?>
							<div class="content">
								<?= $arResult["PROPERTIES"]["PRICE_LIST_TEXT_BEFORE"]["~VALUE"]["TEXT"] ?>
							</div>
						<? endif; ?>
						<?
						$GLOBALS['arLinkedPricesFilter'] = array('ID' => $arResult['PROPERTIES']['LINKED_PRICES']['VALUE']);
						$APPLICATION->IncludeComponent(
							"bitrix:news.list",
							"service-price-table",
							array(
								"ACTIVE_DATE_FORMAT" => "d.m.Y",
								"ADD_SECTIONS_CHAIN" => "Y",
								"AJAX_MODE" => "N",
								"AJAX_OPTION_ADDITIONAL" => "",
								"AJAX_OPTION_HISTORY" => "N",
								"AJAX_OPTION_JUMP" => "N",
								"AJAX_OPTION_STYLE" => "Y",
								"CACHE_FILTER" => "N",
								"CACHE_GROUPS" => "Y",
								"CACHE_TIME" => "36000000",
								"CACHE_TYPE" => "A",
								"CHECK_DATES" => "Y",
								"COMPONENT_TEMPLATE" => "service-price-table",
								"DETAIL_URL" => "",
								"DISPLAY_BOTTOM_PAGER" => "Y",
								"DISPLAY_DATE" => "Y",
								"DISPLAY_NAME" => "Y",
								"DISPLAY_PICTURE" => "Y",
								"DISPLAY_PREVIEW_TEXT" => "Y",
								"DISPLAY_TOP_PAGER" => "N",
								"FIELD_CODE" => [0 => "", 1 => "",],
								"FILTER_NAME" => "arLinkedPricesFilter",
								"HIDE_LINK_WHEN_NO_DETAIL" => "N",
								"IBLOCK_ID" => "24",
								"IBLOCK_TYPE" => "site_content",
								"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
								"INCLUDE_SUBSECTIONS" => "Y",
								"MESSAGE_404" => "",
								"NEWS_COUNT" => "50",
								"PAGER_BASE_LINK_ENABLE" => "N",
								"PAGER_DESC_NUMBERING" => "N",
								"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
								"PAGER_SHOW_ALL" => "N",
								"PAGER_SHOW_ALWAYS" => "N",
								"PAGER_TEMPLATE" => ".default",
								"PAGER_TITLE" => "Новости",
								"PARENT_SECTION" => "",
								"PARENT_SECTION_CODE" => "",
								"PREVIEW_TRUNCATE_LEN" => "",
								"PROPERTY_CODE" => [0 => "SERVICE_PRICE", 1 => "",],
								"SET_BROWSER_TITLE" => "N",
								"SET_LAST_MODIFIED" => "N",
								"SET_META_DESCRIPTION" => "N",
								"SET_META_KEYWORDS" => "N",
								"SET_STATUS_404" => "N",
								"SET_TITLE" => "N",
								"SHOW_404" => "N",
								"SORT_BY1" => "ACTIVE_FROM",
								"SORT_BY2" => "SORT",
								"SORT_ORDER1" => "DESC",
								"SORT_ORDER2" => "ASC",
								"STRICT_SECTION_CHECK" => "N"
							),
							$component
						);
						unset($GLOBALS['arLinkedPricesFilter']);
						?>
						<? if (!empty($arResult["PROPERTIES"]["PRICE_LIST_TEXT_AFTER"]["~VALUE"]["TEXT"])): ?>
							<div class="content">
								<?= $arResult["PROPERTIES"]["PRICE_LIST_TEXT_AFTER"]["~VALUE"]["TEXT"] ?>
							</div>
						<? endif; ?>
					<? endif; ?>

					<!-- Цены новые -->

					<!-- Аккордеон -->

					<? if ($arResult["PROPERTIES"]["ACCORDEON"]["VALUE"]): ?>
						<div class="accordeon">
							<? foreach ($arResult["PROPERTIES"]["ACCORDEON"]["VALUE"] as $arValue): ?>
								<? if ($arValue["SUB_VALUES"]["TITLE"]["VALUE"] && $arValue["SUB_VALUES"]["CONTENT"]["~VALUE"]["TEXT"]): ?>
									<div class="accordeon-item">
										<div class="accordeon-header">
											<h2><strong><?= $arValue["SUB_VALUES"]["TITLE"]["VALUE"] ?></strong></h2>
											<div class="accordeon-opener">
												<svg width="26" height="26" role="img" aria-hidden="true" focusable="false">
													<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-cross"></use>
												</svg>
											</div>
										</div>
										<div class="accordeon-body">
											<div class="content-block">
												<?= $arValue["SUB_VALUES"]["CONTENT"]["~VALUE"]["TEXT"] ?>
											</div>
										</div>
									</div>
								<? endif; ?>
							<? endforeach; ?>
						</div>
					<? endif; ?>

					<!-- Аккордеон -->

					<?/* $APPLICATION->IncludeComponent(
						"bitrix:form.result.new",
						"service-form",
						[
							"CUSTOM_FORM_TITLE" => $arResult['PROPERTIES']['FORM_TITLE']['VALUE'],
							"CUSTOM_SERVICE_TITLE" => $arResult["NAME"],
							"AJAX_MODE" => "Y",
							"AJAX_OPTION_JUMP" => "N",
							"AJAX_OPTION_STYLE" => "N",
							"AJAX_OPTION_HISTORY" => "N",
							"CACHE_TIME" => "3600",
							"CACHE_TYPE" => "N",
							"CHAIN_ITEM_LINK" => "",
							"CHAIN_ITEM_TEXT" => "",
							"EDIT_URL" => "",
							"IGNORE_CUSTOM_TEMPLATE" => "N",
							"LIST_URL" => "",
							"SEF_MODE" => "N",
							"SUCCESS_URL" => "",
							"USE_EXTENDED_ERRORS" => "Y",
							"WEB_FORM_ID" => "4",
							"COMPONENT_TEMPLATE" => "service-form",
							"VARIABLE_ALIASES" => [
								"WEB_FORM_ID" => "WEB_FORM_ID",
								"RESULT_ID" => "RESULT_ID",
							]
						],
						$component
					); */ ?>

					<? if (!empty($arResult["PROPERTIES"]["DETAIL_TEXT_BOTTOM"]["~VALUE"]["TEXT"])): ?>
						<?= $arResult["PROPERTIES"]["DETAIL_TEXT_BOTTOM"]["~VALUE"]["TEXT"] ?>
					<? endif; ?>
				</div>
			</div>
		</div>
	</div>
</section>

<? if (!empty($arResult["PROPERTIES"]["WORKFLOW"]["VALUE"])): ?>
	<section class="base-section workflow">
		<div class="container">
			<div class="base-section__header">
				<span class="base-text base-section__headline">Этапы работы</span>
				<h2 class="base-title">
					<?= ($arResult["PROPERTIES"]["WORKFLOW_CUSTOM_TITLE"]["VALUE"] ? $arResult["PROPERTIES"]["WORKFLOW_CUSTOM_TITLE"]["VALUE"] : 'Как проходит процедура') ?>
				</h2>
			</div>
			<? if (!empty($arResult["PROPERTIES"]["WORKFLOW_TEXT_BEFORE"]["VALUE"]["TEXT"])): ?>
				<div class="content">
					<?= $arResult["PROPERTIES"]["WORKFLOW_TEXT_BEFORE"]["VALUE"]["TEXT"] ?>
				</div>
				<br>
			<? endif ?>
			<ul class="workflow__list">
				<? foreach ($arResult["PROPERTIES"]["WORKFLOW"]["VALUE"] as $arItem): ?>
					<li class="workflow__list-item">
						<div class="workflow__list-item-header">
							<img src="/img/tooth-img.svg" alt="" width="40" height="40">
							<span class="base-subtitle">
								<?= $arItem["SUB_VALUES"]["WORKFLOW_TITLE"]["VALUE"] ?>
							</span>
						</div>
						<p class="base-text">
							<?= $arItem["SUB_VALUES"]["WORKFLOW_TEXT"]["VALUE"] ?>
						</p>
					</li>
				<? endforeach; ?>
			</ul>
			<? if (!empty($arResult["PROPERTIES"]["WORKFLOW_TEXT_AFTER"]["VALUE"]["TEXT"])): ?>
				<br>
				<div class="content">
					<?= $arResult["PROPERTIES"]["WORKFLOW_TEXT_AFTER"]["VALUE"]["TEXT"] ?>
				</div>
			<? endif ?>
		</div>
	</section>
<? endif; ?>

<?
$GLOBALS['arLinkedServicesFilter'] = array('ID' => $arResult['PROPERTIES']['LINKED_SERVICES']['VALUE']);

$APPLICATION->IncludeComponent(
	"bitrix:news.list",
	"services-linked",
	array(
		"ACTIVE_DATE_FORMAT" => "d.m.Y",
		"ADD_SECTIONS_CHAIN" => "N",
		"AJAX_MODE" => "N",
		"AJAX_OPTION_ADDITIONAL" => "",
		"AJAX_OPTION_HISTORY" => "N",
		"AJAX_OPTION_JUMP" => "N",
		"AJAX_OPTION_STYLE" => "Y",
		"CACHE_FILTER" => "N",
		"CACHE_GROUPS" => "Y",
		"CACHE_TIME" => "36000000",
		"CACHE_TYPE" => "A",
		"CHECK_DATES" => "Y",
		"DETAIL_URL" => "",
		"DISPLAY_BOTTOM_PAGER" => "N",
		"DISPLAY_DATE" => "N",
		"DISPLAY_NAME" => "N",
		"DISPLAY_PICTURE" => "N",
		"DISPLAY_PREVIEW_TEXT" => "Y",
		"DISPLAY_TOP_PAGER" => "N",
		"FIELD_CODE" => array("", ""),
		"FILTER_NAME" => "arLinkedServicesFilter",
		"HIDE_LINK_WHEN_NO_DETAIL" => "N",
		"IBLOCK_ID" => "6",
		"IBLOCK_TYPE" => "site_content",
		"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
		"INCLUDE_SUBSECTIONS" => "N",
		"MESSAGE_404" => "",
		"NEWS_COUNT" => "",
		"PAGER_BASE_LINK_ENABLE" => "N",
		"PAGER_DESC_NUMBERING" => "N",
		"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
		"PAGER_SHOW_ALL" => "N",
		"PAGER_SHOW_ALWAYS" => "N",
		"PAGER_TEMPLATE" => ".default",
		"PAGER_TITLE" => "Новости",
		"PARENT_SECTION" => "",
		"PARENT_SECTION_CODE" => "",
		"PREVIEW_TRUNCATE_LEN" => "",
		"PROPERTY_CODE" => "",
		"SET_BROWSER_TITLE" => "N",
		"SET_LAST_MODIFIED" => "N",
		"SET_META_DESCRIPTION" => "N",
		"SET_META_KEYWORDS" => "N",
		"SET_STATUS_404" => "N",
		"SET_TITLE" => "N",
		"SHOW_404" => "N",
		"SORT_BY1" => "ACTIVE_FROM",
		"SORT_BY2" => "SORT",
		"SORT_ORDER1" => "DESC",
		"SORT_ORDER2" => "ASC",
		"STRICT_SECTION_CHECK" => "N"
	),
	$component
);
unset($GLOBALS['arLinkedServicesFilter']);
?>

<? if (!empty($arResult['PROPERTIES']['LINKED_EXAMPLES'])) {

	$GLOBALS['arLinkedExamplesFilter'] = array('ID' => $arResult['PROPERTIES']['LINKED_EXAMPLES']['VALUE']);
	$APPLICATION->IncludeComponent(
		"bitrix:news.list",
		"portfolio-list",
		array(
			"CUSTOM_IS_SLIDER_VIEW" => "Y",
			"ACTIVE_DATE_FORMAT" => "d.m.Y",
			"ADD_SECTIONS_CHAIN" => "N",
			"AJAX_MODE" => "N",
			"AJAX_OPTION_ADDITIONAL" => "",
			"AJAX_OPTION_HISTORY" => "N",
			"AJAX_OPTION_JUMP" => "N",
			"AJAX_OPTION_STYLE" => "Y",
			"CACHE_FILTER" => "N",
			"CACHE_GROUPS" => "Y",
			"CACHE_TIME" => "36000000",
			"CACHE_TYPE" => "A",
			"CHECK_DATES" => "Y",
			"COMPONENT_TEMPLATE" => "portfolio-list",
			"DETAIL_URL" => "#SITE_DIR#/portfolio/#ELEMENT_CODE#/",
			"DISPLAY_BOTTOM_PAGER" => "Y",
			"DISPLAY_DATE" => "Y",
			"DISPLAY_NAME" => "Y",
			"DISPLAY_PICTURE" => "Y",
			"DISPLAY_PREVIEW_TEXT" => "Y",
			"DISPLAY_TOP_PAGER" => "N",
			"FIELD_CODE" => [0 => "", 1 => "",],
			"FILTER_NAME" => "arLinkedExamplesFilter",
			"HIDE_LINK_WHEN_NO_DETAIL" => "N",
			"IBLOCK_ID" => "13",
			"IBLOCK_TYPE" => "site_content",
			"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
			"INCLUDE_SUBSECTIONS" => "N",
			"MESSAGE_404" => "",
			"NEWS_COUNT" => "20",
			"PAGER_BASE_LINK_ENABLE" => "N",
			"PAGER_DESC_NUMBERING" => "N",
			"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
			"PAGER_SHOW_ALL" => "N",
			"PAGER_SHOW_ALWAYS" => "N",
			"PAGER_TEMPLATE" => "lw-page-navigation",
			"PAGER_TITLE" => "Новости",
			"PARENT_SECTION" => "",
			"PARENT_SECTION_CODE" => "",
			"PREVIEW_TRUNCATE_LEN" => "",
			"PROPERTY_CODE" => [0 => "", 1 => "IMAGE_BEFORE", 2 => "IMAGE_AFTER",],
			"SET_BROWSER_TITLE" => "N",
			"SET_LAST_MODIFIED" => "N",
			"SET_META_DESCRIPTION" => "N",
			"SET_META_KEYWORDS" => "N",
			"SET_STATUS_404" => "N",
			"SET_TITLE" => "N",
			"SHOW_404" => "N",
			"SORT_BY1" => "ACTIVE_FROM",
			"SORT_BY2" => "SORT",
			"SORT_ORDER1" => "DESC",
			"SORT_ORDER2" => "ASC",
			"STRICT_SECTION_CHECK" => "N"
		),
		$component
	);
}

unset($GLOBALS['arLinkedExamplesFilter']);
?>

<!-- features -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/features/features.php");  ?>
<!-- features -->

<!-- reviews-preview -->
<?
$GLOBALS['arLinkedVideoReviewsFilter'] = array('ID' => $arResult['PROPERTIES']['LINKED_VIDEO_REVIEWS']['VALUE'] ? $arResult['PROPERTIES']['LINKED_VIDEO_REVIEWS']['VALUE'] : null);
$APPLICATION->IncludeComponent(
	"bitrix:news.list",
	"reviews-preview",
	array(
		"ACTIVE_DATE_FORMAT" => "j F Y",
		"ADD_SECTIONS_CHAIN" => "N",
		"AJAX_MODE" => "N",
		"AJAX_OPTION_ADDITIONAL" => "",
		"AJAX_OPTION_HISTORY" => "N",
		"AJAX_OPTION_JUMP" => "N",
		"AJAX_OPTION_STYLE" => "N",
		"CACHE_FILTER" => "N",
		"CACHE_GROUPS" => "N",
		"CACHE_TIME" => "36000000",
		"CACHE_TYPE" => "Y",
		"CHECK_DATES" => "Y",
		"DETAIL_URL" => "",
		"DISPLAY_BOTTOM_PAGER" => "Y",
		"DISPLAY_DATE" => "N",
		"DISPLAY_NAME" => "N",
		"DISPLAY_PICTURE" => "N",
		"DISPLAY_PREVIEW_TEXT" => "N",
		"DISPLAY_TOP_PAGER" => "N",
		"FIELD_CODE" => array(
			0 => "",
			1 => "",
		),
		"FILTER_NAME" => "",
		"HIDE_LINK_WHEN_NO_DETAIL" => "N",
		"IBLOCK_ID" => "10",
		"IBLOCK_TYPE" => "site_content",
		"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
		"INCLUDE_SUBSECTIONS" => "N",
		"MESSAGE_404" => "",
		"NEWS_COUNT" => "",
		"PAGER_BASE_LINK_ENABLE" => "N",
		"PAGER_DESC_NUMBERING" => "N",
		"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
		"PAGER_SHOW_ALL" => "N",
		"PAGER_SHOW_ALWAYS" => "N",
		"PAGER_TEMPLATE" => ".default",
		"PAGER_TITLE" => "Новости",
		"PARENT_SECTION" => "",
		"PARENT_SECTION_CODE" => "",
		"PREVIEW_TRUNCATE_LEN" => "",
		"PROPERTY_CODE" => array(
			0 => "RATE",
			1 => "",
		),
		"SET_BROWSER_TITLE" => "N",
		"SET_LAST_MODIFIED" => "N",
		"SET_META_DESCRIPTION" => "N",
		"SET_META_KEYWORDS" => "N",
		"SET_STATUS_404" => "N",
		"SET_TITLE" => "N",
		"SHOW_404" => "N",
		"SORT_BY1" => "ACTIVE_FROM",
		"SORT_BY2" => "SORT",
		"SORT_ORDER1" => "DESC",
		"SORT_ORDER2" => "ASC",
		"STRICT_SECTION_CHECK" => "N",
		"COMPONENT_TEMPLATE" => "reviews-preview"
	),
	$component
);
?>
<!-- reviews-preview -->

<!-- staff-preview -->

<? $GLOBALS['arLinkedStaffFilter'] = array('ID' => $arResult['PROPERTIES']['LINKED_STAFF']['VALUE'] ?  $arResult['PROPERTIES']['LINKED_STAFF']['VALUE'] : null);
$APPLICATION->IncludeComponent(
	"bitrix:news.list",
	"staff-preview",
	array(
		"ACTIVE_DATE_FORMAT" => "d.m.Y",
		"ADD_SECTIONS_CHAIN" => "N",
		"AJAX_MODE" => "N",
		"AJAX_OPTION_ADDITIONAL" => "",
		"AJAX_OPTION_HISTORY" => "N",
		"AJAX_OPTION_JUMP" => "N",
		"AJAX_OPTION_STYLE" => "Y",
		"CACHE_FILTER" => "N",
		"CACHE_GROUPS" => "Y",
		"CACHE_TIME" => "36000000",
		"CACHE_TYPE" => "A",
		"CHECK_DATES" => "Y",
		"DETAIL_URL" => "/staff/#ELEMENT_CODE#/",
		"DISPLAY_BOTTOM_PAGER" => "N",
		"DISPLAY_DATE" => "Y",
		"DISPLAY_NAME" => "Y",
		"DISPLAY_PICTURE" => "Y",
		"DISPLAY_PREVIEW_TEXT" => "Y",
		"DISPLAY_TOP_PAGER" => "N",
		"FIELD_CODE" => array(
			0 => "PREVIEW_TEXT",
			1 => "PREVIEW_PICTURE",
			2 => "DETAIL_TEXT",
			3 => "DETAIL_PICTURE",
			4 => "",
		),
		"FILTER_NAME" => "arLinkedStaffFilter",
		"HIDE_LINK_WHEN_NO_DETAIL" => "N",
		"IBLOCK_ID" => "11",
		"IBLOCK_TYPE" => "site_content",
		"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
		"INCLUDE_SUBSECTIONS" => "N",
		"MESSAGE_404" => "",
		"NEWS_COUNT" => "20",
		"PAGER_BASE_LINK_ENABLE" => "N",
		"PAGER_DESC_NUMBERING" => "N",
		"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
		"PAGER_SHOW_ALL" => "N",
		"PAGER_SHOW_ALWAYS" => "N",
		"PAGER_TEMPLATE" => ".default",
		"PAGER_TITLE" => "Новости",
		"PARENT_SECTION" => "",
		"PARENT_SECTION_CODE" => "",
		"PREVIEW_TRUNCATE_LEN" => "",
		"PROPERTY_CODE" => array(
			0 => "DESCR_FIELD",
			1 => "",
			2 => "",
			3 => "",
			4 => "",
			5 => "",
		),
		"SET_BROWSER_TITLE" => "N",
		"SET_LAST_MODIFIED" => "N",
		"SET_META_DESCRIPTION" => "N",
		"SET_META_KEYWORDS" => "N",
		"SET_STATUS_404" => "N",
		"SET_TITLE" => "N",
		"SHOW_404" => "N",
		"SORT_BY1" => "ACTIVE_FROM",
		"SORT_BY2" => "SORT",
		"SORT_ORDER1" => "DESC",
		"SORT_ORDER2" => "ASC",
		"STRICT_SECTION_CHECK" => "N",
		"COMPONENT_TEMPLATE" => "staff-preview"
	),
	$component
);
unset($GLOBALS['arLinkedStaffFilter']);
?>
<!-- staff-preview -->

<?
$GLOBALS['arFaqFilter'] = array('ID' => $arResult['PROPERTIES']['FAQ']['VALUE']);

$APPLICATION->IncludeComponent(
	"bitrix:news.list",
	"faq-preview",
	array(
		"ACTIVE_DATE_FORMAT" => "d.m.Y",
		"ADD_SECTIONS_CHAIN" => "N",
		"AJAX_MODE" => "N",
		"AJAX_OPTION_ADDITIONAL" => "",
		"AJAX_OPTION_HISTORY" => "N",
		"AJAX_OPTION_JUMP" => "N",
		"AJAX_OPTION_STYLE" => "Y",
		"CACHE_FILTER" => "N",
		"CACHE_GROUPS" => "Y",
		"CACHE_TIME" => "36000000",
		"CACHE_TYPE" => "A",
		"CHECK_DATES" => "Y",
		"DETAIL_URL" => "",
		"DISPLAY_BOTTOM_PAGER" => "N",
		"DISPLAY_DATE" => "N",
		"DISPLAY_NAME" => "N",
		"DISPLAY_PICTURE" => "N",
		"DISPLAY_PREVIEW_TEXT" => "Y",
		"DISPLAY_TOP_PAGER" => "N",
		"FIELD_CODE" => array("", ""),
		"FILTER_NAME" => "arFaqFilter",
		"HIDE_LINK_WHEN_NO_DETAIL" => "N",
		"IBLOCK_ID" => "4",
		"IBLOCK_TYPE" => "site_content",
		"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
		"INCLUDE_SUBSECTIONS" => "N",
		"MESSAGE_404" => "",
		"NEWS_COUNT" => "20",
		"PAGER_BASE_LINK_ENABLE" => "N",
		"PAGER_DESC_NUMBERING" => "N",
		"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
		"PAGER_SHOW_ALL" => "N",
		"PAGER_SHOW_ALWAYS" => "N",
		"PAGER_TEMPLATE" => ".default",
		"PAGER_TITLE" => "Новости",
		"PARENT_SECTION" => "",
		"PARENT_SECTION_CODE" => "",
		"PREVIEW_TRUNCATE_LEN" => "",
		"PROPERTY_CODE" => array("SHOW_ON_INDEX_PAGE", ""),
		"SET_BROWSER_TITLE" => "N",
		"SET_LAST_MODIFIED" => "N",
		"SET_META_DESCRIPTION" => "N",
		"SET_META_KEYWORDS" => "N",
		"SET_STATUS_404" => "N",
		"SET_TITLE" => "N",
		"SHOW_404" => "N",
		"SORT_BY1" => "ACTIVE_FROM",
		"SORT_BY2" => "SORT",
		"SORT_ORDER1" => "DESC",
		"SORT_ORDER2" => "ASC",
		"STRICT_SECTION_CHECK" => "N"
	),
	$component
);
unset($GLOBALS['arFaqFilter']);
?>

<!-- map -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/sections/map/map.php");  ?>
<!-- map -->
