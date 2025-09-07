<?php
if (\Bitrix\Main\Loader::includeModule("iblock")) {
  $elementIds = [416, 417];
  $settings = [];

  foreach ($elementIds as $id) {
    $id = (int)$id;
    if ($id <= 0) continue;

    $res = CIBlockElement::GetByID($id);
    if ($element = $res->GetNextElement()) {
      $props = $element->GetProperties();
      $fields = $element->GetFields();

      foreach ($props as $prop) {
        if (!empty($prop["VALUE"])) {

          $settings[$prop["CODE"]] = $prop["VALUE"];
        }
      }
    }
  }

  $GLOBALS['TEMPLATE_SETTINGS'] = $settings;
}
?>

<style>
  :root {
    <?php
    foreach ($settings as $key => $value) {
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