<?php

if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) {
	die();
}
/**
 * @var array $arResult
 */
?>

<? if ($arResult["STEP_LIST"]): ?>
	<section class="base-section quiz">
		<div class="container">
			<div class="quiz-form">
				<h2 class="visually-hidden">Квиз</h2>
				<?
				$step = 1;
				$length = count($arResult["STEP_LIST"]); ?>
				<?= $arResult["FORM_HEADER"] ?>
					<? if ($arResult["FORM_NOTE"]): ?>
						<div class="quiz-form__note">
							<div class="quiz-form__note-wrapper">
								<div class="quiz-form__status-line">
									<?
									for ($i = 1; $i <= $length+1; $i++) :?>
										<span class="active"></span>
									<? endfor ;?>
								</div>
								<svg width="60" height="60" viewBox="0 0 60 60" role="img" aria-hidden="true" focusable="false">
									<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-success-circle"></use>
								</svg>
								<span>Готово! Вы прошли опрос.</span>
								<span>Наш менеджер уже получил ваши данные и скоро свяжется с вами.</span>
							</div>
						</div>
					<? else: ?>
						<?
						foreach ($arResult["STEP_LIST"] as $arStep):
						?>
							<?if ($step !== $length) :?>
								<div class="quiz-form__screen quiz-form__screen--question <?= ($step == $arResult["CURRENT_STEP"] ? 'active' : 'visually-hidden') ?>">
									<div class="quiz-form__screen-wrapper">
										<? if ($step === 1) :?>
											<h2 class="base-title">
												<?
												$APPLICATION->IncludeFile(
													SITE_DIR . 'include/quiz-header.php',
													array(),
													array('MODE' => 'html', 'NAME' => 'Заголовок квиза', 'SHOW_BORDER' => true)
												);
												?>
											</h2>
										<? endif ;?>
										<fieldset>
											<? foreach ($arStep as $FIELD_SID => $arQuestion): ?>
												<? if ($arQuestion['STRUCTURE'][0]['FIELD_TYPE'] == 'hidden'): ?>
													<?= $arQuestion["HTML_CODE"]; ?>
												<? endif; ?>
												<? if ($arQuestion["STRUCTURE"][0]["FIELD_TYPE"] == "radio"): ?>
													<legend class="base-title"><?= $arQuestion["CAPTION"] ?></legend>
													<?= $arQuestion["IS_INPUT_CAPTION_IMAGE"] == "Y" ? "<br />" . $arQuestion["IMAGE"]["HTML_CODE"] : "" ?>
													<?= $arQuestion["HTML_CODE"] ?>
												<? endif; ?>
											<? endforeach; ?>
										</fieldset>
										<div class="quiz-form__progress">
											<div class="quiz-form__status-line">
												<?
												for ($i = 1; $i <= $length+1; $i++) :?>
													<span class="<?=($i <= $step) ? 'active' : '' ;?>"></span>
												<? endfor ;?>
											</div>
											<button type="button" class="main-btn main-btn--outlined quiz-form__btn">
												<svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
													<use xlink:href="<?= SITE_TEMPLATE_PATH ?>/assets/sprite.svg#icon-arrow"></use>
												</svg>
												<span>Назад</span>
											</button>
										</div>
										<div class="quiz-form__gift">
											<span>Получить КТ в подарок</span>
										</div>
									</div>
								</div>
							<? else: ?>
							<div class="quiz-form__screen quiz-form__screen--info <?= ($step == $arResult["CURRENT_STEP"] ? 'active' : 'visually-hidden') ?>">
									<div class="quiz-form__screen-wrapper">
										<div class="quiz-form__status-line">
											<?
											for ($i = 1; $i <= $length+1; $i++) :?>
												<span class="<?=($i <= $step) ? 'active' : '' ;?>"></span>
											<? endfor ;?>
										</div>
										<span class="base-title"><?=$arResult["FORM_TITLE"]?></span>
										<span class="quiz-form__desc"><?=$arResult["FORM_DESCRIPTION"]?></span>
											<? foreach ($arStep as $FIELD_SID => $arQuestion): ?>
												<? if ($arQuestion["STRUCTURE"][0]["FIELD_TYPE"] == "text"): ?>
													<div class="main-input-wrapper <?= ($arResult["FORM_ERRORS"][$FIELD_SID] ? 'invalid-fld' : '') ?>">
														<label>
															<?= $arQuestion["HTML_CODE"] ?>
														</label>
													</div>
												<? endif; ?>
												<? if ($arQuestion["STRUCTURE"][0]["FIELD_TYPE"] == "checkbox"): ?>
													<div class="main-checkbox-wrapper <?= ($arResult["FORM_ERRORS"][$FIELD_SID] ? 'invalid-fld' : '') ?>">
														<input type="checkbox" id="<?= $arQuestion["STRUCTURE"][0]["ID"]?>" name="form_checkbox_<?= $FIELD_SID ?>[]" value="<?= $arQuestion["STRUCTURE"][0]["ID"] ?>">
														<label class="main-checkbox" for="<?= $arQuestion["STRUCTURE"][0]["ID"]?>">
															<span><?= $arQuestion["CAPTION"] ?><?= ($arQuestion["REQUIRED"] == "Y" ? '*' : '') ?></span>
														</label>
													</div>
												<? endif; ?>
											<? endforeach; ?>


										<input class="main-btn quiz-form__submit-btn" <?= (intval($arResult["F_RIGHT"]) < 10 ? "disabled=\"disabled\"" : ""); ?> type="submit" name="web_form_submit" value="<?= htmlspecialcharsbx(trim($arResult["arForm"]["BUTTON"]) == '' ? GetMessage("FORM_ADD") : $arResult["arForm"]["BUTTON"]); ?>" />
									</div>
								</div>
							<? endif; ?>
							<? $step++; ?>
						<? endforeach; ?>
					<? endif; ?>
				<?= $arResult["FORM_FOOTER"] ?>
			</div>
		</div>
	</section>
<? endif; ?>
