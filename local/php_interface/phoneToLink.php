<?php

function phoneToLink($phone)
{
  // Сохраняем оригинальный ввод для анализа первой цифры
  $original = $phone;

  // Удаляем всё, кроме цифр
  $digits = preg_replace('/\D/', '', $phone);

  // Определяем, начинался ли изначально с '8'
  $isCityPhone = preg_match('/^[\s\+\(]*8/', $original);

  // Проверка длины и страны
  if (strlen($digits) == 11) {
    if ($digits[0] == '7') {
      $normalized = '7' . substr($digits, 1); // уже +7
    } elseif ($digits[0] == '8') {
      $normalized = '7' . substr($digits, 1); // заменяем 8 на 7
    } else {
      // Не российский номер — оставляем как есть
      $normalized = $digits;
    }
  } elseif (strlen($digits) == 10 && $digits[0] == '9') {
    // Номер без кода: 9xx xxx xxxx → Россия
    $normalized = '7' . $digits;
    $isCityPhone = true; // по умолчанию можно считать за "8"
  } elseif (strlen($digits) >= 10 && strlen($digits) <= 15) {
    // Другие страны
    $normalized = $digits;
    $telLink = '+' . $normalized;
    return '<a href="tel:' . $telLink . '">' . $telLink . '</a>';
  } else {
    // Некорректный номер
    return htmlspecialchars($phone);
  }

  // Формируем международную ссылку tel (всегда с +7)
  $telLink = '+7' . substr($normalized, 1); // normalized начинается с 7, делаем +7...

  // Форматированный вывод: зависит от того, начиналось ли с 8
  $areaCode   = substr($normalized, 1, 3);
  $prefix     = substr($normalized, 4, 3);
  $line1      = substr($normalized, 7, 2);
  $line2      = substr($normalized, 9, 2);

  if ($isCityPhone) {
    $formatted = "8 ($areaCode) $prefix-$line1-$line2";
  } else {
    $formatted = "+7 ($areaCode) $prefix-$line1-$line2";
  }

  return '<a href="tel:' . $telLink . '">' . $formatted . '</a>';
}
