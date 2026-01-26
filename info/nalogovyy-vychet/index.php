<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("description", "Узнайте, как оформить налоговый вычет за стоматологические услуги в клинике «НИСО». Подробная инструкция по сбору документов и подаче заявления. Экономьте на лечении зубов с помощью налогового вычета!");
$APPLICATION->SetPageProperty("title", "Как получить налоговый вычет за лечение зубов в клинике «НИСО»");
$APPLICATION->SetTitle("Налоговый вычет");
?><section class="base-section">
<div class="container">
	<div class="base-section__header">
		<h1 class="base-title">Налоговый вычет</h1>
	</div>
	<div class="content">
		 <?
      $APPLICATION->IncludeFile(
        SITE_DIR . 'include/info/nalogovyy-vychet.php',
        array(),
        array('MODE' => 'html', 'NAME' => 'контент страницы', 'SHOW_BORDER' => true)
      );
      ?>
	</div>
</div>
 </section> <br><? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>