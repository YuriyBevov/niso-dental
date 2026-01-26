<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("description", "Стоматологическая клиника НИСО в Санкт-Петербурге предлагает широкий спектр услуг для взрослых и детей. Современное оборудование, опытные врачи и доступные цены. Удобное время записи и комфортная атмосфера. Запишитесь на консультацию уже сегодня!");
$APPLICATION->SetPageProperty("title", "Стоматология в Санкт-Петербурге: клиника НИСО — современные услуги и забота о вашем здоровье");
$APPLICATION->SetTitle("Стоматологическая клиника “НИСО”");
?>

<!-- top-section -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/top-section/top-section.php"); ?>
<!-- top-section -->

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

<!-- faq-preview -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/index-page/faq-preview/faq-preview.php");  ?>
<!-- faq-preview -->

<!-- map -->
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/sections/map/map.php");  ?>
<!-- map -->

<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>