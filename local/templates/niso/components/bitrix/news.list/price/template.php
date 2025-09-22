<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
$this->setFrameMode(true);
?>

<?foreach($arResult["SECTION_TREE"] as $arSection):?>
	<div class="price__item">
		<h2><strong><?=$arSection["NAME"]?></strong></h2>
		<table>
			<thead>
				<tr>
					<td class="price__table-first-column">Наименование услуги</td>
					<td class="price__table-second-column">Цена</td>
				</tr>
			</thead>
			<tbody>
				<?foreach($arSection["CHILDREN"] as $arSubection):?>
				<tr>
					<td class="price__item-subtitle" colspan="2"><strong><?=$arSubection["NAME"]?></strong></td>
				</tr>
					<?foreach($arSubection["ITEMS"] as $arItem):?>
						<tr>
							<td class="price__table-first-column"><?=$arItem["NAME"]?></td>
							<td class="price__table-second-column"><strong><?=$arItem["PROPERTIES"]["SERVICE_PRICE"]["VALUE"]?></strong></td>
						</tr>
					<? endforeach; ?>
				<? endforeach; ?>
			</tbody>
		</table>
	</div>
<?endforeach;?>




