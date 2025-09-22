<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

$IBLOCK_ID = 24;

$rsSections = CIBlockSection::GetList(
    ['LEFT_MARGIN' => 'ASC'],
    ['IBLOCK_ID' => $IBLOCK_ID, 'GLOBAL_ACTIVE' => 'Y'],
    false,
    ['ID', 'NAME', 'IBLOCK_SECTION_ID']
);

$sections = [];
while ($section = $rsSections->GetNext()) {
    $section['CHILDREN'] = [];
    $section['ITEMS'] = [];
    $sections[$section['ID']] = $section;
}

$tree = [];
foreach ($sections as $id => &$section) {
    if ($section['IBLOCK_SECTION_ID'] && isset($sections[$section['IBLOCK_SECTION_ID']])) {
        $sections[$section['IBLOCK_SECTION_ID']]['CHILDREN'][] = &$section;
    } else {
        $tree[] = &$section;
    }
}
unset($section);

foreach ($arResult['ITEMS'] as $item) {
    $sectionId = $item['IBLOCK_SECTION_ID'];
    if (isset($sections[$sectionId])) {
        $sections[$sectionId]['ITEMS'][] = $item;
    }
}

$arResult['SECTION_TREE'] = $tree;
