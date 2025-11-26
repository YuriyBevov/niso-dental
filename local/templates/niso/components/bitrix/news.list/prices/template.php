<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
$this->setFrameMode(true);
?>

<section class="base-section prices">
	<div class="container">
		<div class="base-section__header">
			<span class="base-text base-section__headline">
			</span>
			<h1 class="base-title"><?= $arResult["NAME"] ?></h1>
			<?if (!empty($arResult['DESCRIPTION'])) :?>
				<?if ($arResult['DESCRIPTION_TYPE'] == 'html') :?>
					<div class="content"><?= $arResult["DESCRIPTION"]?></div>
				<?else :?>
					<span class="base-text"><?= $arResult["DESCRIPTION"]?></span>
				<?endif;?>
			<?endif;?>
		</div>
		<div class="accordeon --first-item-expanded">
			<? foreach ($arResult['SECTIONS'] as $arSection):
				$this->AddEditAction($arSection['ID'], $arSection['EDIT_LINK'], CIBlock::GetArrayByID($arSection["IBLOCK_ID"], "ELEMENT_EDIT"));
				$this->AddDeleteAction($arSection['ID'], $arSection['DELETE_LINK'], CIBlock::GetArrayByID($arSection["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
			?>
				<div class="accordeon-item" id="<?= $this->GetEditAreaId($arSection['ID']); ?>">
					<div class="accordeon-header">
						<span class="base-subtitle">
						<?= $arSection["NAME"] ?></span>
						<div class="accordeon-opener">
							<svg width="40" height="40" role="img" aria-hidden="true" focusable="false">
								<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-arrow-down"></use>
							</svg>
						</div>
					</div>
					<div class="accordeon-body">
						<div class="content-block">
								<? foreach ($arSection['ITEMS'] as $arItem): ?>
									<div class="content-block__item">
										<span><?=$arItem['NAME']?></span>
										<div class="content-block__wrapper">
											<strong><?=$arItem['PROPERTIES']['SERVICE_PRICE']['VALUE']?></strong>
											<button class="main-btn" data-modal-opener="callback-modal" data-service-name="<?=$arItem['NAME'], $arItem['PROPERTIES']['SERVICE_PRICE']['VALUE']?>">Записаться на прием</button>
										</div>
									</div>
								<?endforeach; ?>
							</ul>
						</div>
					</div>
				</div>
			<? endforeach; ?>
		</div>
	</div>
</section>
