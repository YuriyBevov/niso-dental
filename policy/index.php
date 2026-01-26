<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("description", "Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006. №152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, предпринимаемые НИСО (далее – Оператор).");
$APPLICATION->SetPageProperty("title", "Политика конфиденциальности | Стоматологическая клиника НИСО");
$APPLICATION->SetTitle("Политика конфиденциальности");
?>
<section class="base-section">
  <div class="container">
    <div class="base-section__header">
      <h1 class="base-title">Политика конфиденциальности</h1>
    </div>
    <div class="content">
      <?
      $APPLICATION->IncludeFile(
        SITE_DIR . 'include/policy.php',
        array(),
        array('MODE' => 'html', 'NAME' => 'политику конфиденциальности', 'SHOW_BORDER' => true)
      );
      ?>
    </div>
  </div>
</section>
<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>