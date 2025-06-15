<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
	<section class="base-section sales-preview">
		<div class="container">
			<div class="base-section__header">
				<span class="base-text base-section__headline">
					<?
					$APPLICATION->IncludeFile(
						SITE_DIR . 'include/headlines/sales-preview-headline.php',
						array(),
						array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
					);
					?>
				</span>
				<h2 class="base-title"><?= $arResult["NAME"] ?></h2>
			</div>
			<div class="sales-preview__content">
				<div class="swiper base-cards-slider">
					<div class="swiper-wrapper">
						<? foreach ($arResult["ITEMS"] as $arItem):
							$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
							$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
						?>
							<div class="swiper-slide">
								<? include($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/partials/base-card/base-card.php"); ?>
							</div>
						<? endforeach; ?>
					</div>
					<div class="swiper-pagination"></div>
				</div>
				<a class="main-btn main-btn--outlined" href="/sales/">
					<span>Смотреть все акции</span>
				</a>
			</div>
		</div>
	</section>
<? endif; ?>