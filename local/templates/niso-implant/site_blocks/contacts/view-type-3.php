<section id="contacts" class="section contacts --grid-view-type-3">
  <div class="container">
    <?
    $APPLICATION->IncludeFile(
      SITE_TEMPLATE_PATH . "/includes/section-header.php",
      array("TITLE" => "Контакты", "DESCRIPTION" => "Cвяжитесь с нами удобным для Вас способом"),
      array("MODE" => "html", "SHOW_BORDER" => false)
    );
    ?>
  </div>
  <div class="grid">
    <div class="container">
      <div class="contacts__content">
        <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_PHONES"]): ?>
          <div class="contacts__content-field">
            <span class="contacts__content-field-title">Телефоны:</span>
            <? foreach ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_PHONES"] as $arPhone): ?>
              <?= phoneToLink($arPhone) ?>
            <? endforeach; ?>
          </div>
        <? endif; ?>

        <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_ADDRESS"]): ?>
          <div class="contacts__content-field">
            <span class="contacts__content-field-title">Адрес:</span>
            <address>
              <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_ADDRESS"] ?>
            </address>
          </div>
        <? endif; ?>

        <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_MAILS"]): ?>
          <div class="contacts__content-field">
            <span class="contacts__content-field-title">Эл. почта:</span>
            <? foreach ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_MAILS"] as $arMail): ?>
              <?= emailToLink($arMail) ?>
            <? endforeach; ?>
          </div>
        <? endif; ?>

        <div class="contacts__content-field contacts__content-field--social">
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
              "IBLOCK_ID" => "22",
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
    <div class="container-fluid">
      <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_YMAPS_LINK"]): ?>
        <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_YMAPS_LINK"] ?>
      <? endif; ?>
    </div>
  </div>
</section>