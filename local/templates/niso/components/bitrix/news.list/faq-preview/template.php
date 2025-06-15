<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
	<section class="base-section faq-preview">
		<div class="container">
			<div class="base-section__header">
				<span class="base-text base-section__headline">
					<?
					$APPLICATION->IncludeFile(
						SITE_DIR . 'include/headlines/faq-headline.php',
						array(),
						array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
					);
					?>
				</span>
				<h2 class="base-title"><?= $arResult["NAME"] ?></h2>
				<span class="base-text"><?= $arResult["DESCRIPTION"] ?></span>
			</div>

			<div class="accordeon">
				<? foreach ($arResult["ITEMS"] as $arItem):
					$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
					$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
				?>
					<div class="accordeon-item" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
						<div class="accordeon-header">
							<span class="base-subtitle"><?= $arItem["NAME"] ?></span>
							<div class="accordeon-opener">
								<svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
									<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-plus"></use>
								</svg>
							</div>
						</div>
						<div class="accordeon-body">
							<div class="content-block">
								<?= $arItem["PREVIEW_TEXT"] ?>
							</div>
						</div>
					</div>
				<? endforeach; ?>
			</div>
		</div>
	</section>
<? endif; ?>