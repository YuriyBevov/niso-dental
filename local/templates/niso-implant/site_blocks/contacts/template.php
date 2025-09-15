<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Page\Asset;

Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/site_blocks/contacts/style.css");
?>


<? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_VIEW_TYPE"] === "--grid-view-type-1" || $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_VIEW_TYPE"] === "--grid-view-type-2"): ?>
  <? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/contacts/view-type-1-2.php");  ?>
<? endif; ?>

<? if ($GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_CONTACTS_VIEW_TYPE"] === "--grid-view-type-3"): ?>
  <? include_once($_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/site_blocks/contacts/view-type-3.php");  ?>
<? endif; ?>