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

      if (elementID === 416) {
        fillSettingsFields(['54', '55']);
      }
      if (elementID === 417) {
        fillSettingsFields(['58', '59']);
      }
    });
  </script>
<?php
}
