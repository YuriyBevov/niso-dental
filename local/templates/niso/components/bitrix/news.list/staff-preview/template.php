<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
	<section class="base-section staff-preview">
		<div class="container">
			<div class="base-section__header">
				<span class="base-text base-section__headline">
					<?
					$APPLICATION->IncludeFile(
						SITE_DIR . 'include/headlines/staff-preview-headline.php',
						array(),
						array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
					);
					?>
				</span>

				<h2 class="base-title"><?= $arResult["NAME"] ?></h2>
			</div>
			<div class="staff-preview__content">
				<div class="swiper staff-preview-slider">
					<div class="swiper-wrapper">
						<?
						foreach ($arResult["ITEMS"] as $arItem):
							$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
							$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
						?>
							<div class="swiper-slide">
								<? include($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/partials/staff-preview-card/staff-preview-card.php"); ?>
							</div>
						<? endforeach; ?>
					</div>
					<div class="swiper-navigation">
						<button class="swiper-button swiper-button-prev" type="button" aria-label="Назад">
							<svg width="22" height="22" role="img" aria-hidden="true" focusable="false">
								<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-arrow"></use>
							</svg>
						</button>
						<button class="swiper-button swiper-button-next" type="button" aria-label="Вперед">
							<svg width="22" height="22" role="img" aria-hidden="true" focusable="false">
								<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-arrow"></use>
							</svg>
						</button>
					</div>
				</div>

				<div class="swiper staff-preview-slider-thumbs">
					<div class="swiper-wrapper">

						<?
						foreach ($arResult["ITEMS"] as $arItem):
						?>
							<div class="swiper-slide">
								<img src="<?= $arItem["DETAIL_PICTURE"]["SRCSET"] ?>" alt="<?= $arResult["NAME"] ?>" width="60" height="60">
							</div>
						<? endforeach; ?>

					</div>
				</div>
				<a class="main-btn main-btn--outlined" href="/staff/">
					<span>Смотреть всех врачей</span>
				</a>
			</div>
		</div>
	</section>
<? endif; ?>