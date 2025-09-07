<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
	<section class="base-section portfolio">
		<div class="container">

			<div class="base-section__header">
				<? if ($arParams["HIDE_HEADLINE"] !== "Y"): ?>
					<span class="base-text base-section__headline">
						<?
						$APPLICATION->IncludeFile(
							SITE_DIR . 'include/headlines/portfolio-headline.php',
							array(),
							array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
						);
						?>
					</span>
				<? endif; ?>
				<?if($arParams["CUSTOM_TITLE"]):?>
					<h2 class="base-title"><?= $arParams["CUSTOM_TITLE"] ?></h2>
				<?else:?>
					<h1 class="base-title"><?= $arResult["NAME"] ?></h1>
				<?endif;?>

				<span class="base-text">
					<?= $arResult["DESCRIPTION"] ?>
				</span>
			</div>

			<div class="portfolio__grid">
				<?
				foreach ($arResult["ITEMS"] as $arItem):
					$pathBefore = CFile::GetPath($arItem["PROPERTIES"]["IMAGE_BEFORE"]["VALUE"]);
					$pathAfter = CFile::GetPath($arItem["PROPERTIES"]["IMAGE_AFTER"]["VALUE"]);
				?>
					<? if ($pathBefore && $pathAfter): ?>
						<div class="portfolio__grid-item">
							<div class="portfolio-card-wrapper">
								<div class="portfolio-card">
									<? include($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/partials/image-comparison-slider/index.php"); ?>
									<div class="portfolio-card__content">
										<span class="base-subtitle"><?= $arItem["NAME"] ?></span>
										<a href="<?= $arItem["DETAIL_PAGE_URL"] ?>" class="main-btn main-btn--outlined">Подробнее</a>
									</div>
								</div>
							</div>
						</div>
					<? endif; ?>
				<? endforeach; ?>

			</div>
		</div>
	</section>

	<? if ($arParams["DISPLAY_BOTTOM_PAGER"]): ?>
		<?= $arResult["NAV_STRING"] ?><br />
	<? endif; ?>
<? endif; ?>