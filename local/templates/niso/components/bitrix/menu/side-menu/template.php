<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<div class="sidemenu">
	<ul class="sidemenu__list">
		<?
		$previousLevel = 0;
		foreach ($arResult as $arItem):
		?>
			<? if ($previousLevel && $arItem["DEPTH_LEVEL"] < $previousLevel): ?>
				<?= str_repeat("</ul></li>", ($previousLevel - $arItem["DEPTH_LEVEL"])); ?>
			<? endif; ?>
			<? if ($arItem["IS_PARENT"]): ?>
				<li class="sidemenu__list-item">
					<span>
						<?= $arItem["TEXT"] ?>
					</span>
					<svg width="12" height="12" role="img" aria-hidden="true" focusable="false">
						<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-menu-arrow"></use>
					</svg>
					<ul>
					<? else: ?>
						<li><a class="<?= ($arItem["SELECTED"] ? 'selected' : null) ?>" href="<?= $arItem["LINK"] ?>"><?= $arItem["TEXT"] ?></a></li>
					<? endif ?>
					<? $previousLevel = $arItem["DEPTH_LEVEL"]; ?>
				<? endforeach ?>

				<? if ($previousLevel > 1): ?>
					<?= str_repeat("</ul></li>", ($previousLevel - 1)); ?>
				<? endif ?>
					</ul>
</div>