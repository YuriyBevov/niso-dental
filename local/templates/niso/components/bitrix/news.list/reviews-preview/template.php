<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$yandexReviewsWidgetLink = \Bitrix\Main\Config\Option::get("askaron.settings", "UF_YANDEX_REVIEWS_WIDGET");
?>

<section class="base-section reviews-preview">
	<div class="container">
		<div class="base-section__header">
			<span class="base-text base-section__headline">Наши отзывы</span>
			<h2 class="base-title"><?= $arResult["NAME"] ?></h2>
		</div>
		<div class="reviews-preview__grid">
			<? if ($yandexReviewsWidgetLink): ?>
				<div class="reviews-preview__grid-item">
					<iframe src="<?= $yandexReviewsWidgetLink ?>"></iframe>
				</div>
			<? endif; ?>
			<div class="reviews-preview__grid-item">
				<? if ($arResult["ITEMS"]): ?>
					<div class="swiper reviews-slider">
						<div class="swiper-wrapper">
							<? foreach ($arResult["ITEMS"] as $arItem):
								$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
								$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
							?>
								<div class="swiper-slide">
									<? include($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/partials/review-card/review-card.php"); ?>
								</div>
							<? endforeach; ?>
						</div>
						<div class="swiper-pagination"></div>
					</div>
				<? endif; ?>

				<div class="reviews-preview__form-opener-container">
					<div class="reviews-preview__form-opener">
						<span class="base-title">Ваш отзыв — наша лучшая рекомендация</span>
						<span>Если вы уже проходили лечение в нашей клинике, поделитесь впечатлениями. Ваш честный отзыв помогает другим пациентам сделать уверенный выбор, а нам — поддерживать высокий уровень сервиса и заботы о каждом пациенте.</span>
						<button class="main-btn" data-form-id="2">Оставить отзыв</button>
					</div>
				</div>

			</div>
		</div>
		<? $APPLICATION->IncludeComponent(
			"bitrix:news.list",
			"video-reviews-new",
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
				"DISPLAY_BOTTOM_PAGER" => "Y",
				"DISPLAY_DATE" => "Y",
				"DISPLAY_NAME" => "Y",
				"DISPLAY_PICTURE" => "N",
				"DISPLAY_PREVIEW_TEXT" => "N",
				"DISPLAY_TOP_PAGER" => "N",
				"FIELD_CODE" => array("", "", ""),
				"FILTER_NAME" => $GLOBALS['arLinkedVideoReviewsFilter'] ? 'arLinkedVideoReviewsFilter' : "",
				"HIDE_LINK_WHEN_NO_DETAIL" => "N",
				"IBLOCK_ID" => "43",
				"IBLOCK_TYPE" => "site_content",
				"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
				"INCLUDE_SUBSECTIONS" => "Y",
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
				"PROPERTY_CODE" =>  [0 => "", 1 => "VIDEO",],
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
		unset($GLOBALS['arLinkedVideoReviewsFilter']); ?>
	</div>
</section>

<div class="modal-overlay">
	<div class="modal main-modal review-modal" id="review-modal">
		<div class="modal-wrapper">
			<button class="modal-closer s" type="button" aria-label="Закрыть">
				<svg width="14" height="14">
					<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-close"></use>
				</svg>
			</button>
			<div class="modal-content"><span class="modal-text"></span></div>
		</div>
	</div>
</div>
