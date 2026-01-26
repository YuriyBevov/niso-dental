<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<div class="video-reviews-container">
	<div class="video-reviews">
		<? foreach ($arResult["ITEMS"] as $arItem): ?>
			<?
			$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
			$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
			?>
			<div class="video-reviews__item" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
				<iframe loading="lazy" width="320" height="410" src="https://rutube.ru/play/embed/<?= $arItem["CODE"] ?>" allow="picture-in-picture" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
			</div>
		<? endforeach; ?>
	</div>
</div>