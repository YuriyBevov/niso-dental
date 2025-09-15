<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <? $APPLICATION->ShowHead(); ?>
  <title><? $APPLICATION->ShowTitle() ?></title>

  <? require_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/template_settings.php"); ?>

  <!-- <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script> -->
  <?
  // $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . "/assets/custom.css", true);
  // $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . "/assets/build.js");
  // $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . "/assets/custom.js");
  ?>

  <?
  $logo = CFile::GetPath($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_SITE_LOGO"]);
  ?>
</head>
<!-- <script type="module">
  // import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

  const swiper = new Swiper('.top-banner-slider', {})
</script> -->

<body>
  <div id="panel"><? $APPLICATION->ShowPanel(); ?></div>

  <header class="header">
    <div class="container">
      <div class="grid">
        <div class="header__top">
          <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_ADDRESS"]): ?>
            <div class="header__contact-block">
              <svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
                <use xlink:href="/local/templates/niso/assets/sprite.svg#icon-pin"></use>
              </svg>
              <div class="header__contact-block-content">
                <address>
                  <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_ADDRESS"] ?>
                </address>
              </div>
            </div>
          <? endif; ?>

          <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_PHONES"]): ?>
            <div class="header__contact-block">
              <svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
                <use xlink:href="/local/templates/niso/assets/sprite.svg#icon-phone"></use>
              </svg>
              <div class="header__contact-block-content">
                <? foreach ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_PHONES"] as $arPhone): ?>
                  <?= phoneToLink($arPhone) ?>
                <? endforeach; ?>
              </div>
            </div>
          <? endif; ?>

          <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_MAILS"]): ?>
            <div class="header__contact-block">
              <svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
                <use xlink:href="/local/templates/niso/assets/sprite.svg#icon-mail"></use>
              </svg>
              <div class="header__contact-block-content">
                <? foreach ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_MAILS"] as $arMail): ?>
                  <?= emailToLink($arMail) ?>
                <? endforeach; ?>
              </div>
            </div>
          <? endif; ?>

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
        <div class="header__bottom">
          <a href="/" class="logo">
            <img src="<?= $logo ?>" alt="Логотип" width="200" height="60">
          </a>
          <nav class="nav">
            <ul class="nav__list">
              <li class="nav__list-item">
                <a href="#services">Услуги</a>
              </li>
              <li class="nav__list-item">
                <a href="#staff">Специалисты</a>
              </li>
              <li class="nav__list-item">
                <a href="#sale">Акции</a>
              </li>
              <li class="nav__list-item">
                <a href="#about">О нас</a>
              </li>
              <li class="nav__list-item">
                <a href="#contacts">Контакты</a>
              </li>
            </ul>
          </nav>
          <button class="main-btn">Заказать звонок</button>
        </div>
      </div>
    </div>
  </header>

  <main id="workarea">