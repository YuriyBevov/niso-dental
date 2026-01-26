<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<? if ($arResult["ITEMS"]):
  $arItem = $arResult["ITEMS"][0];
  $bg = CFile::GetPath($arResult["PICTURE"]);
?>
  <section class="section top-banner" style="background-image: url('<?= $bg ? $bg : "" ?>')">
    <div class="container">

      <div class="top-banner__content">
        <h2 class="title"><?= $arItem["NAME"] ?></h2>
        <p class="base-text"><?= $arItem["PREVIEW_TEXT"] ?></p>

        <button class="btn" data-form-id="6">Узнать стоимость</button>
      </div>

      <div class="top-banner__side">
        <img src="<?= $arItem["PREVIEW_PICTURE"]["SRC"] ?>" alt="Врач проводящий процедуру" width="570" height="600">

        <div class="label label--left">
          <img src="<?= SITE_TEMPLATE_PATH . '/assets/images/label.png' ?>" alt="Рейтинг на врача" width="220" height="110">
        </div>

        <div class="label label--right">
          <?= $arItem["DETAIL_TEXT"] ?>
        </div>
      </div>

    </div>
  </section>

<? endif; ?>