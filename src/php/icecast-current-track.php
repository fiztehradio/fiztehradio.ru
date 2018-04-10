<?php
header('Access-Control-Allow-Origin: *');
$status_json = @file_get_contents('http://radio.mipt.ru:8410./status-json.xsl');
$status = json_decode($status_json);

$now = "";
if (property_exists($status->{'icestats'}, "source"))
    $now = $status->{'icestats'}->{'source'}->{'title'};
header('Access-Control-Allow-Origin: *');
print_r($now);
