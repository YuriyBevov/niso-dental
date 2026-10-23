<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("description", "Стоматологическая клиника НИСО в Санкт-Петербурге. Лечение зубов, имплантация, ортодонтия, протезирование и профессиональная гигиена. Запись ежедневно 09:00–21:00.");
$APPLICATION->SetPageProperty("title", "Стоматология в Санкт-Петербурге | Клиника НИСО");
$APPLICATION->SetTitle("Стоматологическая клиника “НИСО”");
?>

<!-- top-section -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/top-section/top-section.php"); ?>
<!-- top-section -->

<!-- top-services -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/top-services/top-services.php"); ?>
<!-- top-services -->

<!-- features -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/features/features.php"); ?>
<!-- features -->

<!-- catalog-preview -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/catalog-preview/catalog-preview.php");  ?>
<!-- catalog-preview -->

<!-- quiz -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/quiz/quiz.php");  ?>
<!-- quiz -->

<!-- sales-preview -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/sales-preview/sales-preview.php");  ?>
<!-- sales-preview -->

<!-- staff-preview -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/staff-preview/staff-preview.php");  ?>
<!-- staff-preview -->

<!-- reviews-preview -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/reviews-preview/reviews-preview.php");  ?>
<!-- reviews-preview -->

<!-- video-reviews -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/video-reviews/video-reviews.php");  ?>
<!-- rvideo-reviews -->

<!-- faq-preview -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/faq-preview/faq-preview.php");  ?>
<!-- faq-preview -->

<!-- map -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/sections/map/map.php");  ?>
<!-- map -->

<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>