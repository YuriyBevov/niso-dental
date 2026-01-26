<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<section class="base-section sales-detail">
	<div class="container">
		<div class="base-section__header">
			<span class="base-text base-section__headline">
				<?
				$APPLICATION->IncludeFile(
					SITE_DIR . 'include/headlines/sales-headline.php',
					array(),
					array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
				);
				?>
			</span>

			<h1 class="base-title"><?= $arResult["NAME"] ?></h1>
			<span class="base-text">
				<?= $arResult["~PREVIEW_TEXT"] ?>
			</span>
		</div>
		<div class="sales-detail__grid">
			<div class="sales-detail__grid-item">
				<img src="<?= $arResult["DETAIL_PICTURE"]["SRCSET"] ?>" alt="<?= $arResult["NAME"] ?>" width="800" height="500">
			</div>

			<div class="sales-detail__grid-item">
				<? if ($arResult["DATE_ACTIVE_TO"]): ?>
					<small>Действует до <?= $arResult["DATE_ACTIVE_TO"] ?>г.</small>
				<? endif; ?>
				<? if ($arResult["DISPLAY_PROPERTIES"]["CONDITIONS"]["VALUE"]): ?>
					<span class="base-subtitle">Условия:</span>
					<span class="base-text"><?= $arResult["DISPLAY_PROPERTIES"]["CONDITIONS"]["~VALUE"] ?></span>
				<? endif; ?>

				<? if ($arResult["DATE_ACTIVE_FROM"] && $arResult["DATE_ACTIVE_TO"]): ?>
					<span class="base-subtitle">Сроки проведения:</span>
					<span class="base-text">Акция доступна с <?= $arResult["DATE_ACTIVE_FROM"] ?>г. по <?= $arResult["DATE_ACTIVE_TO"] ?>г.</span>
				<? endif; ?>

				<? if ($arResult["DISPLAY_PROPERTIES"]["RESTRICTIONS"]["VALUE"]): ?>
					<span class="base-subtitle">Ограничения:</span>
					<span class="base-text"><?= $arResult["DISPLAY_PROPERTIES"]["RESTRICTIONS"]["~VALUE"] ?></span>
				<? endif; ?>

				<button class="main-btn" type="button" data-modal-opener="callback-modal">Оставить заявку</button>
			</div>

			<div class="sales-detail__grid-item sales-detail__grid-item--detail-text">
				<div class="content-block">
					<?= $arResult["DETAIL_TEXT"] ?>
				</div>
			</div>
		</div>
	</div>
</section>