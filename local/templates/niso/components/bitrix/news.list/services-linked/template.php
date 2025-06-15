<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
	<section class="base-section services-linked">
		<div class="container">
			<div class="base-section__header">
				<? if ($arParams["HIDE_HEADLINE"] !== "Y"): ?>
					<span class="base-text base-section__headline">Возможно, Вам будет интересно</span>
				<? endif; ?>
				<h2 class="base-title"><?= $arParams["CUSTOM_TITLE"] ? $arParams["CUSTOM_TITLE"] : "Похожие услуги" ?></h2>
			</div>
			<div class="services-linked">
				<div class="swiper autofill-slider">
					<div class="swiper-wrapper">
						<? foreach ($arResult["ITEMS"] as $arItem):
							$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
							$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
						?>
							<div class="swiper-slide">
								<div class="services-linked__item-container" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
									<a class="services-linked__item" href="/services/<?= $arItem["DETAIL_PAGE_URL"] ?>">
										<img src="/img/tooth-img.svg" alt="Иконка" width="40" height="40">
										<span class="base-subtitle"><?= $arItem["NAME"] ?></span>
										<small class="base-text">Подробнее о услуге</small>
									</a>
								</div>
							</div>
						<? endforeach; ?>
					</div>
					<div class="swiper-pagination"></div>
				</div>
			</div>
		</div>
	</section>
<? endif; ?>