<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
$pathBefore = CFile::GetPath($arResult["PROPERTIES"]["IMAGE_BEFORE"]["VALUE"]);
$pathAfter = CFile::GetPath($arResult["PROPERTIES"]["IMAGE_AFTER"]["VALUE"]);
?>

<section class="base-section staff-detail">
	<div class="container">
		<div class="base-section__header">
			<span class="base-text base-section__headline">
				<?
				$APPLICATION->IncludeFile(
					SITE_DIR . 'include/headlines/portfolio-headline.php',
					array(),
					array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
				);
				?>
			</span>
			<h1 class="base-title"><?= $arResult["NAME"] ?></h1>
		</div>
		<div class="portfolio-detail__grid">
			<div class="portfolio-detail__grid-item">
				<? include($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/partials/image-comparison-slider/index.php"); ?>
			</div>

			<div class="portfolio-detail__grid-item">
				<div class="content">
					<? if ($arResult["PREVIEW_TEXT"]): ?>
						<?= $arResult["PREVIEW_TEXT"] ?>
					<? endif; ?>

					<? if ($arResult["PROPERTIES"]["DOCTOR"]["NAME"]): ?>
						<strong>Врач:</strong>
						<p><?= $arResult["PROPERTIES"]["DOCTOR"]["NAME"] ?></p>
					<? endif; ?>

					<? if ($arResult["PROPERTIES"]["TIME"]["VALUE"]): ?>
						<strong>Сроки выполнения:</strong>
						<p><?= $arResult["PROPERTIES"]["TIME"]["VALUE"] ?></p>
					<? endif; ?>

					<? if ($arResult["PROPERTIES"]["PROCEDURES"]["VALUE"]): ?>
						<strong>Проведенные процедуры:</strong>
						<ul>
							<? foreach ($arResult["PROPERTIES"]["PROCEDURES"]["VALUE"] as $procedure): ?>
								<li><?= $procedure ?></li>
							<? endforeach; ?>
						</ul>
					<? endif; ?>

					<? if ($arResult["DETAIL_TEXT"]): ?>
						<?= $arResult["DETAIL_TEXT"] ?>
					<? endif; ?>

					<button class="main-btn" type="button" data-modal-opener="callback-modal">
						<span>Записаться на прием</span>
					</button>
				</div>
			</div>
		</div>
	</div>
	</div>
</section>

<?
$GLOBALS['arLinkedPortfolioFilter'] = array('ID' => $arResult['PROPERTIES']['LINKED']['VALUE']);

$APPLICATION->IncludeComponent(
	"bitrix:news.list",
	"portfolio-list",
	array(
		"CUSTOM_TITLE" => "Другие работы",
		"HIDE_HEADLINE" => "Y",
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
		"DETAIL_URL" => "/portfolio/#ELEMENT_CODE#/",
		"DISPLAY_BOTTOM_PAGER" => "Y",
		"DISPLAY_DATE" => "Y",
		"DISPLAY_NAME" => "Y",
		"DISPLAY_PICTURE" => "Y",
		"DISPLAY_PREVIEW_TEXT" => "Y",
		"DISPLAY_TOP_PAGER" => "N",
		"FIELD_CODE" => array("", ""),
		"FILTER_NAME" => "arLinkedPortfolioFilter",
		"HIDE_LINK_WHEN_NO_DETAIL" => "N",
		"IBLOCK_ID" => "13",
		"IBLOCK_TYPE" => "site_content",
		"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
		"INCLUDE_SUBSECTIONS" => "Y",
		"MESSAGE_404" => "",
		"NEWS_COUNT" => "24",
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
		"PROPERTY_CODE" => array("PROCEDURES", "TIME", ""),
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

unset($GLOBALS['arLinkedPortfolioFilter']);
?>

<?
$GLOBALS['arLinkedServicesFilter'] = array('ID' => $arResult['PROPERTIES']['LINKED_SERVICES']['VALUE']);

$APPLICATION->IncludeComponent(
	"bitrix:news.list",
	"services-linked",
	array(
		"CUSTOM_TITLE" => "Возможно, Вас заинтересует",
		"HIDE_HEADLINE" => "Y",
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