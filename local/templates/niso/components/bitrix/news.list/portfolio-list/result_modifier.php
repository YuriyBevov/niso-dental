<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

$sectionList = [];

$rsSections = CIBlockSection::GetList(
    ['SORT' => 'ASC'],
    [
        'IBLOCK_ID' => 13,
        'ACTIVE' => 'Y',
        'SECTION_ID' => null // null = только верхний уровень
    ],
    false,
    ['ID', 'NAME']
);
while ($arSection = $rsSections->Fetch()) {
    $sectionList[] = [
        "SECTION_ID" => $arSection['ID'],
        "SECTION_TITLE" => $arSection['NAME'],
    ];
}

$arResult["SECTION_LIST"] = $sectionList;
