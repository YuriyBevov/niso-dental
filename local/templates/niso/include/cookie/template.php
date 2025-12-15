<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Page\Asset;

Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/include/cookie/styles.css");
Asset::getInstance()->addJs(SITE_TEMPLATE_PATH . "/include/cookie/script.js");
?>

<div id="cookie-consent-banner" style="display:none;">
  <div class="container">
    <p>
      Продолжая пользоваться сайтом, Вы соглашаетесь с <a href="/policy/" target="_blank">политикой использования файлов cookie</a>.
    </p>
    <button id="cookie-consent-button" class="main-btn">Хорошо</button>
  </div>
</div>
