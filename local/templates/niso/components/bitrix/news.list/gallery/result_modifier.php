<?

$items = $arResult['ITEMS'];
$mainGallery = [];
$sliderGallery = [];

foreach ($items as $item) {
  if ($item['PROPERTIES']['ADD_TO_SLIDER']['VALUE'] !== 'Y') {
    $mainGallery[] = $item;
  } else {
    $sliderGallery[] = $item;
  }
}

$arResult['MAIN_GALLERY'] = $mainGallery;
$arResult['SLIDER_GALLERY'] = $sliderGallery;
