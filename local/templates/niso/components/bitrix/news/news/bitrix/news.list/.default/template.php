<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<section class="base-section news">
	<div class="container">
		<div class="base-section__header">
			<h2 class="base-title"><?= $arResult["NAME"] ?></h2>
			<? if ($arResult["DESCRIPTION"]): ?>
				<span class="base-text"><?= $arResult["DESCRIPTION"] ?></span>
			<? endif; ?>
		</div>

		<div class="news__grid news__grid--3cols">
			<? foreach ($arResult["ITEMS"] as $arItem):
				$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
				$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
			?>

				<? include($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/partials/base-card/base-card.php"); ?>

			<? endforeach; ?>
		</div>

		<? if ($arParams["DISPLAY_BOTTOM_PAGER"]): ?>
			<?= $arResult["NAV_STRING"] ?>
		<? endif; ?>
	</div>
</section>