<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host    = 'localhost';
$db      = 'demo';
$user    = 'tester';
$pass    = 'Tester@1992';
$charset = 'utf8';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$opt = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        ];


$dbh = new PDO($dsn, $user, $pass, $opt);


//	$sql  = $dbh->query("SELECT distinct country, cat1, cat2, cat3 FROM linio.A_Master_Catalog order by Cat3");

$sql  = $dbh->query("select (@cnt := @cnt + 1) AS id, intvalue, FROM_UNIXTIME(t_stamp/1000) as time 
FROM demo.sqlt_data_1_2018_05 
CROSS JOIN (SELECT @cnt := 0) AS dummy 
where tagid = 5 order by t_stamp desc limit 50;");



	$data = array();
	while ($row = $sql->fetchall()) {

//	$data['records1'] = $row;

	    $data = $row;
	}

//	echo json_encode($data, JSON_PRETTY_PRINT)

//	$data = ("records":$data);

	echo json_encode($data);

	$data1 = json_encode($data);

	$json_data = json_encode($data);
	file_put_contents('myfile.json', $json_data);

//	print json_encode($data);


$myfile = fopen("../smarttablechart/jsondata/Ignition.json", "w") or die("Unable to open Ignition.json");

fwrite($myfile, $data1);
fclose($myfile);


$myfile = fopen("../smarttablechart/jsondata/Ignition1.json", "w") or die("Unable to open Ignition1.json");


fwrite($myfile, $data1);

fclose($myfile);

$myfile = fopen("../smarttablechart/jsondata/Ignition2.json", "w") or die("Unable to open Ignition2.json");

fwrite($myfile, $data1);
fclose($myfile);

?>




