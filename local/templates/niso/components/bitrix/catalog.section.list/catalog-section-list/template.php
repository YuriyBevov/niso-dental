<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);

$curPage = $APPLICATION->GetCurPage();
?>

<? if ($arResult["SECTIONS"]): ?>
	<section class="base-section services-preview" style="<?= ($curPage == '/services/' ? 'margin-bottom:70px;' : '') ?>">
		<div class="container">
			<div class="base-section__header">
				<span class="base-text base-section__headline">
					<?
					$APPLICATION->IncludeFile(
						SITE_DIR . 'include/headlines/services-preview-headline.php',
						array(),
						array('MODE' => 'html', 'NAME' => 'надпись над заголовком', 'SHOW_BORDER' => true)
					);
					?>
				</span>
				<h2 class="base-title"><?= $arResult["NAME"] ?></h2>
				<p class="base-text"><?= $arResult["DESCRIPTION"] ?></p>
			</div>
			<div class="services-preview__grid <?= ($curPage == '/services/' ? 'grid-2cols' : '') ?>">
				<? foreach ($arResult["SECTIONS"] as &$arSection):
					$this->AddEditAction($arSection['ID'], $arSection['EDIT_LINK'], $strSectionEdit);
					$this->AddDeleteAction($arSection['ID'], $arSection['DELETE_LINK'], $strSectionDelete, $arSectionDeleteParams);
				?>
					<? if ($arSection["ELEMENTS"]):
						// показываю раздел инфоблока, только если в нем есть элементы(услуги)
					?>
						<div class="services-preview__grid-item">
							<div class="service-preview-card-wrapper">
								<div class="service-preview-card" id="<?= $this->GetEditAreaId($arSection['ID']); ?>">
									<div class="service-preview-card-header">
										<? if ($arSection["PICTURE"]["SRC"]): ?>
											<img loading="lazy" src="<?= $arSection["PICTURE"]["SRC"] ?>" alt="<?= $arSection["NAME"] ?>" width="40" height="40">
										<? endif; ?>
										<span class="base-subtitle">
											<?= $arSection["NAME"] ?>
											<? if ($arParams["COUNT_ELEMENTS"] && $arSection['ELEMENT_CNT'] !== null): ?>
												<small>(<?= $arSection['ELEMENT_CNT'] ?>)</small>
											<? endif; ?>
										</span>
									</div>
									<span class="base-text"><?= $arSection["DESCRIPTION"] ?></span>
									<ul>
										<? foreach ($arSection["ELEMENTS"] as $arElement): ?>
											<li><a href="<?= $arElement["DETAIL_PAGE_URL"] ?>"><?= $arElement["NAME"] ?></a></li>
										<? endforeach; ?>
									</ul>
								</div>
							</div>
						</div>
					<? endif; ?>
				<? endforeach; ?>
			</div>
		</div>
	</section>
<? endif; ?>