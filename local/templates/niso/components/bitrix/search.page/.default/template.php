<?php if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true)
{
	die();
}
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
?>
<section class="base-section search-page">
	<div class="container">
		<h1 class="base-title">Поиск</h1>
		<form class="search-form" action="" method="get">
			<input class="search-form__input" type="text" name="q" value="<?=$arResult['REQUEST']['QUERY']?>" size="40" />
			<button class="search-form__submit-btn" type="submit">
				<img src="/img/search.svg" alt="Искать на странице" width="24" height="24">
			</button>
			<input type="hidden" name="how" value="<? echo $arResult['REQUEST']['HOW'] == 'd' ? 'd' : 'r'?>" />
		</form>

		<? if ($arResult['REQUEST']['QUERY'] === false && $arResult['REQUEST']['TAGS'] === false):?>
		<? elseif ($arResult['ERROR_CODE'] != 0):?>
			<p class="search-page__error-text">К сожалению, по вашему запросу ничего не найдено</p>
		<? elseif (count($arResult['SEARCH']) > 0):?>
			<p>По вашему запросу найдено:</p>
			<ul class="search-page__list">
				<? foreach ($arResult['SEARCH'] as $arItem):?>
					<? if (!empty($arItem['URL'])) :?>
						<li class="search-page__item">
							<a href="<?=$arItem['URL']?>"><?=$arItem['TITLE_FORMATED']?></a>
							<? if ($arItem['BODY_FORMATED']): ?>
							<p><?=$arItem['BODY_FORMATED']?></p>
							<? endif; ?>
						</li>
					<? endif; ?>
				<? endforeach;?>
			</ul>

			<? if ($arParams['DISPLAY_BOTTOM_PAGER'] != 'N') :?>
				<?=$arResult['NAV_STRING']?>
			<? endif; ?>

		<? else:?>
			<? ShowNote(GetMessage('SEARCH_NOTHING_TO_FOUND'));?>
		<? endif; ?>
	</div>
</section>
