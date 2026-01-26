<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Page\Asset;

Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/site_blocks/sections/quiz/style.css");
?>

<section class="base-section quiz-section">
  <div class="container">
    <div data-marquiz-id="66cc82a624dfa8002664bda8"></div>
    <script>(function(t, p) {window.Marquiz ? Marquiz.add([t, p]) : document.addEventListener('marquizLoaded', function() {Marquiz.add([t, p])})})('Inline', {id: '66cc82a624dfa8002664bda8', buttonText: 'Подобрать услугу', bgColor: '#45c5e9', textColor: '#ffffff', rounded: true, shadow: 'rgba(69, 197, 233, 0.5)', blicked: true, fixed: false, buttonOnMobile: true, disableOnMobile: false, fullWidth: false})</script>
  </div>
</section>
