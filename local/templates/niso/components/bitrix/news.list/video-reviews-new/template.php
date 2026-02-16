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

<? if (!empty($arResult["ITEMS"])): ?>
	<div class="base-section video-reviews">
		<div class="base-section__header">
			<span class="base-text base-section__headline">Наши отзывы</span>
			<h2 class="base-title"><?= $arResult["NAME"] ?></h2>
		</div>
		<div class="swiper autofill-slider">
			<div class="swiper-wrapper">
				<? foreach ($arResult["ITEMS"] as $arItem):
					$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
					$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
				?>
					<div class="swiper-slide" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
						<a
							href="<?= $arItem["DISPLAY_PROPERTIES"]["VIDEO"]["FILE_VALUE"]["SRC"] ?>"
							data-fancybox="video-reviews"
							data-type="html5video"
							class="video-review">
							<? if (!empty($arItem["PREVIEW_PICTURE"]["SRC"])): ?>
								<img class="video-review__poster" src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ?>" alt="Видео-превью" width="330" height="420" loading="lazy">
							<? endif; ?>
							<h3><?= $arItem["NAME"] ?></h3>
							<span class="main-btn">
								<svg width="40" height="40" viewBox="0 0 40 40" role="img" aria-hidden="true" focusable="false">
									<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-play-arrow"></use>
								</svg>
							</span>
						</a>
					</div>
				<? endforeach; ?>
			</div>
			<div class="swiper-pagination"></div>
		</div>
		<? if ($arParams["DISPLAY_BOTTOM_PAGER"]): ?>
			<?= $arResult["NAV_STRING"] ?>
		<? endif; ?>
	</div>
<? endif; ?>