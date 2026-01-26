<?php
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");

\Bitrix\Main\Loader::includeModule('iblock');

// Очищаем буфер и устанавливаем заголовки
while (ob_get_level()) ob_end_clean();
header("Content-Type: text/xml; charset=utf-8");

// Базовый URL сайта
$siteUrl = 'https://niso-dental.ru';


// ID инфоблока врачей
$IBLOCK_ID_DOCTORS = 11;

// Начинаем вывод
echo '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
?>

<shop version="2.0" date="<?= date('Y-m-d H:i') ?>">
  <name>Клиника НИСО</name>
  <company>ООО &quot;НИСО&quot;</company>
  <url><?= $siteUrl ?></url>
  <clinics>
    <clinic id="clinic_1">
      <url><?= $siteUrl ?></url>
      <name>Клиника НИСО</name>
      <company_id>159276084724</company_id>
    </clinic>
  </clinics>
  <doctors>
    <?php
    $arSelect = [
      "ID",
      "NAME",
      "DETAIL_PAGE_URL",
      "DETAIL_PICTURE",
      "PREVIEW_TEXT",
      "DETAIL_TEXT",
      "PROPERTY_POSITION",
    ];

    $arFilter = [
      "IBLOCK_ID" => $IBLOCK_ID_DOCTORS,
      "ACTIVE"    => "Y",
    ];

    $res = CIBlockElement::GetList([], $arFilter, false, false, $arSelect);

    while ($ob = $res->GetNextElement()):
      $arFields = $ob->GetFields();

      $id        = (int)$arFields['ID'];
      $name      = htmlspecialcharsbx($arFields['NAME']);
      $url       = $siteUrl . '/staff' . $arFields['DETAIL_PAGE_URL'];

      // Описание
      // $description = $arFields['PREVIEW_TEXT'] ?: $arFields['DETAIL_TEXT'];
      // $description = trim($description);
      // $description = htmlspecialcharsbx($description);

      // Фото
      $pictureSrc = '';
      if (!empty($arFields['DETAIL_PICTURE'])) {
        $pictureSrc = CFile::GetPath($arFields['DETAIL_PICTURE']);
        if ($pictureSrc) {
          $pictureSrc = $siteUrl . $pictureSrc;
        }
      }


      // Свойства
      $speciality = htmlspecialcharsbx($arFields['PROPERTY_POSITION_VALUE']);
      $descr_content = htmlspecialcharsbx($arFields['PROPERTY_DESCR_CONTENT_VALUE']['TEXT'] ?? '');
    ?>
      <doctor id="<?= $id ?>">
        <name><?= $name ?></name>
        <url><?= $url ?></url>

        <?/*php if ($speciality): ?>
            <param name="Специальность"><?= $speciality ?></param>
          <?php endif; */ ?>

        <?php if ($speciality): ?>
          <job>
            <position><?= $speciality ?></position>
          </job>
        <?php endif; ?>

        <?php if ($pictureSrc): ?>
          <picture><?= $pictureSrc ?></picture>
        <?php endif; ?>


        <?/*php if ($description): ?>
            <description>
              <?= $description ?>
            </description>
          <?php endif; */ ?>

        <?php if ($descr_content): ?>
          <description>
            <?= $descr_content ?>
          </description>
        <?php endif;  ?>

        <?/*php if ($descr_content): ?>
            <param name="Описание врача">
            <?= $descr_content ?>
            </param>
          <?php endif; */ ?>

      </doctor>
    <?php endwhile; ?>
  </doctors>
</shop>

<?php
// Завершаем выполнение без вызова эпилога Bitrix
exit();
