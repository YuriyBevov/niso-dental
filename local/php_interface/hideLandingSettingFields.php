<?
AddEventHandler('main', 'OnEpilog', 'HideLandingSettingFields');
function HideLandingSettingFields()
{
  global $APPLICATION;
  $curPage = $APPLICATION->GetCurPage();
  // Проверяем, что мы на странице редактирования элемента
  if (strpos($curPage, '/bitrix/admin/iblock_element_edit.php') === false) {
    return;
  }
  // Получаем текущий запрос
  $request = \Bitrix\Main\Context::getCurrent()->getRequest();
  $iblockId = (int)($request['IBLOCK_ID'] ?? 0);  // ID инфоблока
  $elementId = (int)($request['ID'] ?? 0);        // ID элемента

  // Проверяем нужный инфоблок
  if ($iblockId !== 18) {
    return;
  }
?>
  <script>
    BX.ready(function() {
      const form = document.querySelector('#form_element_18_form');
      const elementID = <?= $elementId ?>;
      const fields = form.querySelectorAll('tr[id^="tr_PROPERTY_"]');

      fields.forEach(field => {
        field.style.display = 'none';
      });

      const fillSettingsFields = (allowedFieldIDs) => {
        fields.forEach(field => {
          const fieldID = field.id.split('_').pop();

          if (allowedFieldIDs.includes(fieldID)) {
            field.style.display = 'table-row';
          }
        });
      }
      // ОБЩИЕ НАСТРОЙКИ
      if (elementID === 416) {
        fillSettingsFields(['54', '55', '62', '63', '76', '77', '79', '85', '87', '94']);
      }
      // ПРЕИМУЩЕСТВА
      if (elementID === 417) {
        fillSettingsFields(['69', '72', '73', '74', '75']);
      }
      // ВЕРХНИЙ БАННЕР
      if (elementID === 425) {
        fillSettingsFields(['61', '64', '65', '88', '67', '68', '70', '71']);
      }
      // СОТРУДНИКИ
      if (elementID === 435) {
        fillSettingsFields(['80', '81', '82', '83', '84', '86']);
      }
      // КОНТАКТЫ
      if (elementID === 441) {
        fillSettingsFields(['89', '90', '91', '92', '93']);
      }
    });
  </script>
<?php
}
