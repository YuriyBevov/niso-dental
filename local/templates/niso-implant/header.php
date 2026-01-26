<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- <meta http-equiv="X-UA-Compatible" content="ie=edge"/> -->
  <? $APPLICATION->ShowHead(); ?>
  <title><? $APPLICATION->ShowTitle() ?></title>

  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />

  <?
  // Подключение мета тегов или сторонних файлов
  //$APPLICATION->AddHeadString("name='<meta name='yandex-verification' content='62be9ea1' />'");
  // $curPage = $APPLICATION->GetCurPage();
  // if($curPage = '/') {
  // 	$APPLICATION->AddHeadString("<link rel='preload' as='style' href='/include/main-page/hero-block/style.css' />");
  // 	$APPLICATION->AddHeadString("<link rel='preload' as='image' imagesrcset='/include/main-page/hero-block/img/hero-bg@1x.webp 1x, /include/main-page/hero-block/img/hero-bg@2x.webp 2x' />");
  // 	$APPLICATION->SetAdditionalCSS("/include/main-page/hero-block/style.css", false);
  // }
  // Подключение css
  // $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . "/assets/main.css", true);
  $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . "/assets/custom.css", true);
  // Для подключения скриптов
  $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . "/assets/script.js");
  $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . "/assets/custom.js");

  // подключаю для работы попапов на сайте
  \CJSCore::Init(['popup']);
  ?>
</head>

<body>

  <div id="panel"><? $APPLICATION->ShowPanel(); ?></div>

  <header class="header">
    <div class="container">
      <div class="header__top">
        <a href="/" class="logo">
          <img src="<?= SITE_TEMPLATE_PATH ?>/assets/images/logo.svg" alt="Стоматологическая клиника НИСО" width="200" height="60">
        </a>

        <div class="contact-block-section">
          <div class="contact-block">
            <svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
              <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#clock' ?>"></use>
            </svg>
            <span>Пн–Вс: 9:00–21:00</span>
          </div>

          <address class="contact-block">
            <svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
              <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#pin' ?>"> </use>
            </svg>
            <span>Санкт-Петербург, ул. Профессора Попова, 27</span>
            <small>10 мин. от м.Петроградская</small>
          </address>

          <div class="contact-block">
            <svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
              <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#phone' ?>"> </use>
            </svg>
            <a href="tel:+78123275154">+7 (812) 327-51-54</a>
          </div>
        </div>

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
            "DISPLAY_BOTTOM_PAGER" => "Y",
            "DISPLAY_DATE" => "N",
            "DISPLAY_NAME" => "N",
            "DISPLAY_PICTURE" => "N",
            "DISPLAY_PREVIEW_TEXT" => "N",
            "DISPLAY_TOP_PAGER" => "N",
            "FIELD_CODE" => array("", ""),
            "FILTER_NAME" => "",
            "HIDE_LINK_WHEN_NO_DETAIL" => "N",
            "IBLOCK_ID" => "27",
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
            "PROPERTY_CODE" => array("", "ICON", ""),
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

      <div class="header__bottom">
        <nav class="main-nav">
          <div class="main-nav__wrapper">
            <div class="main-nav__header">
              <a href="/" class="logo">
                <img src="<?= SITE_TEMPLATE_PATH ?>/assets/images/logo.svg" alt="Стоматологическая клиника НИСО" width="200" height="60">
              </a>

              <button class="main-nav-closer" aria-label="Закрыть меню">
                <svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
                  <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#close-icon' ?>"> </use>
                </svg>
              </button>
            </div>

            <ul class="top-menu">
              <li><a href="#advantages">Преимущества</a></li>
              <li><a href="#workflow">Этапы</a></li>
              <li><a href="#services">Цены</a></li>
              <li><a href="#staff">Врачи</a></li>
              <li><a href="#cases">Работы</a></li>
              <li><a href="#reviews">Отзывы</a></li>
              <li><a href="#contacts">Контакты</a></li>
            </ul>

            <div class="main-nav__footer">
              <button class="btn" data-form-id="6">Запиcаться на бесплатную консультацию</button>

              <div class="contact-block-section">
                <div class="contact-block">
                  <svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
                    <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#clock' ?>"></use>
                  </svg>
                  <span>Пн–Вс: 9:00–21:00</span>
                </div>

                <address class="contact-block">
                  <svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
                    <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#pin' ?>"> </use>
                  </svg>
                  <span>Санкт-Петербург, ул. Профессора Попова, 27</span>
                  <small>10 мин. от м.Петроградская</small>
                </address>

                <div class="contact-block">
                  <svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
                    <use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#phone' ?>"> </use>
                  </svg>
                  <a href="tel:+78123275154">+7 (812) 327-51-54</a>
                </div>
              </div>
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
                  "DISPLAY_BOTTOM_PAGER" => "Y",
                  "DISPLAY_DATE" => "N",
                  "DISPLAY_NAME" => "N",
                  "DISPLAY_PICTURE" => "N",
                  "DISPLAY_PREVIEW_TEXT" => "N",
                  "DISPLAY_TOP_PAGER" => "N",
                  "FIELD_CODE" => array("", ""),
                  "FILTER_NAME" => "",
                  "HIDE_LINK_WHEN_NO_DETAIL" => "N",
                  "IBLOCK_ID" => "27",
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
                  "PROPERTY_CODE" => array("", "ICON", ""),
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
          </div>

        </nav>

        <button class="btn" data-form-id="6">Запиcаться на бесплатную консультацию</button>

        <button class="main-nav-opener" aria-label="Открыть меню">
          <span class="main-nav-opener__line main-nav-opener__line--top" aria-hidden="none"></span>
          <span class="main-nav-opener__line main-nav-opener__line--middle" aria-hidden="none"></span>
          <span class="main-nav-opener__line main-nav-opener__line--bottom" aria-hidden="none"></span>
        </button>
      </div>

    </div>
  </header>

  <main id="workarea">