<?php
// В этом коде, мы передаем данные из веб-формы отзывов в инфоблок

use Bitrix\Main\EventManager;
// use Bitrix\Main\Diag\Debug;

EventManager::getInstance()->addEventHandler(
  "form",
  "onAfterResultAdd",
  "transferFormDataToIblock"
);

function transferFormDataToIblock($WEB_FORM_ID, $RESULT_ID)
{
  // Проверяем ID веб-формы
  if ($WEB_FORM_ID != 2) { // Замените 2 на ID вашей веб-формы
    return;
  }

  // Подключаем модуль форм
  \CModule::IncludeModule("form");

  // Получаем значения полей формы
  $arResult = [];
  $arAnswers = []; // Переменная для четвертого аргумента
  CFormResult::GetDataByID(
    $RESULT_ID, // ID результата
    array(),    // Получаем все поля
    $arResult,  // Массив для сохранения результатов
    $arAnswers  // Передаем переменную по ссылке
  );

  if (empty($arResult)) {
    return;
  }

  $answers = [];
  foreach ($arAnswers as $answerCode => $answerData) {
    $field = reset($answerData);
    // Debug::writeToFile($field, 'FIELD:', '/local/logs/debug.log');

    if ($field["FIELD_TYPE"] == 'radio') {
      $answers[$answerCode] = $field["VALUE"];
    } else {
      $answers[$answerCode] = $field["USER_TEXT"];
    }
  }

  // Подключаем модуль инфоблоков
  \CModule::IncludeModule("iblock");

  //  ID инфоблока для отзывов
  $iblockId = 10; // Замените на ID вашего инфоблока

  // Формируем данные для добавления в инфоблок
  $arFields = [
    "IBLOCK_ID" => $iblockId,
    "NAME" => $answers["NAME"],
    "ACTIVE" => "N",
    "PREVIEW_TEXT" => $answers["COMMENT"],
    "PROPERTY_VALUES" => [
      "RATE" => $answers["RATE"],
    ],
  ];

  // Добавляем элемент в инфоблок
  $el = new CIBlockElement();
  $result = $el->Add($arFields);
  // if (!$result) {
  //   // Логируем ошибку добавления элемента
  //   Debug::writeToFile($el->LAST_ERROR, 'IBlockError', '/local/logs/debug.log');
  // }
}
