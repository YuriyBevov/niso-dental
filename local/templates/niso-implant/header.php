<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <? $APPLICATION->ShowHead(); ?>
  <title><? $APPLICATION->ShowTitle() ?></title>

  <? require_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/template_settings.php"); ?>

  <?
  // $APPLICATION->SetAdditionalCSS(SITE_TEMPLATE_PATH . "/assets/custom.css", true);
  // $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . "/assets/build.js");
  // $APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . "/assets/custom.js");
  ?>

</head>

<body>
  <div id="panel"><? $APPLICATION->ShowPanel(); ?></div>

  <header class="header">
    <div class="container">
      header
    </div>
  </header>

  <main id="workarea">