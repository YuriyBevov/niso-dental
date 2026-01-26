<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("description", "Узнайте о специальных предложениях и скидках для постоянных клиентов клиники «НИСО». Экономьте на стоматологических услугах и получайте качественное лечение по выгодным ценам. Позвоните нам: +7 (812) 327-51-54");
$APPLICATION->SetPageProperty("title", "Скидка постоянным клиентам в клинике «НИСО»: забота о ваших улыбках");
$APPLICATION->SetTitle("Скидка постоянным клиентам");
?><section class="base-section">
<div class="container">
	<div class="base-section__header">
		<h1 class="base-title">Скидка постоянным клиентам</h1>
	</div>
	<div class="content">
		 <?
      $APPLICATION->IncludeFile(
        SITE_DIR . 'include/info/skidka-postoyannym-klientam.php',
        array(),
        array('MODE' => 'html', 'NAME' => 'контент страницы', 'SHOW_BORDER' => true)
      );
      ?>
	</div>
</div>
 </section> <br><? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>