<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

// debug($arResult["arAnswers"]);

function FillInput($strType, $strName, $strValue, $strCmp, $strPrintValue = false, $strPrint = "", $field1 = "", $strId = "")
{
	// debug($strName);
	$bCheck = false;
	if ($strValue <> '') {
		if (is_array($strCmp)) {
			$bCheck = in_array($strValue, $strCmp);
		} elseif ($strCmp <> '') {
			$bCheck = in_array($strValue, explode(",", $strCmp));
		}
	}
	$bLabel = false;
	if ($strType == 'radio') {
		$bLabel = false;
	}

	$bId = true;
	if ($strType == 'radio' || $strType == 'checkbox') {
		$bId = !preg_match('/^id="/', $field1) && !preg_match('/\sid="/', $field1);
	}

	return ($bLabel ? '<label>' : '') . '<input type="' . $strType . '" ' . $field1 . ' name="' . $strName . '"' .
		($bId ? ' id="' . ($strId <> '' ? $strId : $strName) . '"' : '') .
		' value="' . $strValue . '"' .
		($bCheck ? ' checked' : '') . '>' . ($strPrintValue ? $strValue : $strPrint) . ($bLabel ? '</label>' : '');
}

foreach ($arResult["arAnswers"] as $FIELD_SID => $arAns) {
	$res = '';
	// debug($FIELD_SID);
	foreach ($arAns as $arAnswer) {
		if ($arAnswer["FIELD_TYPE"] === 'radio') {
			if (mb_strpos($arAnswer["FIELD_PARAM"], "id=") === false) {
				$ans_id = $arAnswer["ID"];
				$arAnswer["FIELD_PARAM"] .= " id=\"" . $ans_id . "\"";
			} else {
				$ans_id = "";
			}

			$value = CForm::GetRadioValue($FIELD_SID, $arAnswer, $arResult["arrVALUES"]);

			if ($arResult["isFormErrors"] == 'Y') {
				if (
					mb_strpos(mb_strtolower($arAnswer["FIELD_PARAM"]), "selected") !== false
					||
					mb_strpos(mb_strtolower($arAnswer["FIELD_PARAM"]), "checked") !== false
				) {
					$arAnswer["FIELD_PARAM"] = preg_replace("/checked|selected/i", "", $arAnswer["FIELD_PARAM"]);
				}
			}

			$input = FillInput("radio", "form_radio_" . $FIELD_SID, $arAnswer["ID"], $value, false, "", $arAnswer["FIELD_PARAM"]);

			if ($ans_id <> '') {
				$res .= "<div class='main-radio-wrapper'><label for=\"" . $ans_id . "\">" . $input . '<span>' . '</span>' . '<span>' . $arAnswer["MESSAGE"] . '</span>' . "</label></div>";
			} else {
				$res .= "<label>" . $input . $arAnswer["MESSAGE"] . "</label>";
			}

			$arResult["QUESTIONS"][$FIELD_SID]["HTML_CODE"] = $res;
		}
	}
}


$arResult["QUIZ_QUESTIONS"] = [];
$arResult["USER_DATA"] = [];

if (!empty($arResult["QUESTIONS"])) {

	foreach ($arResult["QUESTIONS"] as $FIELD_SID => &$arQuestion) {
		if ($arQuestion["STRUCTURE"][0]["FIELD_TYPE"] === "radio") {
			$arResult["QUIZ_QUESTIONS"][$FIELD_SID] = $arQuestion;
		} else {
			$arResult["USER_DATA"][$FIELD_SID] = $arQuestion;
		}
	}
}
