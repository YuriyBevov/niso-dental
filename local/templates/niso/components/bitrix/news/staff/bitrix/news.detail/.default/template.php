<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true); ?>

<section class="base-section staff-detail">
	<div class="container">
		<div class="base-section__header">
			<span class="base-text base-section__headline">
				<?
				$APPLICATION->IncludeFile(
					SITE_DIR . 'include/headlines/staff-headline.php',
					array(),
					array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
				);
				?>
			</span>
			<h1 class="base-title"><?= $arResult["NAME"] ?></h1>
		</div>
		<div class="staff-detail__grid">
			<div class="staff-detail__grid-item staff-detail__grid-item--side">
				<div class="staff-detail__img-wrapper">
					<img src="<?= $arResult["DETAIL_PICTURE"]["SRC"] ?>" alt="<?= $arResult["NAME"] ?>" width="500" height="500">
				</div>
			</div>
			<div class="staff-detail__grid-item content">
				<? if ($arResult["PROPERTIES"]["POSITION"]["VALUE"]): ?>
					<strong>Должность</strong>
					<span><?= $arResult["PROPERTIES"]["POSITION"]["VALUE"] ?></span>
				<? endif; ?>
				<? if (!empty($arResult["PROPERTIES"]["DESCR_FIELD"]["~VALUE"])): ?>
					<? foreach ($arResult["PROPERTIES"]["DESCR_FIELD"]["~VALUE"] as $arField): ?>
						<strong><?= $arField["SUB_VALUES"]["DESCR_TITLE"]["~VALUE"] ?></strong>
						<?= $arField["SUB_VALUES"]["DESCR_CONTENT"]["~VALUE"]["TEXT"] ?>
					<? endforeach; ?>
				<? endif; ?>
				<button class="main-btn" data-modal-opener="callback-modal" data-doctor-name="<?= $arResult["NAME"] ?>">
					<span>Записаться на прием</span>
				</button>

				<? if ($arResult["DETAIL_TEXT"]): ?>
					<div class="content">
						<?= $arResult["DETAIL_TEXT"] ?>
					</div>
				<? endif; ?>



				<? if ($arResult['PROPERTIES']['REVIEWS_PRODOCTOROV']['VALUE']): ?>
					<?
					$GLOBALS['arLinkedRewiesFilter'] = array('ID' => $arResult['PROPERTIES']['REVIEWS_PRODOCTOROV']['VALUE']);
					$APPLICATION->IncludeComponent(
						"bitrix:news.list",
						"staff-reviews",
						array(
							"CUSTOM_LINK" => $arResult['PROPERTIES']['PROFILE_LINK_PRODOCTOROV']['VALUE'],
							"ACTIVE_DATE_FORMAT" => "j F Y",
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
							"COMPONENT_TEMPLATE" => "staff-reviews",
							"DETAIL_URL" => "",
							"DISPLAY_BOTTOM_PAGER" => "Y",
							"DISPLAY_DATE" => "Y",
							"DISPLAY_NAME" => "Y",
							"DISPLAY_PICTURE" => "Y",
							"DISPLAY_PREVIEW_TEXT" => "Y",
							"DISPLAY_TOP_PAGER" => "N",
							"FIELD_CODE" => [0 => "", 1 => "",],
							"FILTER_NAME" => "arLinkedRewiesFilter",
							"HIDE_LINK_WHEN_NO_DETAIL" => "N",
							"IBLOCK_ID" => "39",
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
							"PROPERTY_CODE" => [0 => "DATE", 1 => "RATING", 2 => "",],
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
					unset($GLOBALS['arLinkedServicesFilter']);
					?>
				<? endif; ?>
				<!-- Документы -->

				<? if (!empty($arResult["PROPERTIES"]["DOCS"]["VALUE"])): ?>
					<section class="base-section staff-docs">
						<div class="base-section__header">
							<h2 class="base-title">Сертификаты и свидетельства</h2>
						</div>
						<div class="swiper staff-docs-slider">
							<div class="swiper-wrapper">
								<? foreach ($arResult["PROPERTIES"]["DOCS"]["VALUE"] as $arItem): ?>
									<?
									$this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_EDIT"));
									$this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], CIBlock::GetArrayByID($arItem["IBLOCK_ID"], "ELEMENT_DELETE"), array("CONFIRM" => GetMessage('CT_BNL_ELEMENT_DELETE_CONFIRM')));
									?>
									<div class="swiper-slide">
										<? $fileId = (int)$arItem['SUB_VALUES']['DOC_FILE']['VALUE']; ?>
										<img src="<?= CFile::GetPath($fileId); ?>" alt="<?= $arItem['SUB_VALUES']['DOC_TITLE']['VALUE'] ?>" width="400" height="300" loading="lazy" data-fancybox="certificates">
									</div>
								<? endforeach; ?>
							</div>
							<div class="swiper-pagination"></div>
						</div>
					</section>
				<? endif; ?>

				<!-- Документы -->

			</div>
		</div>

	</div>
</section>
