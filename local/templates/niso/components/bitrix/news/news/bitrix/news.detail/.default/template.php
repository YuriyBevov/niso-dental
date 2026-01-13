<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);

?>
<section class="base-section news-detail">
	<div class="container">
		<div class="base-section__header">
			<span class="base-text base-section__headline">
				<?
				$APPLICATION->IncludeFile(
					SITE_DIR . 'include/headlines/news-headline.php',
					array(),
					array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
				);
				?>
			</span>
			<h1 class="base-title"><?= (!empty($arResult['IPROPERTY_VALUES']['ELEMENT_PAGE_TITLE']) ? $arResult['IPROPERTY_VALUES']['ELEMENT_PAGE_TITLE'] : $arResult["NAME"]) ?></h1>
		</div>
		<div class="news-detail__grid">
			<div class="news-detail__grid-item news-detail__grid-item--content">
				<div class="content">
					<?= $arResult["DETAIL_TEXT"] ?>
				</div>

				<? if (!empty($arResult["PROPERTIES"]["FAQ"]["VALUE"])):
					$GLOBALS['arLinkedFaqFilter'] = array('ID' => $arResult["PROPERTIES"]["FAQ"]["VALUE"]);
					$APPLICATION->IncludeComponent(
						"bitrix:news.list",
						"faq-preview",
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
							"COMPONENT_TEMPLATE" => "faq-preview",
							"DETAIL_URL" => "",
							"DISPLAY_BOTTOM_PAGER" => "Y",
							"DISPLAY_TOP_PAGER" => "N",
							"FIELD_CODE" => [0 => "", 1 => "",],
							"FILTER_NAME" => "arLinkedFaqFilter",
							"HIDE_LINK_WHEN_NO_DETAIL" => "N",
							"IBLOCK_ID" => "4",
							"IBLOCK_TYPE" => "site_content",
							"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
							"INCLUDE_SUBSECTIONS" => "Y",
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
							"PROPERTY_CODE" => [0 => "", 1 => "",],
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
							"STRICT_SECTION_CHECK" => "N"
						),
						$component
					);
					unset($GLOBALS["arLinkedFaqFilter"]);
				?>
				<? endif; ?>

				<? if ($arResult['AUTHOR']): ?>
					<div class="news-detail__author" itemscope itemtype="https://schema.org/Person">
						<img class="news-detail__author-photo" src="<?= ($arResult['AUTHOR']['PREVIEW_PICTURE']) ?>" alt="<?= $arResult['AUTHOR']['NAME'] ?>" width="300" height="300" itemprop="image">
						<div class="news-detail__author-content">
							<p class="news-detail__author-about">
								<span class="news-detail__author-name" itemprop="name"><?= $arResult['AUTHOR']['NAME'] ?></span>
								<span class="news-detail__author-job-title" itemprop="jobTitle"><?= $arResult['AUTHOR']['JOB_TITLE'] ?></span>
							</p>
							<p class="news-detail__author-description" itemprop="description"><?= $arResult['AUTHOR']['DESCRIPTION'] ?></p>
							<span class="news-detail__author-company" itemprop="affiliation" itemscope itemtype="https://schema.org/Organization">
								<span itemprop="name"><?= $arResult['AUTHOR']['COMPANY'] ?></span>
							</span>
							<? if ($arResult['AUTHOR']['DETAIL_PAGE_URL']): ?>
								<a class="main-btn main-btn--outlined" href="<?= $arResult['AUTHOR']['DETAIL_PAGE_URL'] ?>">Подробнее о специалисте</a>
							<? endif; ?>
							<? if ($arResult['AUTHOR']['EMAIL']): ?>
								<span class="news-detail__author-email" itemscope itemtype="https://schema.org/ContactPoint" itemprop="contactPoint">
									<meta itemprop="contactType" content="personal">
									<a href="mailto:<?= $arResult['AUTHOR']['EMAIL'] ?>" aria-label="Написать автору по email" rel="noopener noreferrer" target="_blank" itemprop="email"><?= $arResult['AUTHOR']['EMAIL'] ?></a>
								</span>
							<? endif; ?>
							<? if (!empty($arResult['AUTHOR']['SOCIALS'])): ?>
								<div class="social-block">
									<? foreach ($arResult['AUTHOR']['SOCIALS'] as $arItem): ?>
										<div itemscope itemtype="https://schema.org/ContactPoint" itemprop="contactPoint">
											<meta itemprop="contactType" content="personal">
											<a class="social-block__item" href="<?= $arItem['LINK'] ?>" aria-label="Написать автору в <?= $arItem['NAME'] ?>" rel="noopener nofollow noreferrer" target="_blank" itemprop="url">
												<img src="<?= $arItem['ICON'] ?>" alt="<?= $arItem['NAME'] ?>" width="16" height="16">
											</a>
										</div>
									<? endforeach; ?>
								</div>
							<? endif; ?>
						</div>
					</div>
				<? endif ?>
			</div>
			<? if (!empty($arResult['PROPERTIES']['LINKED']['VALUE'])): ?>
				<div class="news-detail__grid-item news-detail__grid-item--side">
					<span class="base-subtitle">Похожие новости</span>

					<?
					$GLOBALS['arLinkedFilter'] = array('ID' => $arResult['PROPERTIES']['LINKED']['VALUE']);
					$APPLICATION->IncludeComponent(
						"bitrix:news.list",
						"news-side",
						[
							"IBLOCK_TYPE" => $arParams["IBLOCK_TYPE"],
							"IBLOCK_ID" => $arParams["IBLOCK_ID"],
							"NEWS_COUNT" => $arParams["NEWS_COUNT"],
							"SORT_BY1" => $arParams["SORT_BY1"],
							"SORT_ORDER1" => $arParams["SORT_ORDER1"],
							"SORT_BY2" => $arParams["SORT_BY2"],
							"SORT_ORDER2" => $arParams["SORT_ORDER2"],
							"FIELD_CODE" => $arParams["LIST_FIELD_CODE"],
							"PROPERTY_CODE" => $arParams["LIST_PROPERTY_CODE"],
							"DETAIL_URL" => $arParams["DETAIL_URL"], //"/news/#ELEMENT_CODE#/",
							"SECTION_URL" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["section"],
							"IBLOCK_URL" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["news"],
							"SET_TITLE" => $arParams["SET_TITLE"],
							"SET_LAST_MODIFIED" => $arParams["SET_LAST_MODIFIED"],
							"MESSAGE_404" => $arParams["MESSAGE_404"],
							"SET_STATUS_404" => $arParams["SET_STATUS_404"],
							"SHOW_404" => $arParams["SHOW_404"],
							"FILE_404" => $arParams["FILE_404"],
							"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
							"CACHE_TYPE" => $arParams["CACHE_TYPE"],
							"CACHE_TIME" => $arParams["CACHE_TIME"],
							"CACHE_FILTER" => $arParams["CACHE_FILTER"],
							"CACHE_GROUPS" => $arParams["CACHE_GROUPS"],
							"DISPLAY_TOP_PAGER" => $arParams["DISPLAY_TOP_PAGER"],
							"DISPLAY_BOTTOM_PAGER" => $arParams["DISPLAY_BOTTOM_PAGER"],
							"PAGER_TITLE" => $arParams["PAGER_TITLE"],
							"PAGER_TEMPLATE" => $arParams["PAGER_TEMPLATE"],
							"PAGER_SHOW_ALWAYS" => $arParams["PAGER_SHOW_ALWAYS"],
							"PAGER_DESC_NUMBERING" => $arParams["PAGER_DESC_NUMBERING"],
							"PAGER_DESC_NUMBERING_CACHE_TIME" => $arParams["PAGER_DESC_NUMBERING_CACHE_TIME"],
							"PAGER_SHOW_ALL" => $arParams["PAGER_SHOW_ALL"],
							"PAGER_BASE_LINK_ENABLE" => $arParams["PAGER_BASE_LINK_ENABLE"],
							"PAGER_BASE_LINK" => $arParams["PAGER_BASE_LINK"],
							"PAGER_PARAMS_NAME" => $arParams["PAGER_PARAMS_NAME"],
							"DISPLAY_DATE" => $arParams["DISPLAY_DATE"],
							"DISPLAY_NAME" => "Y",
							"DISPLAY_PICTURE" => $arParams["DISPLAY_PICTURE"],
							"DISPLAY_PREVIEW_TEXT" => $arParams["DISPLAY_PREVIEW_TEXT"],
							"PREVIEW_TRUNCATE_LEN" => $arParams["PREVIEW_TRUNCATE_LEN"],
							"ACTIVE_DATE_FORMAT" => $arParams["LIST_ACTIVE_DATE_FORMAT"],
							"USE_PERMISSIONS" => $arParams["USE_PERMISSIONS"],
							"GROUP_PERMISSIONS" => $arParams["GROUP_PERMISSIONS"],
							"FILTER_NAME" => "arLinkedFilter",
							"HIDE_LINK_WHEN_NO_DETAIL" => $arParams["HIDE_LINK_WHEN_NO_DETAIL"],
							"CHECK_DATES" => $arParams["CHECK_DATES"],
						],
						$component
					);
					unset($GLOBALS['arLinkedFilter']);
					?>

				</div>
			<? endif; ?>
		</div>
	</div>
</section>
