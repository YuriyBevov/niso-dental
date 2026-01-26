<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
  <section id="staff" class="section staff">
    <div class="container">
      <div class="section__header">
        <h2 class="title"><?= $arResult["NAME"] ?></h2>
      </div>

      <div class="grid">
        <div class="grid__item">
          <div class="swiper auto-fill-slider">
            <div class="swiper-wrapper">
              <? foreach ($arResult["ITEMS"] as $arItem): ?>
                <div class="swiper-slide">
                  <div class="staff-card">
                    <img src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ?>" alt="<?= $arItem["NAME"] ?>" width="240" height="240">
                    <div class="staff-card__content">
                      <span class="staff-card__title"><?= $arItem["NAME"] ?></span>
                      <div class="staff-card__descr">
                        <?= $arItem["PREVIEW_TEXT"] ?>
                      </div>
                    </div>

                    <button class="btn" data-form-id="6" data-staff-name="<?= $arItem["NAME"] ?>">Записаться</button>
                  </div>
                </div>
              <? endforeach; ?>
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </div>

        <div class="grid__item grid__item--picture">
          <img src="<?= CFile::GetPath($arResult["PICTURE"]);  ?>" alt="<?= $arResult["NAME"] ?>" width="560" height="560">
        </div>
      </div>

      <? $APPLICATION->IncludeComponent(
        "bitrix:news.list",
        "slider-block",
        [
          "ACTIVE_DATE_FORMAT" => "d.m.Y",
          "ADD_SECTIONS_CHAIN" => "N",
          "AJAX_MODE" => "N",
          "AJAX_OPTION_ADDITIONAL" => "",
          "AJAX_OPTION_HISTORY" => "N",
          "AJAX_OPTION_JUMP" => "N",
          "AJAX_OPTION_STYLE" => "Y",
          "CACHE_FILTER" => "N",
          "CACHE_GROUPS" => "Y",
          "CACHE_TIME" => "36000000",
          "CACHE_TYPE" => "A",
          "CHECK_DATES" => "Y",
          "DETAIL_URL" => "",
          "DISPLAY_BOTTOM_PAGER" => "Y",
          "DISPLAY_DATE" => "N",
          "DISPLAY_NAME" => "N",
          "DISPLAY_PICTURE" => "N",
          "DISPLAY_PREVIEW_TEXT" => "N",
          "DISPLAY_TOP_PAGER" => "N",
          "FIELD_CODE" => [
            0 => "IBLOCK_ID",
            1 => "",
          ],
          "FILTER_NAME" => "",
          "HIDE_LINK_WHEN_NO_DETAIL" => "N",
          "IBLOCK_ID" => "34",
          "IBLOCK_TYPE" => "niso_implant",
          "INCLUDE_IBLOCK_INTO_CHAIN" => "N",
          "INCLUDE_SUBSECTIONS" => "N",
          "MESSAGE_404" => "",
          "NEWS_COUNT" => "20",
          "PAGER_BASE_LINK_ENABLE" => "N",
          "PAGER_DESC_NUMBERING" => "N",
          "PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
          "PAGER_SHOW_ALL" => "N",
          "PAGER_SHOW_ALWAYS" => "N",
          "PAGER_TEMPLATE" => ".default",
          "PAGER_TITLE" => "Новости",
          "PARENT_SECTION" => "",
          "PARENT_SECTION_CODE" => "",
          "PREVIEW_TRUNCATE_LEN" => "",
          "PROPERTY_CODE" => [
            0 => "",
            1 => "ICON",
            2 => "",
          ],
          "SET_BROWSER_TITLE" => "N",
          "SET_LAST_MODIFIED" => "N",
          "SET_META_DESCRIPTION" => "N",
          "SET_META_KEYWORDS" => "N",
          "SET_STATUS_404" => "N",
          "SET_TITLE" => "N",
          "SHOW_404" => "N",
          "SORT_BY1" => "ACTIVE_FROM",
          "SORT_BY2" => "SORT",
          "SORT_ORDER1" => "DESC",
          "SORT_ORDER2" => "ASC",
          "STRICT_SECTION_CHECK" => "N",
          "COMPONENT_TEMPLATE" => "licenses"
        ],
        $component
      ); ?>

      <? $APPLICATION->IncludeComponent(
        "bitrix:news.list",
        "slider-block",
        [
          "ACTIVE_DATE_FORMAT" => "d.m.Y",
          "ADD_SECTIONS_CHAIN" => "N",
          "AJAX_MODE" => "N",
          "AJAX_OPTION_ADDITIONAL" => "",
          "AJAX_OPTION_HISTORY" => "N",
          "AJAX_OPTION_JUMP" => "N",
          "AJAX_OPTION_STYLE" => "Y",
          "CACHE_FILTER" => "N",
          "CACHE_GROUPS" => "Y",
          "CACHE_TIME" => "36000000",
          "CACHE_TYPE" => "A",
          "CHECK_DATES" => "Y",
          "DETAIL_URL" => "",
          "DISPLAY_BOTTOM_PAGER" => "Y",
          "DISPLAY_DATE" => "N",
          "DISPLAY_NAME" => "N",
          "DISPLAY_PICTURE" => "N",
          "DISPLAY_PREVIEW_TEXT" => "N",
          "DISPLAY_TOP_PAGER" => "N",
          "FIELD_CODE" => [
            0 => "IBLOCK_ID",
            1 => "",
          ],
          "FILTER_NAME" => "",
          "HIDE_LINK_WHEN_NO_DETAIL" => "N",
          "IBLOCK_ID" => "33",
          "IBLOCK_TYPE" => "niso_implant",
          "INCLUDE_IBLOCK_INTO_CHAIN" => "N",
          "INCLUDE_SUBSECTIONS" => "N",
          "MESSAGE_404" => "",
          "NEWS_COUNT" => "20",
          "PAGER_BASE_LINK_ENABLE" => "N",
          "PAGER_DESC_NUMBERING" => "N",
          "PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
          "PAGER_SHOW_ALL" => "N",
          "PAGER_SHOW_ALWAYS" => "N",
          "PAGER_TEMPLATE" => ".default",
          "PAGER_TITLE" => "Новости",
          "PARENT_SECTION" => "",
          "PARENT_SECTION_CODE" => "",
          "PREVIEW_TRUNCATE_LEN" => "",
          "PROPERTY_CODE" => [
            0 => "",
            1 => "ICON",
            2 => "",
          ],
          "SET_BROWSER_TITLE" => "N",
          "SET_LAST_MODIFIED" => "N",
          "SET_META_DESCRIPTION" => "N",
          "SET_META_KEYWORDS" => "N",
          "SET_STATUS_404" => "N",
          "SET_TITLE" => "N",
          "SHOW_404" => "N",
          "SORT_BY1" => "ACTIVE_FROM",
          "SORT_BY2" => "SORT",
          "SORT_ORDER1" => "DESC",
          "SORT_ORDER2" => "ASC",
          "STRICT_SECTION_CHECK" => "N",
          "COMPONENT_TEMPLATE" => "gallery"
        ],
        $component
      ); ?>

    </div>
  </section>
<? endif; ?>