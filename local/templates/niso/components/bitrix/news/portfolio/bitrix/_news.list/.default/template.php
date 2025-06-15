<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<section class="base-section portfolio">
	<div class="container">

		<div class="base-section__header">
			<span class="base-text base-section__headline">
				<?
				$APPLICATION->IncludeFile(
					SITE_DIR . 'include/headlines/staff-headline.php',
					array(),
					array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
				);
				?>
			</span>
			<h2 class="base-title"><?= $arResult["NAME"] ?></h2>
			<span class="base-text">
				<?= $arResult["DESCRIPTION"] ?>
			</span>
		</div>

		<div class="portfolio__grid">
			<? if ($arResult["ITEMS"]): ?>
				<?
				foreach ($arResult["ITEMS"] as $arItem):
					$pathBefore = CFile::GetPath($arItem["PROPERTIES"]["IMAGE_BEFORE"]["VALUE"]);
					$pathAfter = CFile::GetPath($arItem["PROPERTIES"]["IMAGE_AFTER"]["VALUE"]);
				?>
					<? if ($pathBefore && $pathAfter): ?>
						<div class="portfolio__grid-item">
							<div class="portfolio-card-wrapper">
								<div class="portfolio-card">
									<div class="image-comparison" data-component="image-comparison-slider">
										<div class="image-comparison__slider-wrapper">
											<label for="image-comparison-range" class="image-comparison__label">
												<input type="range" min="0" max="100" value="50" class="image-comparison__range" id="image-compare-range" data-image-comparison-range="">
											</label>

											<div class="image-comparison__image-wrapper  image-comparison__image-wrapper--overlay" data-image-comparison-overlay="">
												<figure class="image-comparison__figure image-comparison__figure--overlay">
													<img src="<?= $pathBefore ?>" alt="<?= $arItem["NAME"] ?>" class="image-comparison__image">
													<figcaption class="image-comparison__caption image-comparison__caption--before">
														<span class="image-comparison__caption-body">До</span>
													</figcaption>
												</figure>
											</div>
											<div class="image-comparison__slider" data-image-comparison-slider="">
												<span class="image-comparison__thumb" data-image-comparison-thumb="">
													<svg width="18" height="10" role="img" aria-hidden="true" focusable="false">
														<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-swipe"></use>
													</svg>
												</span>
											</div>
											<div class="image-comparison__image-wrapper">
												<figure class="image-comparison__figure">
													<img src="<?= $pathAfter ?>" alt="<?= $arItem["NAME"] ?>" class="image-comparison__image">
													<figcaption class="image-comparison__caption image-comparison__caption--after">
														<span class="image-comparison__caption-body">После</span>
													</figcaption>
												</figure>
											</div>
										</div>
									</div>
									<div class="portfolio-card__content">
										<span class="base-subtitle"><?= $arItem["NAME"] ?></span>
										<a href="<?= $arItem["DETAIL_PAGE_URL"] ?>" class="main-btn main-btn--outlined">Подробнее</a>
									</div>
								</div>
							</div>
						</div>
					<? endif; ?>
				<? endforeach; ?>
			<? endif; ?>
		</div>
	</div>
</section>

<? if ($arParams["DISPLAY_BOTTOM_PAGER"]): ?>
	<?= $arResult["NAV_STRING"] ?><br />
<? endif; ?>