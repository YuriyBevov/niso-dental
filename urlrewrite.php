<?php
$arUrlRewrite=array (
  0 => 
  array (
    'CONDITION' => '#^\\/?\\/mobileapp/jn\\/(.*)\\/.*#',
    'RULE' => 'componentName=$1',
    'ID' => NULL,
    'PATH' => '/bitrix/services/mobileapp/jn.php',
    'SORT' => 100,
  ),
  5 => 
  array (
    'CONDITION' => '#^/services/([^\\/]+)/($|\\?.*)#',
    'RULE' => 'ELEMENT_CODE=$1',
    'ID' => '',
    'PATH' => '/services/detail.php',
    'SORT' => 100,
  ),
  16 => 
  array (
    'CONDITION' => '#^/portfolio/#',
    'RULE' => '',
    'ID' => 'bitrix:news',
    'PATH' => '/portfolio/index.php',
    'SORT' => 100,
  ),
  20 => 
  array (
    'CONDITION' => '#^/services/#',
    'RULE' => '',
    'ID' => 'bitrix:catalog',
    'PATH' => '/services/index.php',
    'SORT' => 100,
  ),
  15 => 
  array (
    'CONDITION' => '#^/staff/#',
    'RULE' => '',
    'ID' => 'bitrix:news',
    'PATH' => '/staff/index.php',
    'SORT' => 100,
  ),
  22 => 
  array (
    'CONDITION' => '#^/sales/#',
    'RULE' => '',
    'ID' => 'bitrix:news',
    'PATH' => '/sales/index.php',
    'SORT' => 100,
  ),
  1 => 
  array (
    'CONDITION' => '#^/rest/#',
    'RULE' => '',
    'ID' => NULL,
    'PATH' => '/bitrix/services/rest/index.php',
    'SORT' => 100,
  ),
  18 => 
  array (
    'CONDITION' => '#^/blog/#',
    'RULE' => '',
    'ID' => 'bitrix:news',
    'PATH' => '/blog/index.php',
    'SORT' => 100,
  ),
  21 => 
  array (
    'CONDITION' => '#^/news/#',
    'RULE' => '',
    'ID' => 'bitrix:news',
    'PATH' => '/news/index.php',
    'SORT' => 100,
  ),
);
