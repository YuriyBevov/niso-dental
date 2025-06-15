<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
	<div class="hero__grid-item hero__grid-item--side">
		<div class="swiper side-slider base-cards-slider">
			<div class="swiper-wrapper">

				<? foreach ($arResult["ITEMS"] as $arItem):
					$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
					$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
				?>
					<? if ($arItem["PROPERTIES"]["SHOW_IN_HEAD_SECTION"]["VALUE"] == 'Y' && $arParams["SIDE_SECTION"] != "Y"):
						$arItem["HIDE_IMG"] == "Y"
					?>
						<div class="swiper-slide">
							<?
							$hideImg = true;
							include($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/partials/base-card/base-card.php");
							?>
						</div>
					<? elseif ($arParams["SIDE_SECTION"] == "Y"): ?>
						<div class="swiper-slide">
							<?
							include($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/partials/base-card/base-card.php");
							?>
						</div>
					<? endif; ?>
				<? endforeach; ?>
			</div>

			<? if ($arParams["SHOW_SWIPER_PAGINATION"] == "Y"): ?>
				<div class="swiper-pagination"></div>
			<? endif; ?>
		</div>
	</div>
<? endif; ?>