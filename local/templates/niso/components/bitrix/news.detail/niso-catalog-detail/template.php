<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
// Получаем данные элемента
$elementId = $arResult["ID"];
$rsElement = CIBlockElement::GetByID($elementId);
if ($arElement = $rsElement->GetNext()) {
	// Добавляем элемент в цепочку навигации
	$APPLICATION->AddChainItem($arElement["NAME"], $arElement["DETAIL_PAGE_URL"]);

	$seoTitle = $arElement["IPROPERTY_VALUES"]["ELEMENT_META_TITLE"]; // Заголовок страницы
	$seoDescription = $arElement["IPROPERTY_VALUES"]["ELEMENT_META_DESCRIPTION"]; // Описание
	$seoKeywords = $arElement["IPROPERTY_VALUES"]["ELEMENT_META_KEYWORDS"]; // Ключевые слова

	// Устанавливаем заголовок страницы
	if (!empty($seoTitle)) {
		$APPLICATION->SetPageProperty("title", $seoTitle); // Устанавливаем заголовок браузера
		$APPLICATION->SetTitle($seoTitle); // Устанавливаем заголовок страницы
	}

	// Устанавливаем мета-описание
	if (!empty($seoDescription)) {
		$APPLICATION->SetPageProperty("description", $seoDescription);
	}
}
?>

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
				false
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
						false
					); ?>
				</div>
			</div>
			<div class="service-detail__grid-item service-detail__grid-item--content">
				<h2 class="base-title">
					<?= $arResult["NAME"] ?>
				</h2>
				<div class="content">
					<? if (!empty($arResult["PROPERTIES"]["DETAIL_TEXT_TOP"]["~VALUE"]["TEXT"])): ?>
						<?= $arResult["PROPERTIES"]["DETAIL_TEXT_TOP"]["~VALUE"]["TEXT"] ?>
					<? endif; ?>

					<? if ($arResult["PROPERTIES"]["LIST"]["VALUE"]): ?>
						<table>
							<thead>
								<tr>
									<td>Наименование услуги</td>
									<td>Цена</td>
								</tr>
							</thead>
							<tbody>
								<? foreach ($arResult["PROPERTIES"]["LIST"]["VALUE"] as $arItem): ?>
									<tr>
										<td><?= $arItem["SUB_VALUES"]["TITLE"]["VALUE"] ?></td>
										<td><strong><?= $arItem["SUB_VALUES"]["PRICE"]["VALUE"] ?></strong></td>
									</tr>
								<? endforeach; ?>
							</tbody>
						</table>
					<? endif; ?>

test

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
				<h2 class="base-title">Как проходит процедура</h2>
			</div>
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
		</div>
	</section>
<? endif; ?>

<!-- features -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/features/features.php"); ?>
<!-- features -->

<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>
