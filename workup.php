<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetTitle("Страница для разработки");
?><?$APPLICATION->IncludeComponent(
	"bitrix:form.result.new", 
	"quiz-form", 
	[
		"CACHE_TIME" => "3600",
		"CACHE_TYPE" => "A",
		"CHAIN_ITEM_LINK" => "",
		"CHAIN_ITEM_TEXT" => "",
		"EDIT_URL" => "",
		"IGNORE_CUSTOM_TEMPLATE" => "N",
		"LIST_URL" => "",
		"SEF_MODE" => "N",
		"SUCCESS_URL" => "",
		"USE_EXTENDED_ERRORS" => "N",
		"WEB_FORM_ID" => "5",
		"COMPONENT_TEMPLATE" => "quiz-form",
		"VARIABLE_ALIASES" => [
			"WEB_FORM_ID" => "",
			"RESULT_ID" => "",
		]
	],
	false
);?><? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>