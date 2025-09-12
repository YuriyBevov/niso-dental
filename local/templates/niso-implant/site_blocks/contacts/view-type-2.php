<section class="section contacts --grid-view-type-3">
  <div class="container">
    <?
    $APPLICATION->IncludeFile(
      SITE_TEMPLATE_PATH . "/includes/section-header.php",
      array("TITLE" => "Контакты", "DESCRIPTION" => "Cвяжитесь с нами удобным для Вас способом"),
      array("MODE" => "html", "SHOW_BORDER" => false)
    );
    ?>
  </div>
  <div class="grid">
    <div class="container-fluid">
      <div class="contacts__content">
        <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_PHONES"]): ?>
          <div class="contacts__content-field">
            <span class="contacts__content-field-title">Телефоны:</span>
            <? foreach ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_PHONES"] as $arPhone): ?>
              <?= phoneToLink($arPhone) ?>
            <? endforeach; ?>
          </div>
        <? endif; ?>

        <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_ADDRESS"]): ?>
          <div class="contacts__content-field">
            <span class="contacts__content-field-title">Адрес:</span>
            <address>
              <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_ADDRESS"] ?>
            </address>
          </div>
        <? endif; ?>

        <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_MAILS"]): ?>
          <div class="contacts__content-field">
            <span class="contacts__content-field-title">Эл. почта:</span>
            <? foreach ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_MAILS"] as $arMail): ?>
              <?= emailToLink($arMail) ?>
            <? endforeach; ?>
          </div>
        <? endif; ?>

        <div class="contacts__content-field contacts__content-field--social">
          social
        </div>
      </div>
      <? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_YMAPS_LINK"]): ?>
        <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_YMAPS_LINK"] ?>
      <? endif; ?>
    </div>
  </div>
</section>