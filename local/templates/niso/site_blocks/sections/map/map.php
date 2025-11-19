<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Page\Asset;

Asset::getInstance()->addCss(SITE_TEMPLATE_PATH . "/site_blocks/sections/map/style.css");
?>

<section class="base-section map">
  <div class="container">
    <div class="base-section__header">
		  <h2 class="base-title">Как нас найти</h2>
    </div>

      <?
        $APPLICATION->IncludeFile(
          SITE_DIR . 'include/map.php',
          array(),
          array('MODE' => 'html', 'NAME' => 'карту', 'SHOW_BORDER' => true)
        );
      ?>

  </div>
</section>
