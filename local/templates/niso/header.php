<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$curPage = $APPLICATION->GetCurPage();
?>

<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- <meta http-equiv="X-UA-Compatible" content="ie=edge"/> -->
  <? $APPLICATION->ShowHead(); ?>
  <title><? $APPLICATION->ShowTitle() ?></title>


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
  $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . "/assets/build.js");
  $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . "/assets/custom.js");

  ?>
  <meta name="yandex-verification" content="de1ec18da1a2ca85" />



  <!-- Yandex.Metrika counter -->
  <script type="text/javascript">
    (function(m, e, t, r, i, k, a) {
      m[i] = m[i] || function() {
        (m[i].a = m[i].a || []).push(arguments)
      };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) {
          return;
        }
      }
      k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    ym(102970436, 'init', {
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      accurateTrackBounce: true,
      trackLinks: true
    });
  </script>
  <!-- /Yandex.Metrika counter -->
</head>

<body>
  <noscript>
    <div><img src="https://mc.yandex.ru/watch/102970436" style="position:absolute; left:-9999px;" alt="" /></div>
  </noscript>
  <div id="panel"><? $APPLICATION->ShowPanel(); ?></div>

  <header class="header">
    <div class="container">
      <div class="header__section header__section--top">
        <a class="main-logo" href="/" aria-label="Стоматологическая клиника “НИСО”">
          <img src="<?= SITE_TEMPLATE_PATH ?>/assets/img/logo.svg" alt="Логотип" width="180" height="40">
        </a>
        <div class="info-block info-block--address">
          <svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
            <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-pin"></use>
          </svg>
          <div class="info-block__content">
            <address>
              <?
              $APPLICATION->IncludeFile(
                SITE_DIR . 'include/address.php',
                array(),
                array('MODE' => 'html', 'NAME' => 'адрес', 'SHOW_BORDER' => true)
              );
              ?>
            </address>
            <span class="worktime">
              <?
              $APPLICATION->IncludeFile(
                SITE_DIR . 'include/schedule.php',
                array(),
                array('MODE' => 'html', 'NAME' => 'время работы', 'SHOW_BORDER' => true)
              );
              ?>
            </span>
          </div>
        </div>
        <div class="info-block info-block--contacts">
          <svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
            <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-info"></use>
          </svg>
          <div class="info-block__content">
            <?
            $APPLICATION->IncludeFile(
              SITE_DIR . 'include/mail.php',
              array(),
              array('MODE' => 'html', 'NAME' => 'эл.почту', 'SHOW_BORDER' => true)
            );
            ?>
            <?
            $APPLICATION->IncludeFile(
              SITE_DIR . 'include/phone.php',
              array(),
              array('MODE' => 'html', 'NAME' => 'телефон', 'SHOW_BORDER' => true)
            );
            ?>
          </div>
        </div>
        <!-- social -->
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
        <!-- social -->

        <button class="main-btn" type="button" data-modal-opener="callback-modal">
          <span>Записаться на прием</span>
        </button>
        <div class="burger-btn mobile-menu-opener" aria-label="Кнопка открытия меню"><span class="burger-btn-line burger-btn-line--top" aria-hidden="true"></span><span class="burger-btn-line burger-btn-line--middle" aria-hidden="true"></span><span class="burger-btn-line burger-btn-line--bottom" aria-hidden="true"></span></div>
      </div>
      <div class="header__section header__section--bottom mobile-menu">
        <div class="mobile-menu__wrapper">
          <div class="mobile-menu__header"><a class="main-logo" href="/" aria-label="Название сайта для скринридера"><img src="<?= SITE_TEMPLATE_PATH ?>/assets/img/logo.svg" alt="Название сайта" width="180" height="40"></a>
            <div class="burger-btn mobile-menu-closer active" aria-label="Кнопка открытия меню"><span class="burger-btn-line burger-btn-line--top" aria-hidden="true"></span><span class="burger-btn-line burger-btn-line--middle" aria-hidden="true"></span><span class="burger-btn-line burger-btn-line--bottom" aria-hidden="true"></span></div>
          </div>
          <?
          $APPLICATION->IncludeComponent(
            "bitrix:menu",
            "lw-top-multilevel",
            array(
              "ROOT_MENU_TYPE" => "top",
              "MENU_CACHE_TYPE" => "N",
              "MENU_CACHE_TIME" => "36000000",
              "MENU_CACHE_USE_GROUPS" => "Y",
              "MENU_CACHE_GET_VARS" => array(),
              "MAX_LEVEL" => "2",
              "CHILD_MENU_TYPE" => "left",
              "USE_EXT" => "Y",
              "ALLOW_MULTI_SELECT" => "N",
              "COMPONENT_TEMPLATE" => "lw-top-multilevel",
              "DELAY" => "N"
            ),
            false
          );
          ?>
          <div class="mobile-menu__footer">
            <div class="info-block info-block--address">
              <svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
                <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-pin"></use>
              </svg>
              <div class="info-block__content">
                <address>
                  <?
                  $APPLICATION->IncludeFile(
                    SITE_DIR . 'include/address.php',
                    array(),
                    array('MODE' => 'html', 'NAME' => 'адрес', 'SHOW_BORDER' => true)
                  );
                  ?>
                </address>
                <span class="worktime">
                  <?
                  $APPLICATION->IncludeFile(
                    SITE_DIR . 'include/schedule.php',
                    array(),
                    array('MODE' => 'html', 'NAME' => 'время работы', 'SHOW_BORDER' => true)
                  );
                  ?>
                </span>
              </div>
            </div>
            <div class="info-block info-block--contacts">
              <svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
                <use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-info"></use>
              </svg>
              <div class="info-block__content">
                <?
                $APPLICATION->IncludeFile(
                  SITE_DIR . 'include/mail.php',
                  array(),
                  array('MODE' => 'html', 'NAME' => 'эл.почту', 'SHOW_BORDER' => true)
                );
                ?>
                <?
                $APPLICATION->IncludeFile(
                  SITE_DIR . 'include/phone.php',
                  array(),
                  array('MODE' => 'html', 'NAME' => 'телефон', 'SHOW_BORDER' => true)
                );
                ?>
              </div>
            </div>
            <!-- social -->
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
            <!-- social -->
          </div>
        </div>
      </div>
    </div>
  </header>

  <main id="workarea">
    <?
    if ($curPage != '/' && !defined("ERROR_404")) {
      $APPLICATION->IncludeComponent(
        "bitrix:breadcrumb",
        "lw-breadcrumb",
        array(
          "PATH" => "",
          "SITE_ID" => "s1",
          "START_FROM" => "0",
          "COMPONENT_TEMPLATE" => "lw-breadcrumb"
        ),
        false
      );
    }
    ?>