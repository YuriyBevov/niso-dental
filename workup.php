<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetTitle("Страница для разработки");
?>
<div class="container">
	<div class="clinic-map__wrapper">
		<div class="clinic-map__buttons">
			<a
				class="clinic-map__button clinic-map__button--yandex"
				href="https://yandex.ru/maps/2/saint-petersburg/?mode=routes&amp;rtext=~59.971247%2C30.309169&amp;ruri=~ymapsbm1%3A%2F%2Forg%3Foid%3D159276084724"
				target="_blank"
				rel="noopener">
				<span>Построить маршрут</span>
			</a>
			<a
				class="clinic-map__button clinic-map__button--2gis"
				href="https://2gis.ru/directions/points/%7C30.309169,59.971247;70000001087386737"
				target="_blank"
				rel="noopener">
				<span> Построить маршрут</span>
			</a>
		</div>
		<div id="clinic-map"></div>
	</div>
</div>

<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>