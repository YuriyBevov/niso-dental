<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<? if (!empty($arResult)): ?>
  <nav class="top-menu">
    <ul>
      <?
      $previousLevel = 0;
      foreach ($arResult as $arItem): ?>
        <? if ($previousLevel && $arItem["DEPTH_LEVEL"] < $previousLevel): ?>
          <?= str_repeat("</ul></li>", ($previousLevel - $arItem["DEPTH_LEVEL"])); ?>
        <? endif ?>
        <? if ($arItem["IS_PARENT"]): ?>
          <? if ($arItem["DEPTH_LEVEL"] == 1): ?>
            <li class="lw-dropdown-menu">
              <a href="<?= $arItem["LINK"] ?>">
                <?= $arItem["TEXT"] ?>
                <div class="top-menu-inner-opener">
                  <svg width="12" height="12" role="img" aria-hidden="true" focusable="false">
                    <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-menu-arrow"></use>
                  </svg>
                </div>
              </a>
              <div class="top-menu__inner-wrapper">
                <ul>
                <? else: ?>
                  <li>
                    <? if ($arItem["LINK"]) : ?>
                      <a href="<?= $arItem["LINK"] ?>">
                        <?= $arItem["TEXT"] ?>
                        <div class="top-menu-inner-opener">
                          <svg width="12" height="12" role="img" aria-hidden="true" focusable="false">
                            <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-menu-arrow"></use>
                          </svg>
                        </div>
                      </a>
                    <? else: ?>
                      <span>
                        <?= $arItem["TEXT"] ?>
                        <div class="top-menu-inner-opener">
                          <svg width="12" height="12" role="img" aria-hidden="true" focusable="false">
                            <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-menu-arrow"></use>
                          </svg>
                        </div>
                      </span>
                    <? endif; ?>
                    <div class="top-menu__inner-wrapper">
                      <ul>
                      <? endif ?>
                    <? else: ?>
                      <? if ($arItem["LINK"]): ?>
                        <? if ($arItem["PERMISSION"] > "D"): ?>
                          <? if ($arItem["DEPTH_LEVEL"] == 1): ?>
                            <li>
                              <a href="<?= $arItem["LINK"] ?>"><?= $arItem["TEXT"] ?></a>
                            </li>
                          <? else: ?>
                            <li>
                              <a href="<?= $arItem["LINK"] ?>"><?= $arItem["TEXT"] ?></a>
                            </li>
                          <? endif ?>

                        <? else: ?>
                          <? if ($arItem["DEPTH_LEVEL"] == 1): ?>
                            <li><span title="<?= GetMessage("MENU_ITEM_ACCESS_DENIED") ?>"><?= $arItem["TEXT"] ?></span></li>
                          <? else: ?>
                            <li><span title="<?= GetMessage("MENU_ITEM_ACCESS_DENIED") ?>"><?= $arItem["TEXT"] ?></span></li>
                          <? endif ?>
                        <? endif ?>
                      <? endif ?>
                    <? endif ?>
                    <? $previousLevel = $arItem["DEPTH_LEVEL"]; ?>
                  <? endforeach ?>
                  <? if ($previousLevel > 1): //close last item tags
                  ?>
                    <?= str_repeat("</ul></div></li>", ($previousLevel - 1)); ?>
                  <? endif ?>
                      </ul>
  </nav>
<? endif ?>
