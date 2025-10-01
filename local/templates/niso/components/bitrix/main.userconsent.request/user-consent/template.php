<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

/** @var array $arParams */
/** @var array $arResult */

use Bitrix\Main\Localization\Loc;

Loc::loadMessages(__DIR__ . '/user_consent.php');
$config = \Bitrix\Main\Web\Json::encode($arResult['CONFIG']);

$linkClassName = 'main-user-consent-request-announce';
if ($arResult['URL']) {
	$url = htmlspecialcharsbx(\CUtil::JSEscape($arResult['URL']));
	$label = htmlspecialcharsbx($arResult['LABEL']);
	$label = explode('%', $label);
	$label = implode('', array_merge(
		array_slice($label, 0, 1),
		['<a href="' . $url  . '" target="_blank">'],
		array_slice($label, 1, 1),
		['</a>'],
		array_slice($label, 2)
	));
} else {
	$label = htmlspecialcharsbx($arResult['INPUT_LABEL']);
	$linkClassName .= '-link';
}
?>
<div class="main-checkbox-wrapper">
	<label data-bx-user-consent="<?= htmlspecialcharsbx($config) ?>" class="main-checkbox">
		<input type="checkbox" value="Y" <?= ($arParams['IS_CHECKED'] ? 'checked' : '') ?> name="<?= htmlspecialcharsbx($arParams['INPUT_NAME']) ?>">
		<span class="<?= $linkClassName ?>"><?= $label ?></span>
	</label>
</div>

<div data-bx-template="main-user-consent-request-loader" style="display: none;">
	<div class="main-user-consent-request-popup">
		<div class="main-user-consent-request-popup-cont">
			<div class="main-user-consent-request-popup-body">
				<div data-bx-loader="" class="main-user-consent-request-loader">
					<svg class="main-user-consent-request-circular" viewBox="25 25 50 50">
						<circle class="main-user-consent-request-path" cx="50" cy="50" r="20" fill="none" stroke-width="1" stroke-miterlimit="10"></circle>
					</svg>
				</div>
				<div data-bx-content="" class="main-user-consent-request-popup-content">
					<div class="main-user-consent-request-popup-textarea-block">
						<div data-bx-textarea="" class="main-user-consent-request-popup-text"></div>

						<div data-bx-link="" style="display: none;" class="main-user-consent-request-popup-link">
							<div><?= Loc::getMessage('MAIN_USER_CONSENT_REQUEST_URL_CONFIRM') ?></div>
							<div><a target="_blank"></a></div>
						</div>
					</div>
					<div class="main-user-consent-request-popup-buttons">
						<button data-bx-btn-accept="" type="button" class="main-btn">Y</button>
						<button data-bx-btn-reject="" type="button" class="main-btn main-btn--outlined">N</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
