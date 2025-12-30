<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
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
?>

<section class="base-section staff-reviews">
	<div class="base-section__header">
		<h2 class="base-title">Отзывы на ПроДокторов</h2>
	</div>
	<div class="swiper staff-reviews-slider">
		<div class="swiper-wrapper">
			<? foreach ($arResult["ITEMS"] as $arItem): ?>
				<?
				$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
				$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
				?>
				<div class="swiper-slide">
					<div class="review-card">
						<div class="review-card-header">
							<img src="<?= $templateFolder ?>/img/logo_prodoctorov.svg" alt="Логотип ПроДокторов." width="132" height="27">
							<div class="review-card__rate">
								<? for ($i = 1; $i <= 5; $i++): ?>
									<svg class="rate-item <?= ($i <= $arItem["PROPERTIES"]["RATING"]["VALUE"]) ? 'active' : '' ?>" width="16" height="16" role="img" aria-hidden="true" focusable="false">
										<use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#icon-star' ?>"></use>
									</svg>
								<? endfor; ?>
							</div>
							<span class="review-card__date">
								<?= FormatDate('j F Y', MakeTimeStamp($arItem['PROPERTIES']['DATE']['VALUE'])); ?>
							</span>
						</div>
						<div
							class="review-card__content"
							data-collapsed-text="200"
							data-expanded-text="<?= $arItem["DETAIL_TEXT"] ?>"
							data-collapsed-btn-text="Читать далее...">
							<?= $arItem["DETAIL_TEXT"] ?>
						</div>
					</div>
				</div>
			<? endforeach; ?>
		</div>
		<div class="swiper-pagination"></div>
	</div>
	<a class="main-btn" href="<?= $arParams['CUSTOM_LINK'] ?>" rel="nofollow noreferrer noopener" target="_blank">Отзывы на ПроДокторов</a>
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
