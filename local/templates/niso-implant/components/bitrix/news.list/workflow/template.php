<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
  <div class="section workflow">
    <div class="container">
      <div class="section__header">
        <h2 class="title"><?= $arResult["NAME"] ?></h2>
      </div>
      <ul class="workflow__list">
        <? foreach ($arResult["ITEMS"] as $arItem):
          $src = CFile::GetPath($arItem["PROPERTIES"]["ICON"]["VALUE"]);
        ?>
          <li class="workflow__list-item">
            <div class="workflow__list-item-icon">
              <img src="<?= $src ?>" alt="<?= $arItem["NAME"] ?>" width="40" height="40">
            </div>
            <span class="base-text"><?= $arItem["~NAME"] ?></span>
          </li>
        <? endforeach; ?>
      </ul>

      <? $APPLICATION->IncludeFile(
        SITE_TEMPLATE_PATH . '/include/form-block.php',
        array(
          'TITLE' => 'Запишитесь на консультацию — бесплатно&nbsp;сегодня',
          'BUTTON_TEXT' => '',
          'FORM_ID' => '11',
        ),
        array('MODE' => 'html', 'SHOW_BORDER' => false)
      ); ?>
    </div>
  </div>
<? endif; ?>
