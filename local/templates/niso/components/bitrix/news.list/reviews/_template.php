<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
$yandexReviewsWidgetLink = \Bitrix\Main\Config\Option::get("askaron.settings", "UF_YANDEX_REVIEWS_WIDGET");
?>

<? if ($arResult["ITEMS"]): ?>
	<section class="base-section reviews-preview">
		<div class="container">
			<div class="base-section__header">
				<span class="base-text base-section__headline">Что о нас говорят</span>
				<h2 class="base-title"><?= $arResult["NAME"] ?></h2>
			</div>
			<div class="reviews-preview__grid">
				<? if ($yandexReviewsWidgetLink): ?>
					<div class="reviews-preview__grid-item">
						<iframe src="<?= $yandexReviewsWidgetLink ?>"></iframe>
					</div>
				<? endif; ?>
				<div class="reviews-preview__grid-item">
					<div class="reviews-preview__inner-grid">
						<? foreach ($arResult["ITEMS"] as $arItem):
							$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
							$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
						?>
							<? $APPLICATION->IncludeComponent(
								"lw:lw-cards",
								"review-card",
								array(
									"BX_ITEM_ID" => $this->GetEditAreaId($arItem['ID']),
									"CACHE_TIME" => "36000000",
									"CACHE_TYPE" => "A",
									"ARR_RESULT" => $arItem
								),
								$component
							); ?>
						<? endforeach; ?>
					</div>
					<div class="reviews-preview__button-row">
						<a class="main-btn main-btn--outlined" href="/reviews/">
							<span>Смотреть все отзывы</span>
						</a>
						<button class="main-btn" type="button">
							<span>Оставить отзыв</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
<? endif; ?>