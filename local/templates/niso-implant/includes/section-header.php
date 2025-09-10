<div
  class="
    section-header
    <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_SECTION_HEADER_WIDTH"] ?>
    <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_SECTION_HEADER_ALIGN_CENTER"] ?>
  ">
  <h2
    class="
    section-title
    <?= $GLOBALS['TEMPLATE_SETTINGS']["GLOBAL_SECTION_TITLE_UNDERLINED"] ?>">
    <?= $arParams["TITLE"] ?>
  </h2>
  <? if ($arParams["DESCRIPTION"]): ?>
    <p><?= $arParams["DESCRIPTION"] ?></p>
  <? endif; ?>
</div>