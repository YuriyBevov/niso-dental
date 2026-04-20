<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
$this->setFrameMode(true);
?>

<? if (!empty($arResult["ITEMS"])): ?>
	<ul class="awards-list">
		<? foreach ($arResult["ITEMS"] as $arItem):
			$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
			$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
		?>
			<? if (!empty($arItem["PROPERTIES"]["IMAGE"]["VALUE"])): ?>
				<li class="awards-list__item" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
					<? $imgSrc = CFile::GetPath($arItem["PROPERTIES"]["IMAGE"]["VALUE"]) ?>
					<img src="<?= $imgSrc ?>" alt="<?= $arItem["NAME"] ?>" width="91" height="48">
				</li>
			<? endif; ?>
		<? endforeach; ?>
	</ul>
<? endif; ?>