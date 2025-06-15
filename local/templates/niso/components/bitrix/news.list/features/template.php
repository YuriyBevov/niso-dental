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

<? if ($arResult["ITEMS"]): ?>
  <section class="base-section features">
    <div class="container">
      <div class="base-section__header">
        <span class="base-text base-section__headline">
          <?
          $APPLICATION->IncludeFile(
            SITE_DIR . 'include/headlines/features-headline.php',
            array(),
            array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
          );
          ?>
        </span>
        <h2 class="base-title"><?= $arResult["NAME"] ?></h2>
        <? if ($arResult["DESCRIPTION"]): ?>
          <span class="base-text"><?= $arResult["DESCRIPTION"] ?></span>
        <? endif; ?>
      </div>
      <div class="features__grid">
        <? foreach ($arResult["ITEMS"] as $arItem):
          $this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
          $this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
        ?>

          <div class="features__grid-item" id="<?= $this->GetEditAreaId($arItem['ID']); ?>">
            <div class="feature-card-wrapper">
              <div class="feature-card">
                <? if ($arItem["PREVIEW_PICTURE"]): ?>
                  <img loading="lazy" src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ?>" alt="<?= $arItem["NAME"] ?>" width="80" height="80">
                <? endif; ?>
                <span class="base-subtitle"><?= $arItem["NAME"] ?></span>
                <span class="base-text"><?= $arItem["PREVIEW_TEXT"] ?></span>
              </div>
            </div>
          </div>

        <? endforeach; ?>
      </div>
    </div>
  </section>
<? endif; ?>