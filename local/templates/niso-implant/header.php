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

</head>
<!-- <script type="module">
  // import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

  const swiper = new Swiper('.top-banner-slider', {})
</script> -->

<body>
  <div id="panel"><? $APPLICATION->ShowPanel(); ?></div>

  <header class="header">
    <div class="container">
      header
    </div>
  </header>

  <main id="workarea">