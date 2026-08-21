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
<? if ($arResult["ITEMS"]): ?>
	<section class="base-section top-services">
		<div class="container">
			<div class="base-section__header">
				<span class="base-text base-section__headline">
					<?
					$APPLICATION->IncludeFile(
						SITE_DIR . 'include/top-services/upper-text.php',
						array(),
						array('MODE' => 'html', 'NAME' => 'Текст над заголовком', 'SHOW_BORDER' => true)
					);
					?>
				</span>
				<h2 class="base-title">
					<?
					$APPLICATION->IncludeFile(
						SITE_DIR . 'include/top-services/title.php',
						array(),
						array('MODE' => 'html', 'NAME' => 'Заголовок', 'SHOW_BORDER' => true)
					);
					?>
				</h2>
				<div class="base-text">
					<?
					$APPLICATION->IncludeFile(
						SITE_DIR . 'include/top-services/description.php',
						array(),
						array('MODE' => 'html', 'NAME' => 'Текст под заголовком', 'SHOW_BORDER' => true)
					);
					?>
				</div>
			</div>

			<div class="swiper autofill-slider">
				<div class="swiper-wrapper">
					<? foreach ($arResult["ITEMS"] as $arItem): ?>
						<?
						$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
						$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
						?>
						<div class="swiper-slide">
							<article class="top-service-card" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
								<img src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ? $arItem["PREVIEW_PICTURE"]["SRC"] : $templateFolder . "/tooth.png" ?>" alt="<?= $arItem["NAME"] ?>" width="100" height="100">
								<h3 class="base-subtitle"><?= $arItem["NAME"] ?></h3>
								<? if ($arItem["PROPERTIES"]["TOP_SERVICE_DESC"]["~VALUE"]): ?>
									<div class="top-service-card__desc"><?= $arItem["PROPERTIES"]["TOP_SERVICE_DESC"]["~VALUE"]["TEXT"] ?></div>
								<? endif; ?>
								<div class="top-service-card__footer">
									<? if ($arItem["TOP_SERVICE_PRICE_VALUE"]): ?>
										<p class="top-service-card__price"><?= $arItem["TOP_SERVICE_PRICE_VALUE"] ?></p>
									<? endif; ?>
									<div class="top-service-card__actions">
										<a class="main-btn main-btn--outlined" href="<?= $arItem["DETAIL_PAGE_URL"] ?>">Подробнее</a>
										<button class="main-btn" data-modal-opener="callback-modal" data-service-name="<?= $arItem['NAME'] ?>">Записаться</button>
									</div>
								</div>
							</article>
						</div>
					<? endforeach; ?>
				</div>
				<div class="top-services__navigation">
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
				<div class="swiper-pagination"></div>
			</div>
			<a class="main-btn main-btn--outlined top-services__btn" href="/prices/">Смотреть все цены</a>
		</div>
	</section>
<? endif; ?>