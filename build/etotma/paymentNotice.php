<?php

header('Access-Control-Allow-Origin: https://etotma.ru');

date_default_timezone_set('Europe/Moscow');
$date = date('d.m.Y H:i:s', time());

$paymentsDb = new \mysqli("potylitcyn.ru", "u0309_etotma", "RfyftdrfDubna1985", "u0309421_love_and_space_database");
if (!$paymentsDb->connect_error)
{
	$paymentsDb->set_charset("utf8");
}
else
{	
	error_log("MySQLi error", 0);
	return false;
}

$name = $paymentsDb->real_escape_string(strip_tags($_REQUEST["name"]));
$contact = $paymentsDb->real_escape_string(strip_tags($_REQUEST["contact"]));
$comment = $paymentsDb->real_escape_string(strip_tags($_REQUEST["comment"]));
$payment = json_decode($_REQUEST["payment"], true);

if (empty($payment))
{
	error_log('empty($payment)', 0);
	return false;
}

foreach ($payment["products"] as $product_str)
{
	$product = array();
	parse_str($product_str, $product);
	
	$productKeys = array_keys($product);
	$productValues = array_values($product);
	
	$productName = $paymentsDb->real_escape_string(strip_tags($productKeys[0]));
	$productPrice = $paymentsDb->real_escape_string(strip_tags($productValues[0]));

	//$currency = $paymentsDb->real_escape_string(strip_tags($_POST["payment"]["currency"]));
	$currency = "р.";
	$system = $paymentsDb->real_escape_string(strip_tags($payment["sys"]));
	
	$destination = "space";
	if (strpos($productName, "любовь") !== false)
		$destination = "love";
	
	if (!$paymentsDb->query("INSERT INTO payments (name, contact, date, comment, system, currency, destination, amount) 
						VALUES('$name', '$contact', '$date', '$comment', '$system', '$currency', '$destination', '$productPrice')")
	)
	{
		error_log("Failed to insert data into the database", 0);
		return false;
	}
}

return true;
?>