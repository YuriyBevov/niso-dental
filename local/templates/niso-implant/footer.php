<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
?>

<? $APPLICATION->IncludeComponent(
	"bitrix:form.result.new",
	"inline",
	array(
		"FORM_COLOR_TYPE" => "dark",
		"AJAX_MODE" => "Y", // включаем AJAX-режим
		"AJAX_OPTION_JUMP" => "N",
		"AJAX_OPTION_STYLE" => "Y",
		"AJAX_OPTION_HISTORY" => "N",
		"AJAX_OPTION_ADDITIONAL" => "",
		"CACHE_TYPE" => "N",
		"CHAIN_ITEM_LINK" => "",
		"CHAIN_ITEM_TEXT" => "",
		"EDIT_URL" => "",
		"IGNORE_CUSTOM_TEMPLATE" => "N",
		"LIST_URL" => "",
		"SEF_MODE" => "N",
		"SUCCESS_URL" => "",
		"USE_EXTENDED_ERRORS" => "Y",
		"VARIABLE_ALIASES" => array("RESULT_ID" => "RESULT_ID", "WEB_FORM_ID" => "WEB_FORM_ID"),
		"WEB_FORM_ID" => 8
	)
);
?>

<section class="section contacts">
	<div class="container">
		<div class="section__header">
			<h2 class="title">Контакты</h2>
		</div>

		<div class="contacts__main">
			<div class="contacts__main-section">
				<div class="contacts__main-section-icon">
					<svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
						<use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#clock' ?>"> </use>
					</svg>
				</div>
				<div class="contacts__main-section-content">
					<span class="contacts__main-section-title">Часы работы:</span>
					<span>Пн–Вс: 9:00–21:00</span>
				</div>
			</div>

			<div class="contacts__main-section">
				<div class="contacts__main-section-icon">
					<svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
						<use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#pin' ?>"> </use>
					</svg>
				</div>
				<address class="contacts__main-section-content">
					<span class="contacts__main-section-title">Адрес:</span>
					<span>Санкт-Петербург,</span>
					<span>ул. Профессора Попова, 27</span>
				</address>
			</div>
			<div class="contacts__main-section">
				<div class="contacts__main-section-icon">
					<svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
						<use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#phone' ?>"> </use>
					</svg>
				</div>
				<div class="contacts__main-section-content">
					<span class="contacts__main-section-title">Телефоны:</span>
					<a href="tel:+79817685425">+7 (981) 768-54-25</a>
					<a href="tel:+78123275154">+7 (812) 327-51-54</a>
				</div>
			</div>
		</div>

		<div class="contacts__map">
			<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Aa26a192d15767e248ff73a7941dea71c9b1ac7d1900a03dae621e86fe013c303&amp;source=constructor&amp;scroll=false" width="100%" height="600" frameborder="0"></iframe>
		</div>
	</div>
</section>

<? $APPLICATION->IncludeComponent(
	"bitrix:form.result.new",
	"inline",
	array(
		"AJAX_MODE" => "Y", // включаем AJAX-режим
		"AJAX_OPTION_JUMP" => "N",
		"AJAX_OPTION_STYLE" => "Y",
		"AJAX_OPTION_HISTORY" => "N",
		"AJAX_OPTION_ADDITIONAL" => "",
		"CACHE_TYPE" => "N",
		"CHAIN_ITEM_LINK" => "",
		"CHAIN_ITEM_TEXT" => "",
		"EDIT_URL" => "",
		"IGNORE_CUSTOM_TEMPLATE" => "N",
		"LIST_URL" => "",
		"SEF_MODE" => "N",
		"SUCCESS_URL" => "",
		"USE_EXTENDED_ERRORS" => "Y",
		"VARIABLE_ALIASES" => array("RESULT_ID" => "RESULT_ID", "WEB_FORM_ID" => "WEB_FORM_ID"),
		"WEB_FORM_ID" => 7
	)
);
?>

</main>
<footer class="footer">
	<div class="container">
		<div class="footer__top">
			<div class="footer__top-section footer__top-section--logo">
				<a href="/" class="logo">
					<img src="<?= SITE_TEMPLATE_PATH ?>/assets/images/logo-white.svg" alt="Стоматологическая клиника НИСО" width="200" height="60">
				</a>
			</div>

			<div class="footer__top-section footer__top-section--rights">
				<span class="base-text">© <?= Date('Y') ?>. Все права защищены.</span>
			</div>

			<div class="footer__top-section footer__top-section--social">
				<? $APPLICATION->IncludeComponent(
					"bitrix:news.list",
					"social",
					array(
						"IBLOCK_ID" => "27",
						"IBLOCK_TYPE" => "niso_implant",
						"NEWS_COUNT" => "5",
						"PROPERTY_CODE" => array("", "ICON", ""),
						"SET_BROWSER_TITLE" => "N",
						"SET_LAST_MODIFIED" => "N",
						"SET_META_DESCRIPTION" => "N",
						"SET_META_KEYWORDS" => "N",
						"SET_TITLE" => "N",
						"SORT_BY1" => "ACTIVE_FROM",
						"SORT_BY2" => "SORT",
						"SORT_ORDER1" => "DESC",
						"SORT_ORDER2" => "ASC",
						"STRICT_SECTION_CHECK" => "N"
					)
				); ?>
			</div>

			<div class="footer__top-section footer__top-section--contacts">
				<div class="footer__contact-field">
					<svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
						<use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#clock' ?>"> </use>
					</svg>
					<span>Часы работы:</span>
					<span>Пн–Вс: 9:00–21:00</span>
				</div>

				<address class="footer__contact-field">
					<svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
						<use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#pin' ?>"> </use>
					</svg>
					<span>Санкт-Петербург,</span>
					<span>ул. Профессора Попова, 27</span>
				</address>

				<div class="footer__contact-field">
					<svg width='16' height='16' role='img' aria-hidden='true' focusable='false'>
						<use xlink:href="<?= SITE_TEMPLATE_PATH . '/assets/sprite.svg#phone' ?>"> </use>
					</svg>
					<a href="tel:+79817685425">+7 (981) 768-54-25</a>
					<a href="tel:+78123275154">+7 (812) 327-51-54</a>
				</div>
			</div>

			<div class="footer__top-section footer__top-section--nav">
				<ul class="bottom-menu">
					<li><a href="#">Преимущества</a></li>
					<li><a href="#">Этапы</a></li>
					<li><a href="#">Цены</a></li>
					<li><a href="#">Врачи</a></li>
					<li><a href="#">Работы</a></li>
					<li><a href="#">Отзывы</a></li>
					<li><a href="#">Контакты</a></li>
				</ul>
			</div>

		</div>

		<div class="footer__bottom">
			<a href="#" class="base-text">Лицензия на осуществление медицинской деятельности.</a>
			<a href="#" class="base-text">Политика конфиденциальности.</a>
		</div>
		<div class="footer__dev">
			<a class="developer" href="https://t.me/+79062723744" aria-label="LittleWeb.ru - Разработка и продвижение сайтов под ключ" rel="nopener nofollow norefferer" target="_blank">
				<span>Создано в</span>
				<img src="data:image/svg+xml,%3csvg%20width='160'%20height='21'%20viewBox='0%200%20160%2021'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20filter='url(%23filter0_i_3079_8145)'%3e%3cpath%20d='M0%205.16671V1.61832H7.97131V16.6192H16.048V14.3219L21.0912%2013.3489V20.457H2.92818V5.16671H0ZM21.8622%209.64619V6.13264H29.1081V20.457H24.2775V9.64619H21.8622ZM24.2775%204.24077V0.457031H29.1081V4.24077H24.2775ZM30.844%209.64619V6.13264H33.2593V1.53806H38.0899V6.13264H42.8239V9.64619H38.0899V16.1326L39.2493%2016.9435H46.6883V20.457H37.9933L33.2593%2017.2138V9.64619H30.844ZM45.1094%209.64619V6.13264H47.5247V1.53806H52.3553V6.13264H57.0896V9.64619H52.3553V16.1326L53.5148%2016.9435H60.954V20.457H52.2587L47.5247%2017.2138V9.64619H45.1094ZM63.0759%2020.457V1.53806H67.9071V16.9435H70.3222V20.457H63.0759ZM70.3185%209.64619V6.13264H89.8342V13.2948L77.5647%2015.7273V16.9435H85.0039V15.7273L89.8342%2015.0516V20.457H72.7345V9.64619H70.3185ZM77.5647%2012.2408L85.0039%2010.8624V9.64619H77.5647V12.2408Z'%20fill='%23B1C2AB'/%3e%3c/g%3e%3cg%20filter='url(%23filter1_i_3079_8145)'%3e%3cpath%20d='M90.7539%209.79724V6.15402H96.1401L99.4944%2016.9485L103.354%206.15402H108.537L111.441%2016.9485L115.117%206.15402H118.701L114.745%2020.4567H108.537L105.678%209.79724L102.819%2020.4567H96.6125L93.1534%209.79724H90.7539ZM119.681%209.66227V6.15402H139.459V13.3054L127.025%2015.7341V16.9485H134.563V15.7341L139.459%2015.0594V20.4567H122.129V9.66227H119.681ZM127.025%2012.253L134.563%2010.8766V9.66227H127.025V12.253ZM140.027%205.07466V1.56641H147.371V5.61427L160.001%207.77324V20.4567H147.958L146.979%2019.1074L145.981%2020.4567H142.476V5.07466H140.027ZM147.371%2016.9485H155.105V10.3369L147.371%208.98756V16.9485Z'%20fill='%23F4F1ED'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_i_3079_8145'%20x='0'%20y='0.457031'%20width='91.834'%20height='26'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='BackgroundImageFix'%20result='shape'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dx='2'%20dy='6'/%3e%3cfeGaussianBlur%20stdDeviation='5'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='arithmetic'%20k2='-1'%20k3='1'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.15%200'/%3e%3cfeBlend%20mode='normal'%20in2='shape'%20result='effect1_innerShadow_3079_8145'/%3e%3c/filter%3e%3cfilter%20id='filter1_i_3079_8145'%20x='90.7539'%20y='1.56641'%20width='71.2471'%20height='24.8906'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='BackgroundImageFix'%20result='shape'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dx='2'%20dy='6'/%3e%3cfeGaussianBlur%20stdDeviation='5'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='arithmetic'%20k2='-1'%20k3='1'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.15%200'/%3e%3cfeBlend%20mode='normal'%20in2='shape'%20result='effect1_innerShadow_3079_8145'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e" alt="Логотип" width="160" height="20">
			</a>
		</div>
	</div>
</footer>
<? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/include/cookie/template.php"); ?>
</body>

</html>
