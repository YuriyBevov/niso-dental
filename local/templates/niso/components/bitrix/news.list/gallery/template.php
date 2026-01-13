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
	<section class="base-section gallery">
		<? if (!empty($arResult['MAIN_GALLERY'])) : ?>
			<div class="gallery-static">
				<? foreach ($arResult['MAIN_GALLERY'] as $arItem): ?>
					<?
					$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
					$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
					?>
					<img data-fancybox="gallery-static" src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ?>?>" alt="<?= (($arItem["PREVIEW_PICTURE"]["DESCRIPTION"]) ? ($arItem["PREVIEW_PICTURE"]["DESCRIPTION"]) : $arItem["NAME"]) ?>" width="600" , height="400">
				<? endforeach; ?>
			</div>
		<? endif; ?>
		<? if (!empty($arResult['SLIDER_GALLERY'])) : ?>
			<div class="swiper autofill-slider">
				<div class="swiper-wrapper">
					<? foreach ($arResult['SLIDER_GALLERY'] as $arItem):
						$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
						$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
					?>
						<div class="swiper-slide" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
							<img data-fancybox="gallery-slider" src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ?>" alt="<?= (($arItem["PREVIEW_PICTURE"]["DESCRIPTION"]) ? ($arItem["PREVIEW_PICTURE"]["DESCRIPTION"]) : $arItem["NAME"]) ?>" width="<?= $arItem["PREVIEW_PICTURE"]["WIDTH"] ?>" height="<?= $arItem["PREVIEW_PICTURE"]["HEIGHT"] ?>">
						</div>
					<? endforeach; ?>
				</div>
				<div class="swiper-pagination"></div>
			</div>
			<? if ($arParams["DISPLAY_BOTTOM_PAGER"]): ?>
				<?= $arResult["NAV_STRING"] ?>
			<? endif; ?>
		<? endif; ?>
	</section>
<? endif; ?>
