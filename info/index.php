<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetPageProperty("description", "Важная информация касательно оплаты, возврата средств за медицинские услуги, а также использования материнского капитала в медицинском учреждении НИСО. Обеспечивается гарантия качества предоставляемых медицинских услуг. Запись на бесплатную консультацию осуществляется по телефону: +7 (812) 327-51-54");
$APPLICATION->SetPageProperty("title", "Важная информация стоматологическая клиника НИСО");
$APPLICATION->SetTitle("Информация");
?><section class="base-section">
  <div class="container test">
    <div class="base-section__header">
      <h1 class="base-title"><?= $APPLICATION->GetTitle() ?></h1>
      <div class="tag-list">
        <a href="/info/nalogovyy-vychet/" class="tag">Налоговый вычет</a>
        <a href="/info/besprotsentnaya-rassrochka/" class="tag">Беспроцентная рассрочка</a>
        <a href="/info/skidka-postoyannym-klientam/" class="tag">Скидка постоянным клиентам</a>
      </div>
    </div>
    <div class="content">
      <?
      $APPLICATION->IncludeFile(
        SITE_DIR . 'include/info/index.php',
        array(),
        array('MODE' => 'html', 'NAME' => 'контент страницы', 'SHOW_BORDER' => true)
      );
      ?>
    </div>
  </div>
</section> <br><? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>
