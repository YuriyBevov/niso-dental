<?php
if (\Bitrix\Main\Loader::includeModule("iblock")) {
  $elementIds = [416, 417, 425, 435, 441];
  $jsSettings = [];
  $globalSettings = [];

  foreach ($elementIds as $id) {
    $id = (int)$id;
    if ($id <= 0) {
      continue;
    }

    $res = CIBlockElement::GetByID($id);
    if ($element = $res->GetNextElement()) {
      $props = $element->GetProperties();
      $fields = $element->GetFields();

      foreach ($props as $prop) {
        if (empty($prop["VALUE"])) {
          continue;
        }

        // if ($prop["CODE"] === "GLOBAL_CONTACTS_PHONES") {
        //   debug($prop);
        // }

        $code = $prop["CODE"];

        // Проверяем, начинается ли код свойства с "GLOBAL"
        if (strncmp($code, 'GLOBAL', 6) === 0) {
          $globalSettings[$code] = $prop["VALUE_XML_ID"] ? $prop["VALUE_XML_ID"] : $prop["~VALUE"];
        } else {
          $jsSettings[$code] = $prop["~VALUE"];
        }
      }
    }
  }

  $GLOBALS['TEMPLATE_SETTINGS'] = $globalSettings;

  // debug($jsSettings);
  debug($GLOBALS['TEMPLATE_SETTINGS']);
}
?>

<style>
  :root {
    <?php
    foreach ($jsSettings as $key => $value) {
      if (empty($value)) {
        continue;
      }

      $cssVar = '--' . strtolower(
        str_replace('_', '-', $key)
      );

      printf('%s: %s; ', $cssVar, htmlspecialchars($value));
    }
    ?>
  }
</style>