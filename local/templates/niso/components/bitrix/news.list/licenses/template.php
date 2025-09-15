<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
$this->setFrameMode(true);
?>
<section class="base-section">
	<div class="container">
		<div class="base-section__header">
			<h1 class="base-title"><?=$arResult["NAME"]?></h1>
			<?if ($arResult["DESCRIPTION"]):?>
				<?=$arResult["DESCRIPTION"]?>
			<?endif;?>
		</div>
		<?if ($arResult["ITEMS"]):?>
			<div class="licenses">
				<?foreach($arResult["ITEMS"] as $arItem):
					$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
					$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
				?>
					<div class="license" id="<?=$this->GetEditAreaId($arItem["ID"]);?>">
						<img data-fancybox="gallery" class="license__image" src="<?=$arItem["PREVIEW_PICTURE"]["SRC"]?>" alt="<?=$arItem["NAME"]?>">
					</div>
				<?endforeach;?>
			</div>
		<?endif;?>
	</div>
</section>

