<?php

function emailToLink($email)
{
  // Обрезаем пробелы
  $email = trim($email);

  // Проверяем формат email с помощью filter_var
  if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    // Экранируем для безопасности при выводе
    $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    return '<a href="mailto:' . $safeEmail . '">' . $safeEmail . '</a>';
  } else {
    // Если email некорректен, просто возвращаем как текст (экранированный)
    return htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
  }
}
