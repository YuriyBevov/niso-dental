<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
	<div class="social-block">
		<? foreach ($arResult["ITEMS"] as $arItem):
			$icon = CFile::GetPath($arItem["PROPERTIES"]["ICON"]["VALUE"]);

			$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
			$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
		?>
			<a class="social-block__item" id="<?= $this->GetEditAreaId($arItem['ID']); ?>" href="<?= $arItem["PROPERTIES"]["LINK"]["VALUE"] ?>" aria-label="<?= $arItem["NAME"] ?>" rel="noopener nofollow norefferer">
				<img src="<?= $icon ?>" alt="<?= $arItem["NAME"] ?>" width="40" height="40">
			</a>
		<? endforeach; ?>
	</div>
<? endif; ?>