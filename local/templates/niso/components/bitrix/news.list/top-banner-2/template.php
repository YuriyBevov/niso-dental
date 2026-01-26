<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
  <div class="swiper top-banner-slider">
    <div class="swiper-wrapper">
      <?
      foreach ($arResult["ITEMS"] as $arItem):
        $this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
        $this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));

        if ($arItem["PROPERTIES"]["FORM_BUTTON"]["VALUE"]["SUB_VALUES"]["FORM_ID"]["VALUE"] == '1') {
          $formID = 'callback-modal';
        }

        if ($arItem["PROPERTIES"]["FORM_BUTTON"]["VALUE"]["SUB_VALUES"]["FORM_ID"]["VALUE"] == '2') {
          $formID = 'review-modal';
        }
      ?>
        <div class="swiper-slide" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
          <div class="top-banner-wrapper">
            <div class="top-banner <?=$arItem["PROPERTIES"]["UNDERLAY"]["VALUE_XML_ID"]?>" style="background:none; background-color: <?=$arItem["PROPERTIES"]["BACKGROUND_COLOR"]["VALUE_XML_ID"]?>; background-image: url('<?=$arItem["PREVIEW_PICTURE"]["SRC"]?>'); background-repeat: no-repeat; background-position: top right; background-size: contain; text-shadow: <?=$arItem["PROPERTIES"]["TEXT_OUTLINE"]["VALUE"]?>">

              <div class="top-banner__content">

                <?if ($arItem["PREVIEW_TEXT"]):?>
                  <span class="base-text top-banner__headline">
                    <?= $arItem["PREVIEW_TEXT"] ?>
                  </span>
                <?endif;?>

                <? if ($arItem["PROPERTIES"]["H1_TITLE"]["VALUE"] == "Y" && $arParams["LW_IS_INNER"] !== "Y"): ?>
                  <h1 class="main-title top-banner__title"><?= $arItem["NAME"] ?></h1>
                <? else: ?>
                  <span class="main-title top-banner__title"><?= $arItem["NAME"] ?></span>
                <? endif; ?>


                <?if ($arItem["DETAIL_TEXT"]):?>
                  <div class="content-block">
                    <?= $arItem["DETAIL_TEXT"] ?>
                  </div>
                <?endif;?>


                <? if (!empty($arItem["PROPERTIES"]["LINK"]["VALUE"]["SUB_VALUES"]["LINK_URL"]["VALUE"])): ?>
                  <a class="main-btn" href="<?= $arItem["PROPERTIES"]["LINK"]["VALUE"]["SUB_VALUES"]["LINK_URL"]["VALUE"] ?>">
                    <span>
                      <?= $arItem["PROPERTIES"]["LINK"]["VALUE"]["SUB_VALUES"]["LINK_TITLE"]["VALUE"] ?>
                    </span>
                  </a>
                <? endif; ?>

                <? if (empty($arItem["PROPERTIES"]["LINK"]["VALUE"]["SUB_VALUES"]["LINK_URL"]["VALUE"]) && !empty($arItem["PROPERTIES"]["FORM_BUTTON"]["VALUE"]["SUB_VALUES"]["BUTTON_TITLE"]["VALUE"])): ?>
                  <button class="main-btn" type="button" data-modal-opener="<?= $formID ?>" style="background-color:<?=$arItem["PROPERTIES"]["BUTTON_COLOR"]["VALUE_XML_ID"]?>">
                    <span>
                      <?= $arItem["PROPERTIES"]["FORM_BUTTON"]["VALUE"]["SUB_VALUES"]["BUTTON_TITLE"]["VALUE"] ?>
                    </span>
                  </button>
                <? endif; ?>

                <!-- <?if ($arItem["PREVIEW_PICTURE"]["SRC"]):?> -->
                    <!-- <img class="top-banner__content-img" src="<?=$arItem["PREVIEW_PICTURE"]["SRC"]?>" alt="<?$arItem["NAME"]?>" width="602" height="550"> -->
                <!-- <?endif;?> -->
              </div>


            </div>
          </div>
        </div>
      <? endforeach; ?>
    </div>
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
