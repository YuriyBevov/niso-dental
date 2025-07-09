<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("description", "Контакты и схема проезда до стоматологической клиники НИСО в Санкт-Петербурге. График работы: ежедневно с 09:00 до 21:00, телефон: 8 (812) 327-51-54. Адрес: г. Санкт-Петербург ул. Профессора Попова д. 27, метро Петроградская.");
$APPLICATION->SetPageProperty("title", "Контакты стоматологической клиники НИСО | Как добраться - режим работы и схема проезда");
$APPLICATION->SetTitle("Контактная информация");
?>
<link rel="stylesheet" href="/contacts/style.css" />

<section class="base-section contacts">
  <div class="container">
    <div class="contacts__grid">
      <div class="contacts__grid-item contacts__grid-item--gallery">
        <? $APPLICATION->IncludeComponent(
          "bitrix:news.list",
          "gallery-slider",
          array(
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
            "DISPLAY_BOTTOM_PAGER" => "N",
            "DISPLAY_DATE" => "N",
            "DISPLAY_NAME" => "N",
            "DISPLAY_PICTURE" => "Y",
            "DISPLAY_PREVIEW_TEXT" => "N",
            "DISPLAY_TOP_PAGER" => "N",
            "FIELD_CODE" => array("", ""),
            "FILTER_NAME" => "",
            "HIDE_LINK_WHEN_NO_DETAIL" => "N",
            "IBLOCK_ID" => "12",
            "IBLOCK_TYPE" => "galleries",
            "INCLUDE_IBLOCK_INTO_CHAIN" => "N",
            "INCLUDE_SUBSECTIONS" => "N",
            "MESSAGE_404" => "",
            "NEWS_COUNT" => "",
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
            "PROPERTY_CODE" => array("", ""),
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
            "STRICT_SECTION_CHECK" => "N"
          )
        ); ?>
      </div>
      <div class="contacts__grid-item contacts__grid-item--info">
        <div class="base-section__header">
          <span class="base-text base-section__headline">
            <?
            $APPLICATION->IncludeFile(
              SITE_DIR . 'include/contacts/contacts-headline.php',
              array(),
              array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
            );
            ?>
          </span>
          <h1 class="base-title">Наши контакты</h1>

          <span class="base-text">
            <?
            $APPLICATION->IncludeFile(
              SITE_DIR . 'include/contacts/contacts-text.php',
              array(),
              array('MODE' => 'html', 'NAME' => 'описание', 'SHOW_BORDER' => true)
            );
            ?>
          </span>
        </div>

        <div class="contacts__field">
          <div class="contacts__field-title"><strong>Адрес:</strong></div>
          <div class="contacts__field-content">
            <svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
              <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-pin"></use>
            </svg>
            <address>
              <?
              $APPLICATION->IncludeFile(
                SITE_DIR . 'include/address.php',
                array(),
                array('MODE' => 'html', 'NAME' => 'адрес', 'SHOW_BORDER' => true)
              );
              ?>
            </address>
          </div>
        </div>

        <div class="contacts__field">
          <div class="contacts__field-title"><strong>График работы:</strong></div>
          <div class="contacts__field-content">
            <svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
              <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-info"></use>
            </svg>
            <?
            $APPLICATION->IncludeFile(
              SITE_DIR . 'include/schedule.php',
              array(),
              array('MODE' => 'html', 'NAME' => 'время работы', 'SHOW_BORDER' => true)
            );
            ?>
          </div>
        </div>

        <div class="contacts__field">
          <div class="contacts__field-title"><strong>Телефон:</strong></div>
          <div class="contacts__field-content">
            <svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
              <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-phone"></use>
            </svg>
            <?
            $APPLICATION->IncludeFile(
              SITE_DIR . 'include/phone.php',
              array(),
              array('MODE' => 'html', 'NAME' => 'телефон', 'SHOW_BORDER' => true)
            );
            ?>
          </div>
        </div>

        <div class="contacts__field">
          <div class="contacts__field-title"><strong>Электронная почта:</strong></div>
          <div class="contacts__field-content">
            <svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
              <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-mail"></use>
            </svg>
            <?
            $APPLICATION->IncludeFile(
              SITE_DIR . 'include/mail.php',
              array(),
              array('MODE' => 'html', 'NAME' => 'эл.почту', 'SHOW_BORDER' => true)
            );
            ?>
          </div>
        </div>

        <div class="contacts__field">
          <div class="contacts__field-title"><strong>Соц.сети:</strong></div>
          <div class="contacts__field-content">
            <? $APPLICATION->IncludeComponent(
              "bitrix:news.list",
              "social",
              array(
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
                "DISPLAY_BOTTOM_PAGER" => "N",
                "DISPLAY_DATE" => "N",
                "DISPLAY_NAME" => "N",
                "DISPLAY_PICTURE" => "N",
                "DISPLAY_PREVIEW_TEXT" => "N",
                "DISPLAY_TOP_PAGER" => "N",
                "FIELD_CODE" => array(
                  0 => "",
                  1 => "",
                ),
                "FILTER_NAME" => "",
                "HIDE_LINK_WHEN_NO_DETAIL" => "N",
                "IBLOCK_ID" => "5",
                "IBLOCK_TYPE" => "site_content",
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
                "PROPERTY_CODE" => array(
                  0 => "LINK",
                  1 => "ICON",
                ),
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
                "COMPONENT_TEMPLATE" => "social"
              ),
              false
            ); ?>
          </div>
        </div>
      </div>

      <div class="contacts__grid-item contacts__grid-item--map">
        <?
        $APPLICATION->IncludeFile(
          SITE_DIR . 'include/map.php',
          array(),
          array('MODE' => 'html', 'NAME' => 'карту', 'SHOW_BORDER' => true)
        );
        ?>
      </div>
    </div>
  </div>
</section>

<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>