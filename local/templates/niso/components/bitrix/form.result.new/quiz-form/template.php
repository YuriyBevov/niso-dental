<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<?
$step = 1;
$length = count($arResult["QUIZ_QUESTIONS"]) + 2 ?>

<? if ($arResult["isFormErrors"] == "Y"): ?>
	<?= $arResult["FORM_ERRORS_TEXT"]; ?>
<? endif; ?>

<section class="base-section quiz-form">
	<div class="container">
		<div class="quiz-form__wrapper">
			<? if ($arResult["FORM_NOTE"]): ?>
				<div class="quiz-form__note">
					<div class="quiz-form__screen quiz-form__screen--last-step">
						<div class="quiz-form__content">
							<div class="quiz-form__status-line">
								<?
								for ($i = 1; $i <= $length; $i++) : ?>
									<span class="active"></span>
								<? endfor; ?>
							</div>
							<svg class="quiz-form__success" width="48" height="48" viewBox="0 0 48 48" role="img" aria-hidden="true" focusable="false">
								<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-success-circle"></use>
							</svg>
							<span class="quiz-form__success">Готово! Вы прошли опрос.</span>
							<span>Наш менеджер уже получил ваши данные и скоро свяжется с вами.</span>
						</div>
					</div>
				</div>
			<? else: ?>
				<?= $arResult["FORM_HEADER"] ?>

				<? foreach ($arResult["QUESTIONS"] as $FIELD_SID => $arQuestion): ?>
					<? if ($arQuestion['STRUCTURE'][0]['FIELD_TYPE'] == 'hidden'): ?>
						<?= $arQuestion["HTML_CODE"]; ?>
					<? endif; ?>
				<? endforeach; ?>

				<div class="swiper">
					<div class="swiper-wrapper">
						<? foreach ($arResult["QUIZ_QUESTIONS"] as $arQuestion): ?>
							<div class="swiper-slide">
								<div class="quiz-form__screen quiz-form__screen--question">
									<div class="quiz-form__content">

										<div class="quiz-form__status-line">
											<?
											for ($i = 1; $i <= $length; $i++) : ?>
												<span class="<?= ($i <= $step) ? 'active' : ''; ?>"></span>
											<? endfor; ?>
											<? $step++ ?>
										</div>
										<fieldset>
											<legend class="base-title"><?= $arQuestion["CAPTION"] ?></legend>
											<?= $arQuestion["HTML_CODE"] ?>
										</fieldset>
									</div>
								</div>
							</div>
						<? endforeach; ?>

						<div class="swiper-slide">
							<div class="quiz-form__screen quiz-form__screen--last-step">
								<div class="quiz-form__content">
									<div class="quiz-form__status-line">
										<?
										for ($i = 1; $i <= $length; $i++) : ?>
											<span class="<?= ($i <= $length - 1) ? 'active' : ''; ?>"></span>
										<? endfor; ?>
									</div>
									<span class="base-title">Получите бесплатный расчёт лечения и снимок КТ в подарок!</span>
									<span class="base-text">На основе ваших ответов врач подготовит предварительный план лечения</span>

									<? foreach ($arResult["USER_DATA"] as $FIELD_SID => $arQuestion): ?>

										<? if ($arQuestion["STRUCTURE"][0]["FIELD_TYPE"] === "text"): ?>
											<div class="main-input-wrapper<?= ($arResult["FORM_ERRORS"][$FIELD_SID] ? ' invalid-fld' : '') ?>">
												<label>
													<?/*<span><?= $arQuestion["CAPTION"] ?><span class="required-mark"><?= ($arQuestion["REQUIRED"] == "Y" ? '*' : '') ?></span></span>*/ ?>
													<?= $arQuestion["HTML_CODE"] ?>
												</label>
											</div>
										<? endif; ?>
										<? if ($arQuestion["STRUCTURE"][0]["FIELD_TYPE"] === "checkbox"): ?>
											<div class="main-checkbox-wrapper <?= ($arResult["FORM_ERRORS"][$FIELD_SID] ? 'invalid-fld' : '') ?>">
												<input type="checkbox" id="<?= $arQuestion["STRUCTURE"][0]["ID"] ?>" name="form_checkbox_<?= $FIELD_SID ?>[]" value="<?= $arQuestion["STRUCTURE"][0]["ID"] ?>">
												<label class="main-checkbox" for="<?= $arQuestion["STRUCTURE"][0]["ID"] . ($arParams["IS_MODAL"] ? '_modal' : null) ?>">
													<span><?= $arQuestion["CAPTION"] ?><?= ($arQuestion["REQUIRED"] == "Y" ? '*' : '') ?></span>
												</label>
											</div>
										<? endif; ?>
									<? endforeach; ?>
									<? if ($arResult["isUseCaptcha"] == "Y"): ?>
										<input type="hidden" name="captcha_sid" value="<?= htmlspecialcharsbx($arResult["CAPTCHACode"]); ?>" />
										<img src="/bitrix/tools/captcha.php?captcha_sid=<?= htmlspecialcharsbx($arResult["CAPTCHACode"]); ?>" width="180" height="40" alt="" />
										<?= GetMessage("FORM_CAPTCHA_FIELD_TITLE") ?><?= $arResult["REQUIRED_SIGN"]; ?>
										<input type="text" name="captcha_word" size="30" maxlength="50" value="" class="inputtext" />
									<? endif; ?>

									<input type="hidden" name="web_form_apply" value="Y" />
									<input class="main-btn" type="submit" disabled name="web_form_submit" value="<?= htmlspecialcharsbx(trim($arResult["arForm"]["BUTTON"]) == '' ? GetMessage("FORM_ADD") : $arResult["arForm"]["BUTTON"]); ?>" />
								</div>
							</div>
						</div>
					</div>

					<div class="quiz-form__footer">
						<div class="quiz-form__footer-content">
							<div class="swiper-navigation">
								<button class="swiper-button swiper-button-prev main-btn main-btn--outlined" type="button" aria-label="Назад">
									<svg width="20" height="20" viewBox="0 0 20 20" role="img" aria-hidden="true" focusable="false">
										<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-arrow"></use>
									</svg>
									<span> Назад</span>
								</button>
								<button class="swiper-button swiper-button-next main-btn main-btn--outlined" type="button" aria-label="Вперед">
									<span> Вперед</span>
									<svg width="20" height="20" viewBox="0 0 20 20" role="img" aria-hidden="true" focusable="false">
										<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-arrow"></use>
									</svg>
								</button>

							</div>
							<div class="quiz-form__gift">
								 <?
									$APPLICATION->IncludeFile(
										SITE_DIR . 'include/quiz/index.php',
										array(),
										array('MODE' => 'html', 'NAME' => 'Название подарка', 'SHOW_BORDER' => true)
									);
									?>
							</div>
						</div>
					</div>
				</div>

				<?= $arResult["FORM_FOOTER"] ?>

			<? endif; ?>
		</div>
	</div>
</section>
