<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();  ?>

<div class="service-form">
	<?= $arResult["FORM_HEADER"] ?>

	<? if ($arResult["FORM_NOTE"]): ?>

	<div class="service-form__message">
		<span class="service-form__title">Заявка отправлена успешно!</span>
		<span class="base-text">Спасибо, мы скоро свяжемся с Вами!</span>
	</div>

	<? else: ?>
		<span class="service-form__title"><?= $arParams["CUSTOM_FORM_TITLE"] ?: $arResult["FORM_TITLE"] ?></span>
		<div class="service-form__content">
			<? foreach ($arResult["QUESTIONS"] as $FIELD_SID => $arQuestion): ?>

				<?if ($arQuestion["STRUCTURE"][0]["FIELD_TYPE"] == "text") : ?>
					<div class="main-input-wrapper <?= ($arResult["FORM_ERRORS"][$FIELD_SID] ? 'invalid-fld' : '') ?>">
							<label>
								<?= $arQuestion["HTML_CODE"] ?>
							</label>
						</div>
				<? endif; ?>
				<? if ($arQuestion["STRUCTURE"][0]["FIELD_TYPE"] == "checkbox"): ?>
					<div class="main-checkbox-wrapper <?= ($arResult["FORM_ERRORS"][$FIELD_SID] ? 'invalid-fld' : '') ?>">
						<input type="checkbox" id="<?= $arQuestion["STRUCTURE"][0]["ID"] ?>" name="<?='form_'.$arQuestion["STRUCTURE"][0]["FIELD_TYPE"].'_'.$FIELD_SID.'[]'?>" value="<?= $arQuestion["STRUCTURE"][0]["ID"] ?>">
						<label class="main-checkbox" for="<?= $arQuestion["STRUCTURE"][0]["ID"] ?>">
							<span><?=$arQuestion["CAPTION"] ?></span>
						</label>
					</div>
				<? endif; ?>
				<? if ($arQuestion["STRUCTURE"][0]["FIELD_TYPE"] == "hidden"): ?>
						<?= str_replace(
								'value="' . $arQuestion["STRUCTURE"][0]["VALUE"] . '"',
								'value="' . htmlspecialcharsbx($arParams['CUSTOM_SERVICE_TITLE']) . '"',
								$arQuestion["HTML_CODE"]
						) ?>
				<? endif; ?>
			<? endforeach; ?>
			<div class="main-input-wrapper">
				<input class="main-btn" type="submit" name="web_form_submit" value="<?= $arResult["arForm"]["BUTTON"] ?>" />
			</div>
		</div>
		<? endif; ?>
	<?= $arResult["FORM_FOOTER"] ?>
</div>
