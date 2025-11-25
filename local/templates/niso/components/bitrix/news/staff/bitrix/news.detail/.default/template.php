<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true); ?>

<section class="base-section staff-detail">
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
			<h1 class="base-title"><?= $arResult["NAME"] ?></h1>
		</div>
		<div class="staff-detail__grid">
			<div class="staff-detail__grid-item staff-detail__grid-item--side">
				<div class="staff-detail__img-wrapper">
					<img src="<?= $arResult["DETAIL_PICTURE"]["SRC"] ?>" alt="<?= $arResult["NAME"] ?>" width="500" height="500">
				</div>
			</div>
			<div class="staff-detail__grid-item content">
				<? if ($arResult["PROPERTIES"]["POSITION"]["VALUE"]): ?>
					<strong>Должность</strong>
					<span><?= $arResult["PROPERTIES"]["POSITION"]["VALUE"] ?></span>
				<? endif; ?>
				<? if (!empty($arResult["PROPERTIES"]["DESCR_FIELD"]["~VALUE"])): ?>
					<? foreach ($arResult["PROPERTIES"]["DESCR_FIELD"]["~VALUE"] as $arField): ?>
						<strong><?= $arField["SUB_VALUES"]["DESCR_TITLE"]["~VALUE"] ?></strong>
						<?= $arField["SUB_VALUES"]["DESCR_CONTENT"]["~VALUE"]["TEXT"] ?>
					<? endforeach; ?>
				<? endif; ?>
				<button class="main-btn" data-modal-opener="callback-modal" data-doctor-name="<?= $arResult["NAME"] ?>">
					<span>Записаться на прием</span>
				</button>

				<? if ($arResult["DETAIL_TEXT"]): ?>
					<div class="content">
						<?= $arResult["DETAIL_TEXT"] ?>
					</div>
				<? endif; ?>
			</div>
		</div>

	</div>
</section>
