<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
?>

<? $APPLICATION->IncludeComponent(
	"bitrix:form.result.new",
	"callback-form",
	array(
		"AJAX_MODE" => "Y",
		"AJAX_OPTION_JUMP" => "N",
		"AJAX_OPTION_STYLE" => "N",
		"AJAX_OPTION_HISTORY" => "N",
		"CACHE_TIME" => "3600",
		"CACHE_TYPE" => "A",
		"CHAIN_ITEM_LINK" => "",
		"CHAIN_ITEM_TEXT" => "",
		"EDIT_URL" => "",
		"IGNORE_CUSTOM_TEMPLATE" => "N",
		"LIST_URL" => "",
		"SEF_MODE" => "N",
		"SUCCESS_URL" => "",
		"USE_EXTENDED_ERRORS" => "Y",
		"WEB_FORM_ID" => "1",
		"COMPONENT_TEMPLATE" => "callback-form",
		"VARIABLE_ALIASES" => array(
			"WEB_FORM_ID" => "WEB_FORM_ID",
			"RESULT_ID" => "RESULT_ID",
		)
	),
	false
); ?>
</main>
<footer class="footer">
	<div class="container">
		<div class="footer__section footer__section--top">
			<a class="main-logo" href="/" aria-label="Название сайта для скринридера">
				<img src="<?= SITE_TEMPLATE_PATH ?>/assets/img/logo.svg" alt="Название сайта" width="180" height="40">
			</a>
			<button class="main-btn" type="button" data-modal-opener="callback-modal">
				<span>Записаться на прием</span>
			</button>

			<? $APPLICATION->IncludeComponent(
				"bitrix:menu",
				"bottom-top-menu",
				array(
					"ALLOW_MULTI_SELECT" => "N",
					"CHILD_MENU_TYPE" => "left",
					"DELAY" => "N",
					"MAX_LEVEL" => "1",
					"MENU_CACHE_GET_VARS" => array(),
					"MENU_CACHE_TIME" => "3600",
					"MENU_CACHE_TYPE" => "N",
					"MENU_CACHE_USE_GROUPS" => "Y",
					"ROOT_MENU_TYPE" => "bottom_top",
					"USE_EXT" => "N",
					"COMPONENT_TEMPLATE" => "bottom-top-menu"
				),
				false
			); ?>
		</div>

		<div class="footer__section footer__section--middle">
			<div class="footer__section-field">
				<div class="info-block info-block--address">
					<svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
						<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-pin"></use>
					</svg>
					<div class="info-block__content">
						<address>
							<?
							$APPLICATION->IncludeFile(
								SITE_DIR . 'include/address.php',
								array(),
								array('MODE' => 'html', 'NAME' => 'адрес', 'SHOW_BORDER' => true)
							);
							?>
						</address>
						<span class="worktime">
							<?
							$APPLICATION->IncludeFile(
								SITE_DIR . 'include/schedule.php',
								array(),
								array('MODE' => 'html', 'NAME' => 'время работы', 'SHOW_BORDER' => true)
							);
							?>
						</span>
					</div>
				</div>
				<div class="info-block info-block--contacts">
					<svg width="24" height="24" role="img" aria-hidden="true" focusable="false">
						<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-info"></use>
					</svg>
					<div class="info-block__content">
						<?
						$APPLICATION->IncludeFile(
							SITE_DIR . 'include/mail.php',
							array(),
							array('MODE' => 'html', 'NAME' => 'эл.почту', 'SHOW_BORDER' => true)
						);
						?>
						<?
						$APPLICATION->IncludeFile(
							SITE_DIR . 'include/phone.php',
							array(),
							array('MODE' => 'html', 'NAME' => 'телефон', 'SHOW_BORDER' => true)
						);
						?>
					</div>
				</div>
				<? $APPLICATION->IncludeComponent(
					"bitrix:news.list",
					"social",
					array(
						"ACTIVE_DATE_FORMAT" => "d.m.Y",
						"ADD_SECTIONS_CHAIN" => "N",
						"AJAX_MODE" => "N",
						"AJAX_OPTION_ADDITIONAL" => "",
						"AJAX_OPTION_HISTORY" => "N",
						"AJAX_OPTION_JUMP" => "N",
						"AJAX_OPTION_STYLE" => "Y",
						"CACHE_FILTER" => "N",
						"CACHE_GROUPS" => "Y",
						"CACHE_TIME" => "36000000",
						"CACHE_TYPE" => "A",
						"CHECK_DATES" => "Y",
						"DETAIL_URL" => "",
						"DISPLAY_BOTTOM_PAGER" => "N",
						"DISPLAY_DATE" => "N",
						"DISPLAY_NAME" => "N",
						"DISPLAY_PICTURE" => "N",
						"DISPLAY_PREVIEW_TEXT" => "N",
						"DISPLAY_TOP_PAGER" => "N",
						"FIELD_CODE" => array(
							0 => "",
							1 => "",
						),
						"FILTER_NAME" => "",
						"HIDE_LINK_WHEN_NO_DETAIL" => "N",
						"IBLOCK_ID" => "5",
						"IBLOCK_TYPE" => "site_content",
						"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
						"INCLUDE_SUBSECTIONS" => "N",
						"MESSAGE_404" => "",
						"NEWS_COUNT" => "20",
						"PAGER_BASE_LINK_ENABLE" => "N",
						"PAGER_DESC_NUMBERING" => "N",
						"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
						"PAGER_SHOW_ALL" => "N",
						"PAGER_SHOW_ALWAYS" => "N",
						"PAGER_TEMPLATE" => ".default",
						"PAGER_TITLE" => "Новости",
						"PARENT_SECTION" => "",
						"PARENT_SECTION_CODE" => "",
						"PREVIEW_TRUNCATE_LEN" => "",
						"PROPERTY_CODE" => array(
							0 => "LINK",
							1 => "ICON",
						),
						"SET_BROWSER_TITLE" => "N",
						"SET_LAST_MODIFIED" => "N",
						"SET_META_DESCRIPTION" => "N",
						"SET_META_KEYWORDS" => "N",
						"SET_STATUS_404" => "N",
						"SET_TITLE" => "N",
						"SHOW_404" => "N",
						"SORT_BY1" => "ACTIVE_FROM",
						"SORT_BY2" => "SORT",
						"SORT_ORDER1" => "DESC",
						"SORT_ORDER2" => "ASC",
						"STRICT_SECTION_CHECK" => "N",
						"COMPONENT_TEMPLATE" => "social"
					),
					false
				); ?>
			</div>
			<div class="footer__section-field">
				<? $APPLICATION->IncludeComponent(
					"bitrix:menu",
					"bottom-main-menu",
					array(
						"ALLOW_MULTI_SELECT" => "N",
						"CHILD_MENU_TYPE" => "left",
						"DELAY" => "N",
						"MAX_LEVEL" => "1",
						"MENU_CACHE_GET_VARS" => array(),
						"MENU_CACHE_TIME" => "3600",
						"MENU_CACHE_TYPE" => "N",
						"MENU_CACHE_USE_GROUPS" => "Y",
						"ROOT_MENU_TYPE" => "bottom_main",
						"USE_EXT" => "N",
						"COMPONENT_TEMPLATE" => "bottom-main-menu"
					),
					false
				); ?>
			</div>
		</div>
		<div class="footer__section footer__section--bottom">
			<div class="footer__section-field">
				<span class="base-text">© <?= date("Y") ?>. Все&nbsp;права&nbsp;защищены.</span>
				<?
				$APPLICATION->IncludeFile(
					SITE_DIR . 'include/licence-link.php',
					array(),
					array('MODE' => 'html', 'NAME' => 'ссылку	на лицензию', 'SHOW_BORDER' => true)
				);
				?>
				<?
				$APPLICATION->IncludeFile(
					SITE_DIR . 'include/policy-link.php',
					array(),
					array('MODE' => 'html', 'NAME' => 'ссылку	на политику конфиденциальности', 'SHOW_BORDER' => true)
				);
				?>
			</div>
			<div class="footer__section-field">
				<a class="developer-logo" href="https://littleweb.ru" aria-label="LittleWeb.ru - Разработка и продвижение сайтов под ключ" rel="nopener nofollow norefferer" target="_blank">
					<span>Создание и продвижение</span>
					<img src="data:image/svg+xml,%3csvg%20width='200'%20height='26'%20viewBox='0%200%20200%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20filter='url(%23filter0_i_362_1910)'%3e%3cpath%20d='M0%206.77185V2.33637H9.96412V21.0875H20.06V18.2158L26.3639%2016.9996V25.8847H3.66021V6.77185H0ZM27.3277%2012.3712V7.97926H36.385V25.8847H30.3468V12.3712H27.3277ZM30.3468%205.61443V0.884766H36.385V5.61443H30.3468ZM38.555%2012.3712V7.97926H41.5741V2.23605H47.6123V7.97926H53.5297V12.3712H47.6123V20.4792L49.0615%2021.4928H58.3603V25.8847H47.4915L41.5741%2021.8307V12.3712H38.555ZM56.3866%2012.3712V7.97926H59.4058V2.23605H65.444V7.97926H71.3619V12.3712H65.444V20.4792L66.8933%2021.4928H76.1923V25.8847H65.3232L59.4058%2021.8307V12.3712H56.3866ZM78.8447%2025.8847V2.23605H84.8836V21.4928H87.9025V25.8847H78.8447ZM87.8979%2012.3712V7.97926H112.292V16.932L96.9557%2019.9726V21.4928H106.255V19.9726L112.292%2019.1279V25.8847H90.9179V12.3712H87.8979ZM96.9557%2015.6144L106.255%2013.8915V12.3712H96.9557V15.6144Z'%20fill='%230F2650'/%3e%3c/g%3e%3cg%20filter='url(%23filter1_i_362_1910)'%3e%3cpath%20d='M113.442%2012.56V8.00598H120.175L124.368%2021.499L129.192%208.00598H135.671L139.301%2021.499L143.896%208.00598H148.376L143.431%2025.8843H135.671L132.097%2012.56L128.524%2025.8843H120.765L116.441%2012.56H113.442ZM149.601%2012.3913V8.00598H174.323V16.9451L158.78%2019.9811V21.499H168.203V19.9811L174.323%2019.1377V25.8843H152.661V12.3913H149.601ZM158.78%2015.6297L168.203%2013.9092V12.3913H158.78V15.6297ZM175.034%206.65679V2.27148H184.213V7.33131L200%2010.03V25.8843H184.947L183.723%2024.1977L182.475%2025.8843H178.094V6.65679H175.034ZM184.213%2021.499H193.881V13.2345L184.213%2011.5479V21.499Z'%20fill='%2344C6E9'/%3e%3c/g%3e%3cdefs%3e%3cfilter%20id='filter0_i_362_1910'%20x='0'%20y='0.884766'%20width='114.292'%20height='31'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='BackgroundImageFix'%20result='shape'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dx='2'%20dy='6'/%3e%3cfeGaussianBlur%20stdDeviation='5'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='arithmetic'%20k2='-1'%20k3='1'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.15%200'/%3e%3cfeBlend%20mode='normal'%20in2='shape'%20result='effect1_innerShadow_362_1910'/%3e%3c/filter%3e%3cfilter%20id='filter1_i_362_1910'%20x='113.442'%20y='2.27148'%20width='88.5583'%20height='29.6133'%20filterUnits='userSpaceOnUse'%20color-interpolation-filters='sRGB'%3e%3cfeFlood%20flood-opacity='0'%20result='BackgroundImageFix'/%3e%3cfeBlend%20mode='normal'%20in='SourceGraphic'%20in2='BackgroundImageFix'%20result='shape'/%3e%3cfeColorMatrix%20in='SourceAlpha'%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%20127%200'%20result='hardAlpha'/%3e%3cfeOffset%20dx='2'%20dy='6'/%3e%3cfeGaussianBlur%20stdDeviation='5'/%3e%3cfeComposite%20in2='hardAlpha'%20operator='arithmetic'%20k2='-1'%20k3='1'/%3e%3cfeColorMatrix%20type='matrix'%20values='0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.15%200'/%3e%3cfeBlend%20mode='normal'%20in2='shape'%20result='effect1_innerShadow_362_1910'/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e" alt="LittleWeb.ru - Разработка и продвижение сайтов под ключ" width="275" height="40"></a>
			</div>
		</div>
	</div>
</footer>

<div class="modal-overlay">
	<div class="modal main-modal callback-modal" id="callback-modal">
		<div class="modal-wrapper">
			<button class="modal-closer" type="button" aria-label="Закрыть">
				<svg width="14" height="14">
					<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-close"></use>
				</svg>
			</button>
			<div class="modal-content">
				<?
				$APPLICATION->IncludeComponent(
					"bitrix:form.result.new",
					"callback-form-popup",
					array(
						"IS_MODAL" => "Y",
						"AJAX_MODE" => "Y",
						"AJAX_OPTION_JUMP" => "N",
						"AJAX_OPTION_STYLE" => "N",
						"AJAX_OPTION_HISTORY" => "Y",
						"CACHE_TIME" => "3600",
						"CACHE_TYPE" => "A",
						"CHAIN_ITEM_LINK" => "",
						"CHAIN_ITEM_TEXT" => "",
						"EDIT_URL" => "",
						"IGNORE_CUSTOM_TEMPLATE" => "N",
						"LIST_URL" => "",
						"SEF_MODE" => "N",
						"SUCCESS_URL" => "",
						"USE_EXTENDED_ERRORS" => "Y",
						"WEB_FORM_ID" => "3",
						"COMPONENT_TEMPLATE" => "callback-inline",
						"VARIABLE_ALIASES" => array(
							"WEB_FORM_ID" => "WEB_FORM_ID",
							"RESULT_ID" => "RESULT_ID",
						),
					),
					$component
				); ?>
			</div>
		</div>
	</div>
</div>

<?/*
$APPLICATION->IncludeFile(
	SITE_DIR . "include/preloader.php",
	array(),
	array("MODE" => "html", "SHOW_BORDER" => false)
);
*/ ?>
</body>

</html>