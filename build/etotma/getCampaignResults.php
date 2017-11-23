<?php

$paymentsDb = new \mysqli("potylitcyn.ru", "u0309_etotma", "RfyftdrfDubna1985", "u0309421_love_and_space_database");
if ($paymentsDb->connect_error) {
	die("Connection failed: " . $paymentsDb->connect_error);
}

$paymentsDb->set_charset("utf8"); // Изменение набора символов на utf8
$payments = $paymentsDb->query("SELECT * FROM payments");

$forLove = 0;
$forSpace = 0;

for ($i = 0; $i < $payments->num_rows; $i++) {
	$payment = $payments->fetch_object();
	$paymentSum = floatval($payment->amount);

	if ($payment->system == "")
             continue;

	if ($payment->system != "vk") 
		$paymentSum *= 0.9;
	
	if ($payment->destination == 'love')
		$forLove += $paymentSum;
	else if ($payment->destination == 'space')
		$forSpace += $paymentSum;
}

$distinctNames = $paymentsDb->query("SELECT DISTINCT(name) FROM  payments");


header('Access-Control-Allow-Origin: https://etotma.ru');

echo $forLove . "," . $forSpace . "," . $distinctNames->num_rows;