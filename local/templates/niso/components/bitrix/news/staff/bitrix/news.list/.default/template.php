<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<section class="base-section staff">
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

		<div class="staff__grid">
			<? foreach ($arResult["ITEMS"] as $arItem):
				$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
				$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
			?>
				<div class="staff__grid-item">
					<? include($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/partials/staff-preview-card/staff-preview-card.php"); ?>
				</div>
			<? endforeach; ?>
		</div>

		<? if ($arParams["DISPLAY_BOTTOM_PAGER"]): ?>
			<?= $arResult["NAV_STRING"] ?>
		<? endif; ?>
	</div>
</section>

<? if ($arParams["DISPLAY_TOP_PAGER"]): ?>
	<?= $arResult["NAV_STRING"] ?><br />
<? endif; ?>