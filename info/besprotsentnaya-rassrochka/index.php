<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("description", "Узнайте, как воспользоваться беспроцентной рассрочкой на стоматологические услуги в клинике «НИСО». Удобные условия оплаты, отсутствие переплат и возможность начать лечение уже сегодня. Позвоните нам: +7 (812) 327-51-54");
$APPLICATION->SetPageProperty("title", "Беспроцентная рассрочка в клинике «НИСО»: доступное лечение без переплат");
$APPLICATION->SetTitle("Беспроцентная рассрочка");
?><section class="base-section">
<div class="container">
	<div class="base-section__header">
		<h1 class="base-title">Беспроцентная рассрочка</h1>
	</div>
	<div class="content">
		 <?
      $APPLICATION->IncludeFile(
        SITE_DIR . 'include/info/besprotsentnaya-rassrochka.php',
        array(),
        array('MODE' => 'html', 'NAME' => 'контент страницы', 'SHOW_BORDER' => true)
      );
      ?>
	</div>
</div>
 </section> <br><? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>