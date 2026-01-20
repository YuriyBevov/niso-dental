<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<div class="popup-review-form">
	<?= $arResult["FORM_HEADER"] ?>
	<div class="popup-review-form__header">
		<span class="base-title"><?= $arResult["FORM_TITLE"] ?></span>
		<? if ($arResult["FORM_DESCRIPTION"]): ?>
			<p class="base-text"><?= $arResult["FORM_DESCRIPTION"] ?></p>
		<? endif; ?>
	</div>

	<? if ($arResult["FORM_NOTE"]): ?>
		<p>Спасибо! Мы скоро свяжемся с Вами!</p>
	<? else: ?>
		<? foreach ($arResult["QUESTIONS"] as $FIELD_SID => $arQuestion): ?>
			<? if ($arQuestion['STRUCTURE'][0]['FIELD_TYPE'] == 'hidden'): ?>
				<?= $arQuestion["HTML_CODE"] ?>
			<? else: ?>
				<!-- <?= $arQuestion["HTML_CODE"] ?> -->

				<? if ($arQuestion['STRUCTURE'][0]["FIELD_TYPE"] == 'radio'): ?>
					<div class="rate <?= ($arResult["FORM_ERRORS"][$FIELD_SID] ? 'invalid-fld' : '') ?>">
						<span class="base-text">Ваша оценка:</span>
						<div class="rate__wrapper">
							<? foreach ($arQuestion['STRUCTURE'] as $arRadio): ?>
								<label>
									<input type="radio" name="form_radio_RATE" value="<?= $arRadio["ID"] ?>" checked>
									<svg width="16" height="16" role="img" aria-hidden="true" focusable="false">
										<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-star"></use>
									</svg>
								</label>
							<? endforeach; ?>
						</div>
					</div>
				<? endif; ?>

				<? if ($arQuestion['STRUCTURE'][0]["FIELD_TYPE"] == 'text'): ?>
					<div class="main-input-wrapper <?= ($arResult["FORM_ERRORS"][$FIELD_SID] ? 'invalid-fld' : '') ?>">
						<label>
							<?= $arQuestion["HTML_CODE"] ?>
						</label>
					</div>
				<? endif; ?>
				<? if ($arQuestion['STRUCTURE'][0]["FIELD_TYPE"] == 'textarea'): ?>
					<div class="main-textarea-wrapper <?= ($arResult["FORM_ERRORS"][$FIELD_SID] ? 'invalid-fld' : '') ?>">
						<label>
							<?= $arQuestion["HTML_CODE"] ?>
						</label>
					</div>
				<? endif; ?>

				<? if ($arQuestion["STRUCTURE"][0]["FIELD_TYPE"] == "checkbox"): ?>
					<div class="main-checkbox-wrapper <?= ($arResult["FORM_ERRORS"][$FIELD_SID] ? 'invalid-fld' : '') ?>">
						<input type="checkbox" id="<?= $arQuestion["STRUCTURE"][0]["ID"] ?>" name="form_checkbox_<?= $FIELD_SID ?>[]" value="<?= $arQuestion["STRUCTURE"][0]["ID"] ?>">
						<label class="main-checkbox" for="<?= $arQuestion["STRUCTURE"][0]["ID"] ?>">
							<span><?= $arQuestion["CAPTION"] ?></span>
						</label>
					</div>
				<? endif; ?>
			<? endif; ?>
		<? endforeach; ?>

		<? if ($arResult["isUseCaptcha"] == "Y"): ?>
			<div class="captcha-block <?= ($arResult["FORM_ERRORS"][0] ? 'invalid-fld' : '') ?>">
				<input type="hidden" name="captcha_sid" value="<?= htmlspecialcharsbx($arResult["CAPTCHACode"]); ?>" />
				<div class="main-input-wrapper">
					<input type="text" placeholder="Введите символы с картинки" name="captcha_word" size="30" maxlength="50" value="" class="inputtext" />
				</div>
				<div class="captcha-block__img-wrapper">
					<img src="/bitrix/tools/captcha.php?captcha_sid=<?= htmlspecialcharsbx($arResult["CAPTCHACode"]); ?>" width="180" height="40" alt="" />
				</div>
			</div>
		<? endif; ?>

		<?/* $APPLICATION->IncludeComponent(
			"bitrix:main.userconsent.request",
			"user-consent",
			array(
				"AUTO_SAVE" => "Y",
				"COMPOSITE_FRAME_MODE" => "A",
				"COMPOSITE_FRAME_TYPE" => "AUTO",
				"ID" => "1",
				"IS_CHECKED" => "Y",
				"IS_LOADED" => "Y",
				"COMPONENT_TEMPLATE" => "user-consent"
			),
			$component
		); */ ?>

		<div class="main-input-wrapper">
			<label>
				<input type="submit" name="web_form_submit" value="<?= $arResult["arForm"]["BUTTON"] ?>" />
			</label>
		</div>

	<? endif; ?>

	<?= $arResult["FORM_FOOTER"] ?>
</div>

<!-- <script>
	// !!! Переменная ajaxSuccessHandlerAdded проверяет, был ли уже добавлен обработчик.
	// !!! Обработчик добавляется только один раз.
	if (!window.ajaxSuccessHandlerAdded) {
		// BX.UserConsent.loadFromForms();
		BX.addCustomEvent("onAjaxSuccess", function() {
			// Переинициализация скриптов
			const items = document.querySelectorAll(".rate__wrapper input");
			if (items.length) {
				const fillStars = (index) => {
					items.forEach((item, i) => {
						if (i <= index) {
							!item.parentNode.classList.contains("filled") ?
								item.parentNode.classList.add("filled") :
								null;
						} else {
							item.parentNode.classList.contains("filled") ?
								item.parentNode.classList.remove("filled") :
								null;
						}
					});
				};

				for (let i = 4; i >= 0; i--) {
					if (items[i].checked) {
						fillStars(i);
						break;
					}
				}

				items.forEach((item, index) => {
					item.addEventListener("change", () => {
						fillStars(index);
					});
				});
			}
		});
		window.ajaxSuccessHandlerAdded = true;
	}
</script> -->


<script>
	function initRatingStars() {
		const items = document.querySelectorAll(".rate__wrapper input[type='radio']");
		if (!items.length) return;

		const fillStars = (index) => {
			items.forEach((item, i) => {
				if (i <= index) {
					item.parentNode.classList.add("filled");
				} else {
					item.parentNode.classList.remove("filled");
				}
			});
		};

		// Установить начальное состояние
		let checkedFound = false;
		for (let i = items.length - 1; i >= 0; i--) {
			if (items[i].checked) {
				fillStars(i);
				checkedFound = true;
				break;
			}
		}
		// Если ничего не выбрано — можно сбросить или оставить как есть
		if (!checkedFound && items[0]) {
			// опционально: items[0].checked = true; fillStars(0);
		}

		// Навесить обработчики (только один раз)
		items.forEach((item, index) => {
			if (!item.dataset.initialized) {
				item.addEventListener("change", () => fillStars(index));
				item.dataset.initialized = "true";
			}
		});
	}

	// Запуск при первоначальной загрузке
	if (typeof BX !== 'undefined' && BX.ready) {
		BX.ready(initRatingStars);
	} else {
		document.addEventListener("DOMContentLoaded", initRatingStars);
	}

	// Запуск после AJAX-обновления формы
	if (!window.ajaxSuccessHandlerAdded) {
		if (typeof BX !== 'undefined') {
			BX.addCustomEvent("onAjaxSuccess", initRatingStars);
		}
		window.ajaxSuccessHandlerAdded = true;
	}
</script>
