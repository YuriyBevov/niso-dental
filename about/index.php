<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("description", "Современная стоматологическая клиника НИСО: более 10 лет опыта, сертифицированное оборудование и команда профессионалов. Запишитесь на бесплатную консультацию: 8 (812) 327-51-54.");
$APPLICATION->SetPageProperty("title", "О стоматологической клинике НИСО в Санкт-Петербурге | Врачи и специалисты");
$APPLICATION->SetTitle("О компании");
?><section class="base-section">
  <div class="container">
    <div class="base-section__header">
      <h1 class="base-title">О клинике</h1>
    </div>
    <div class="content">

      <!-- Галерея -->

      <? $APPLICATION->IncludeComponent(
        "bitrix:news.list",
        "gallery",
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
          "COMPONENT_TEMPLATE" => "gallery",
          "DETAIL_URL" => "",
          "DISPLAY_BOTTOM_PAGER" => "Y",
          "DISPLAY_DATE" => "Y",
          "DISPLAY_NAME" => "Y",
          "DISPLAY_PICTURE" => "N",
          "DISPLAY_PREVIEW_TEXT" => "N",
          "DISPLAY_TOP_PAGER" => "N",
          "FIELD_CODE" => [0 => "", 1 => "",],
          "FILTER_NAME" => "",
          "HIDE_LINK_WHEN_NO_DETAIL" => "N",
          "IBLOCK_ID" => "41",
          "IBLOCK_TYPE" => "site_content",
          "INCLUDE_IBLOCK_INTO_CHAIN" => "N",
          "INCLUDE_SUBSECTIONS" => "Y",
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
          "PROPERTY_CODE" => [0 => "ADD_TO_SLIDER", 1 => "",],
          "SET_BROWSER_TITLE" => "N",
          "SET_LAST_MODIFIED" => "N",
          "SET_META_DESCRIPTION" => "N",
          "SET_META_KEYWORDS" => "N",
          "SET_STATUS_404" => "N",
          "SET_TITLE" => "N",
          "SHOW_404" => "N",
          "SORT_BY1" => "ACTIVE_FROM",
          "SORT_BY2" => "SORT",
          "SORT_ORDER1" => "ASC",
          "SORT_ORDER2" => "ASC",
          "STRICT_SECTION_CHECK" => "N"
        )
      ); ?>

      <!-- Галерея -->

      <!-- Сертификаты и лицензии -->

      <? $APPLICATION->IncludeComponent(
        "bitrix:news.list",
        "licenses-slider",
        array(
          "ACTIVE_DATE_FORMAT" => "d.m.Y",
          "ADD_SECTIONS_CHAIN" => "Y",
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
          "DISPLAY_DATE" => "Y",
          "DISPLAY_NAME" => "Y",
          "DISPLAY_PICTURE" => "Y",
          "DISPLAY_PREVIEW_TEXT" => "Y",
          "DISPLAY_TOP_PAGER" => "N",
          "FIELD_CODE" => array("", ""),
          "FILTER_NAME" => "",
          "HIDE_LINK_WHEN_NO_DETAIL" => "N",
          "IBLOCK_ID" => "42",
          "IBLOCK_TYPE" => "site_content",
          "INCLUDE_IBLOCK_INTO_CHAIN" => "Y",
          "INCLUDE_SUBSECTIONS" => "Y",
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
          "PROPERTY_CODE" => array("", ""),
          "SET_BROWSER_TITLE" => "Y",
          "SET_LAST_MODIFIED" => "N",
          "SET_META_DESCRIPTION" => "Y",
          "SET_META_KEYWORDS" => "Y",
          "SET_STATUS_404" => "N",
          "SET_TITLE" => "Y",
          "SHOW_404" => "N",
          "SORT_BY1" => "ACTIVE_FROM",
          "SORT_BY2" => "SORT",
          "SORT_ORDER1" => "DESC",
          "SORT_ORDER2" => "ASC",
          "STRICT_SECTION_CHECK" => "N"
        )
      ); ?>

      <!-- Сертификаты и лицензии -->

      <?
      $APPLICATION->IncludeFile(
        SITE_DIR . 'include/about.php',
        array(),
        array('MODE' => 'html', 'NAME' => 'контент страницы', 'SHOW_BORDER' => true)
      );
      ?>
    </div>
  </div>
</section> <br><? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>
