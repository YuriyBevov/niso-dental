<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]): ?>
  <ul class="social-list">
    <? foreach ($arResult["ITEMS"] as $arItem):
      $src = CFile::GetPath($arItem["PROPERTIES"]["ICON"]["VALUE"]);
    ?>
      <li class="social-list__item">
        <a href="<?= $arItem["CODE"] ?>" aria-label="<?= $arItem["NAME"] ?>">
          <img src="<?= $src ?>" alt="<?= $arItem["NAME"] ?>" width="24" height="24">
        </a>
      </li>
    <? endforeach; ?>
  </ul>
<? endif; ?>