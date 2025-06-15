<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$this->setFrameMode(true);

$strSectionEdit = CIBlock::GetArrayByID($arParams["IBLOCK_ID"], "SECTION_EDIT");
$strSectionDelete = CIBlock::GetArrayByID($arParams["IBLOCK_ID"], "SECTION_DELETE");
$arSectionDeleteParams = array("CONFIRM" => GetMessage('CT_BCSL_ELEMENT_DELETE_CONFIRM'));
?>

<!-- $this->AddEditAction($arResult['SECTION']['ID'], $arResult['SECTION']['EDIT_LINK'], $strSectionEdit);
$this->AddDeleteAction($arResult['SECTION']['ID'], $arResult['SECTION']['DELETE_LINK'], $strSectionDelete, $arSectionDeleteParams);
id="<?= $this->GetEditAreaId($arResult['SECTION']['ID']); ?>" -->

<!-- catalog-preview -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/catalog-preview/catalog-preview.php"); ?>
<!-- catalog-preview -->