<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
  <div class="swiper main-slider">
    <div class="swiper-wrapper">
      <? foreach ($arResult["ITEMS"] as $arItem):
        $this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
        $this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
      ?>
        <div class="swiper-slide" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
          <img src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ?>" alt="<?= $ARITEM["NAME"] ?>" width="400" height="300">
        </div>
      <? endforeach; ?>
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-navigation">
      <button class="swiper-button swiper-button-prev" type="button" aria-label="Назад">
        <svg width="22" height="22" role="img" aria-hidden="true" focusable="false">
          <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-arrow"></use>
        </svg>
      </button>
      <button class="swiper-button swiper-button-next" type="button" aria-label="Вперед">
        <svg width="22" height="22" role="img" aria-hidden="true" focusable="false">
          <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-arrow"></use>
        </svg>
      </button>
    </div>
  </div>
<? endif; ?>