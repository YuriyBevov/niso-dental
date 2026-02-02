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
				<? if ($arParams["CUSTOM_TITLE"]): ?>
					<h2 class="base-title"><?= $arParams["CUSTOM_TITLE"] ?></h2>
				<? elseif (!empty($arParams["FILTER_NAME"])): ?>
					<h2 class="base-title"><?= $arResult["NAME"] ?></h2>
				<? else: ?>
					<h1 class="base-title"><?= $arResult["NAME"] ?></h1>
				<? endif; ?>

				<span class="base-text">
					<?= $arResult["DESCRIPTION"] ?>
				</span>
				<? if ($arParams["CUSTOM_IS_SLIDER_VIEW"] === "Y"): ?>
					<a class="main-btn main-btn--outlined portfolio_show-all portfolio_show-all--desktop" href="/portfolio/">Все работы</a>
				<? endif; ?>
			</div>

			<? if ($arParams["CUSTOM_IS_SLIDER_VIEW"] === "Y"): ?>

				<div class="portfolio__slider-wrapper">
					<div class="swiper autofill-slider">
						<div class="swiper-wrapper">
							<?
							foreach ($arResult["ITEMS"] as $arItem):
								$pathBefore = CFile::GetPath($arItem["PROPERTIES"]["IMAGE_BEFORE"]["VALUE"]);
								$pathAfter = CFile::GetPath($arItem["PROPERTIES"]["IMAGE_AFTER"]["VALUE"]);
							?>
								<? if ($pathBefore && $pathAfter): ?>
									<div class="swiper-slide">
										<div class="portfolio-card">
											<? include($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/partials/image-comparison-slider/index.php"); ?>
											<div class="portfolio-card__content">
												<span class="base-subtitle"><?= $arItem["NAME"] ?></span>
												<a href="<?= $arItem["DETAIL_PAGE_URL"] ?>" class="main-btn main-btn--outlined">Подробнее</a>
											</div>
										</div>
									</div>
								<? endif; ?>
							<? endforeach; ?>
						</div>
						<div class="swiper-pagination"></div>
						<div class="swiper-navigation">
							<div class="swiper-button-prev">
								<svg width="22" height="22" role="img" aria-hidden="true" focusable="false">
									<use xlink:href="/local/templates/niso/assets/sprite.svg#icon-arrow"></use>
								</svg>
							</div>
							<div class="swiper-button-next">
								<svg width="22" height="22" role="img" aria-hidden="true" focusable="false">
									<use xlink:href="/local/templates/niso/assets/sprite.svg#icon-arrow"></use>
								</svg>
							</div>
						</div>

					</div>
				</div>
				<a class="main-btn main-btn--outlined portfolio_show-all portfolio_show-all--mobile" href="/portfolio/">Все работы</a>
			<? else : ?>
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
			<? endif; ?>
		</div>
	</section>

	<? if ($arParams["DISPLAY_BOTTOM_PAGER"]): ?>
		<?= $arResult["NAV_STRING"] ?><br />
	<? endif; ?>
<? endif; ?>