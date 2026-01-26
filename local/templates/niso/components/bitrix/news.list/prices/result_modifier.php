<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

$items = $arResult['ITEMS'];
$grouped = [];
$sectionIds = [];

// Собираем элементы по разделам и собираем уникальные ID разделов
foreach ($items as $item) {
    $sectionId = (int)$item['IBLOCK_SECTION_ID'];
    $grouped[$sectionId][] = $item;

    if ($sectionId > 0) {
        $sectionIds[$sectionId] = true; // используем как флаг, значение не важно
    }
}

$arResult['ITEMS_BY_SECTION'] = $grouped;

// Загружаем данные разделов, если они есть
$arResult['SECTIONS'] = [];
if (!empty($sectionIds)) {
    $sectionIds = array_keys($sectionIds); // получаем реальные ID

    $res = CIBlockSection::GetList(
        ['SORT' => 'ASC'],
        ['ID' => $sectionIds],
        false,
        ['ID', 'NAME', 'CODE', 'SECTION_PAGE_URL']
    );

    while ($section = $res->Fetch()) {
        // Инициализируем ITEMS для каждого раздела
        $section['ITEMS'] = $grouped[(int)$section['ID']] ?? [];
        $arResult['SECTIONS'][$section['ID']] = $section;
    }
}


