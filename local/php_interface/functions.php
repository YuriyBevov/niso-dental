<?
function debug($data)
{
	echo '<pre>' . print_r($data, 1) . '</pre>';
};

function normalizePhoneHref($phone)
{
	$pattern = '/[^0-9]/';
	return '+' . preg_replace($pattern, "", $phone);
}
