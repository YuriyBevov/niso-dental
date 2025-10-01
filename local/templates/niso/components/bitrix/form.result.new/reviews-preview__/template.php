<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(false);
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
				<?
				//"AJAX_OPTION_CONTAINER" => "lw-unique-form-container", // Указываем ID контейнера для обновления
				$APPLICATION->IncludeComponent(
					"bitrix:form.result.new",
					"reviews-form-inline",
					array(
						"AJAX_MODE" => "Y",
						"AJAX_OPTION_JUMP" => "N",
						"AJAX_OPTION_STYLE" => "N",
						"AJAX_OPTION_HISTORY" => "N",
						"CACHE_TIME" => "3600",
						"CACHE_TYPE" => "A",
						"CHAIN_ITEM_LINK" => "",
						"CHAIN_ITEM_TEXT" => "",
						"EDIT_URL" => "",
						"IGNORE_CUSTOM_TEMPLATE" => "N",
						"LIST_URL" => "",
						"SEF_MODE" => "N",
						"SUCCESS_URL" => "",
						"USE_EXTENDED_ERRORS" => "N",
						"VARIABLE_ALIASES" => array("RESULT_ID" => "RESULT_ID", "WEB_FORM_ID" => "WEB_FORM_ID"),
						"WEB_FORM_ID" => "2",
						"USE_EXTENDED_ERRORS" => "Y",
					),
					false
				); ?>

			</div>
		</div>
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