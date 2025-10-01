<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

$authorID = $arResult['PROPERTIES']['AUTHOR']['VALUE'];
if ($authorID) {
    $res = CIBlockElement::GetByID($authorID);
    if ($arAuthorElement = $res->GetNextElement()) { // GetNextElement для работы с объектом
        $arFields = $arAuthorElement->GetFields();     // стандартные поля
        $arProps  = $arAuthorElement->GetProperties(); // все пользовательские свойства
        $socials = [];
            if (!empty($arProps['SOCIALS']['VALUE']) && is_array($arProps['SOCIALS']['VALUE'])) {
                foreach ($arProps['SOCIALS']['VALUE'] as $social) {
                    $icon = null;
                    $link = null;

                    if (!empty($social['SUB_VALUES']['SOCIAL_NAME']['VALUE'])) {
                        $name = $social['SUB_VALUES']['SOCIAL_NAME']['VALUE'];
                    }

                    if (!empty($social['SUB_VALUES']['SOCIAL_ICON']['VALUE'])) {
                        $file = CFile::GetFileArray($social['SUB_VALUES']['SOCIAL_ICON']['VALUE']);
                        $icon = $file['SRC'] ?? null;
                    }

                    if (!empty($social['SUB_VALUES']['SOCIAL_LINK']['VALUE'])) {
                        $link = $social['SUB_VALUES']['SOCIAL_LINK']['VALUE'];
                    }

                    $socials[] = [
                        'NAME' => $name,
                        'ICON' => $icon,
                        'LINK' => $link,
                    ];
                }
            }

        $arResult['AUTHOR'] = [
            'NAME' => $arFields['NAME'],
            'JOB_TITLE' => $arFields['PREVIEW_TEXT'] ?? '',
            'PREVIEW_PICTURE' => $arFields['PREVIEW_PICTURE'] ? CFile::GetFileArray($arFields['PREVIEW_PICTURE'])['SRC'] : null,
            'COMPANY' => $arProps['DESCRIPTION']['VALUE']['TEXT'] ?? '',
            'DESCRIPTION' => $arFields['DETAIL_TEXT'] ?? '',
            'COMPANY' => $arProps['COMPANY']['VALUE'] ?? '',
            'SOCIAL' => $arProps['SOCIAL']['VALUE'] ?? [],
            'DETAIL_PAGE_URL' => $arProps['AUTHOR_PAGE']['VALUE'] ?? '#',
            'SOCIALS'  => $socials,
        ];
    }
}
