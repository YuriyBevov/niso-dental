<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}

if (!empty($arResult['CATEGORIES']) && $arResult['CATEGORIES_ITEMS_EXISTS']):?>
<div class="search-result__content">
    <?php if (!empty($arResult['CATEGORIES'][0]['ITEMS'])): ?>
        <ul class="search-result__list">
            <?php foreach ($arResult['CATEGORIES'][0]['ITEMS'] as $arItem): ?>
                <li class="search-result__item">
                    <a href="<?= $arItem['URL'] ?>"><?= $arItem['NAME'] ?></a>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>

    <?php if (!empty($arResult['CATEGORIES']['all']['ITEMS'][0])): ?>
       <a class="search-result__all main-btn main-btn--outlined" href="<?= $arResult['CATEGORIES']['all']['ITEMS'][0]['URL'] ?>"><?= $arResult['CATEGORIES']['all']['ITEMS'][0]['NAME'] ?></a>
    <?php endif; ?>
</div>
<? endif; ?>
